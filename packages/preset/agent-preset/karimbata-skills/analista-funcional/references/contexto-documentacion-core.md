# Documentación de Fortaleza Core

## 1. Propósito del documento

Este documento describe la arquitectura, los proyectos, los módulos funcionales, las integraciones, el modelo de datos y la operación general del repositorio **FORTALEZACORE**. El análisis de persistencia se complementó con el DDL completo ubicado en `C:\Users\robertruiz\source\repos\BaseDatosCore\DdlBases\dbFortalezaCore.sql`.

Está orientado a desarrolladores, analistas funcionales, responsables de soporte y personas que necesiten mantener o extender la solución. La descripción se obtuvo mediante revisión estática del repositorio; los nombres de procesos y reglas funcionales se infieren del código, el modelo Entity Framework, los controladores, las vistas y los scripts SQL existentes.

> Nota: el repositorio de la aplicación sólo contiene algunos scripts incrementales. El DDL externo consultado representa una fotografía de la estructura de `dbFortalezaCore` generada el 5 de agosto de 2026. Los datos, parámetros de ejecución, paquetes publicados en `SSISDB`, objetos de servidores vinculados y cambios posteriores no forman parte de esta documentación estática.

## 2. Resumen ejecutivo

Fortaleza Core es un sistema empresarial para administrar el ciclo de vida de clientes, contratos, planes, productos, cuotas, cobranzas, comprobantes, pagos, pagarés, inmuebles, adjudicaciones y procesos contables. Se integra con SAP Business One, Microsoft Dynamics 365, Azure Service Bus, Bancard, DebiPago, servicios FTP, SQL Server Integration Services y servicios de generación de reportes.

La solución está construida principalmente con:

- .NET Framework 4.5, 4.6.1 y 4.6.2.
- ASP.NET MVC 5 y Razor.
- ASP.NET Identity 2 y middleware OWIN.
- Entity Framework 6 con modelo Database First (`.edmx`).
- SQL Server y procedimientos almacenados.
- Dapper y consultas SQL directas para procesos especializados.
- log4net y, en algunos componentes, NLog.
- MSTest, Moq y algunas referencias a NUnit.
- Paquetes SSIS para movimientos e integraciones de datos.

La aplicación principal es un monolito MVC. La mayor parte de la lógica está distribuida entre controladores, repositorios personalizados, código generado desde el modelo de datos y procedimientos almacenados.

## 3. Estructura general del repositorio

```text
FORTALEZACORE/
├── DEV/
│   └── SQL/
│       ├── New/
│       └── OLD/
├── MicrotechIdentity/
│   ├── AspNetIdentity2ExtendingUsersAndRoles/
│   ├── FortalezaCore2D365/
│   ├── FortalezaCoreProcesosSSIS/
│   ├── FortalezaCoreUnitTest/
│   ├── FortalezaCoreWebApp/
│   ├── FortalezaCoreWebClient/
│   ├── MicrotechCommonLib/
│   ├── MicrotechIdentityUnitTest/
│   ├── MicrotechIdentityWinAuth/
│   ├── packages/
│   └── MicrotechIdentity.sln
├── .gitignore
└── DocumentacionCore.md
```

### 3.1 Solución principal

La solución [`MicrotechIdentity.sln`](MicrotechIdentity/MicrotechIdentity.sln) contiene siete proyectos:

| Proyecto | Tipo | Framework | Responsabilidad |
|---|---|---:|---|
| `MicrotechIdentity` | Aplicación web MVC/API | 4.6.2 | Identidad, usuarios, roles, permisos, OAuth y configuraciones compartidas. |
| `FortalezaCoreWebApp` | Aplicación web MVC | 4.6.2 | Aplicación funcional principal de Fortaleza Core. |
| `MicrotechIdentityWinAuth` | Aplicación web MVC | 4.6.1 | Autenticación integrada de Windows y puente hacia la cookie compartida. |
| `FortalezaCoreWebClient` | Ejecutable | 4.6.2 | Clientes de integración con SAP, Bancard, DebiPago y Dynamics 365. |
| `FortalezaCore2D365` | Ejecutable | 4.6.2 | Consumidor de Azure Service Bus y sincronización hacia D365/gateway. |
| `MicrotechCommonLib` | Ejecutable reutilizado como librería | 4.5 | Utilidades HTTP, SAP, SSIS, correo, resultados y reflexión. |
| `FortalezaCoreUnitTest` | Pruebas MSTest | 4.6.2 | Pruebas de repositorios, pantallas, procedimientos e integraciones. |

No están incluidos en la solución principal:

- `FortalezaCoreProcesosSSIS`.
- `MicrotechIdentityUnitTest`.

## 4. Arquitectura lógica

```text
Usuario interno
    │
    ▼
MicrotechIdentityWinAuth ──► MicrotechIdentity
    │                           │
    └──── cookie compartida ◄───┘
                │
                ▼
       FortalezaCoreWebApp
         │       │       │
         │       │       ├──► SAP Business One
         │       ├──────────► Dynamics 365 / Gateway
         ├──────────────────► Bancard / DebiPago
         ├──────────────────► SSIS / SQL Server
         └──────────────────► Reportes / archivos / FTP

Azure Service Bus
    │
    ▼
FortalezaCore2D365 ──► Gateway ──► Dynamics 365
```

### 4.1 Capas existentes

La aplicación no sigue una separación estricta por capas, pero conceptualmente contiene:

1. **Presentación**: vistas Razor, JavaScript, DataTables, Bootstrap y formularios MVC.
2. **Controladores**: orquestan navegación, validaciones, acceso a datos, integraciones y reglas de negocio.
3. **Repositorios**:
   - Repositorios generados para las entidades del EDMX.
   - Repositorios personalizados para operaciones complejas.
   - Repositorios del sistema de identidad.
4. **Persistencia**: Entity Framework, Dapper, ADO.NET y procedimientos almacenados.
5. **Integración**: clientes HTTP/SOAP, Azure Service Bus, SAP DI API, FTP y SSIS.
6. **Infraestructura transversal**: autenticación, permisos, logging, configuración, correo y archivos.

## 5. Proyectos y componentes

## 5.1 FortalezaCoreWebApp

Ubicación: [`MicrotechIdentity/FortalezaCoreWebApp`](MicrotechIdentity/FortalezaCoreWebApp)

Es la aplicación de negocio principal. Contiene aproximadamente:

- 94 controladores.
- 657 vistas Razor.
- 312 archivos C# bajo `Models`.
- 268 archivos C# bajo `Repositories`.
- 205 entidades mapeadas en Entity Framework.

### Carpetas principales

| Carpeta | Descripción |
|---|---|
| `App_Start` | Rutas, bundles, autenticación OWIN y acceso a configuración. |
| `Controllers` | Casos de uso y endpoints MVC. |
| `Models` | Entidades generadas por EDMX, view models y DTO. |
| `Repositories/GeneratedCode` | Repositorios generados para entidades. |
| `Repositories/CustomCode` | Extensiones y lógica de persistencia especializada. |
| `Views` | Pantallas Razor organizadas por controlador o módulo. |
| `ReportesPdf` | Generación de estados de cuenta, pagarés y reportes PDF. |
| `Scripts`, `Content`, `css` | JavaScript, bibliotecas y estilos de la interfaz. |
| `SqlServerTypes` | Carga de componentes nativos de SQL Server Types. |

### Inicio de la aplicación

El arranque se encuentra en:

- [`Global.asax.cs`](MicrotechIdentity/FortalezaCoreWebApp/Global.asax.cs).
- [`Startup.cs`](MicrotechIdentity/FortalezaCoreWebApp/Startup.cs).
- [`Startup.Auth.cs`](MicrotechIdentity/FortalezaCoreWebApp/App_Start/Startup.Auth.cs).

Durante el inicio se registran rutas, filtros, bundles, serialización JSON, roles de menú, SQL Server Types y TLS 1.2.

### Controlador base

[`ControllerBase.cs`](MicrotechIdentity/FortalezaCoreWebApp/Controllers/ControllerBase.cs) proporciona a los controladores derivados:

- Contexto `dbFortalezaCoreEntities`.
- Fábrica de repositorios `EdmRepositoryFactory`.
- Acceso a configuraciones y usuarios.
- Obtención del usuario y sus roles.
- Logging.
- Manejo común de excepciones.
- Filtro de permisos para roles `ADMIN,RRHH`, complementado por permisos configurables.

## 5.2 MicrotechIdentity

Ubicación: [`MicrotechIdentity/AspNetIdentity2ExtendingUsersAndRoles`](MicrotechIdentity/AspNetIdentity2ExtendingUsersAndRoles)

Implementa el sistema central de identidad y autorización.

### Funcionalidades

- Inicio y cierre de sesión.
- Inicio mediante formulario y coordinación con Windows Authentication.
- Administración de usuarios.
- Administración de roles.
- Administración de aplicaciones registradas.
- Administración de permisos por aplicación, controlador y acción.
- Configuraciones generales y configuraciones JSON/TEXT.
- Configuración de alertas y validaciones.
- Emisión y validación de tokens OAuth bearer.
- API gateway para procesos internos y externos.
- Envío de correos y archivos por FTP.
- Registro de fechas de acceso.

### Componentes relevantes

| Componente | Responsabilidad |
|---|---|
| `AccountController` | Login, logout, recuperación y administración básica de cuentas. |
| `UserAdminController` | CRUD y administración de usuarios. |
| `RolesAdminController` | CRUD de roles. |
| `PermissionsController` | Permisos funcionales. |
| `ApplicationsController` | Aplicaciones protegidas por el servidor de identidad. |
| `ConfiguracionesController` | Gestión de parámetros almacenados en base de datos. |
| `GatewayWebApiController` | Integraciones y operaciones expuestas como Web API. |
| `PermissionFilterAttribute` | Autorización MVC por rol o permiso. |
| `PermissionFilterWebApiAttribute` | Autorización equivalente para Web API. |
| `ConfiguracionesRepository` | Acceso tipado a configuraciones de integraciones y procesos. |

### Modelo de identidad

El contexto `ApplicationDbContext` extiende ASP.NET Identity y agrega entidades de negocio para:

- Aplicaciones.
- Permisos.
- Configuraciones.
- Fechas de login.
- Roles y usuarios extendidos.

## 5.3 MicrotechIdentityWinAuth

Ubicación: [`MicrotechIdentity/MicrotechIdentityWinAuth`](MicrotechIdentity/MicrotechIdentityWinAuth)

Aplicación pequeña alojada con Windows Authentication. Su objetivo es tomar la identidad del dominio Windows, generar una cookie compatible con las aplicaciones Forms/OWIN y redirigir al usuario a la aplicación solicitada.

Flujo esperado:

1. Fortaleza Core redirige al sitio WinAuth con `returnUrl`.
2. IIS autentica al usuario mediante Windows Authentication.
3. WinAuth crea la cookie `.AspNet.ApplicationCookie`.
4. El usuario vuelve a Identity o Fortaleza Core.
5. Identity valida que el usuario exista, esté habilitado y tenga permisos.

## 5.4 FortalezaCoreWebClient

Ubicación: [`MicrotechIdentity/FortalezaCoreWebClient`](MicrotechIdentity/FortalezaCoreWebClient)

Agrupa clientes y modelos de integración:

- `BancardWS`: servicios SOAP de envío, consulta y catastro.
- `DebiPago`: consumo de API DebiPago.
- `Dynamics365WS`: autenticación y solicitudes contra Dynamics 365.
- `SapWS`: envío y consulta de facturas, notas de crédito y recibos SAP.
- `Connected Services`: proxies SOAP generados para servicios Bancard.
- `BancardFile`: generación o tratamiento de archivos de procesadora.
- `SerializarXml`: serialización auxiliar.

El `Main` actual funciona principalmente como arnés histórico/de prueba; la integración efectiva se consume desde otros proyectos.

## 5.5 FortalezaCore2D365

Ubicación: [`MicrotechIdentity/FortalezaCore2D365`](MicrotechIdentity/FortalezaCore2D365)

Proceso de consola encargado de recibir mensajes desde Azure Service Bus y enviarlos al gateway de Fortaleza.

### Tipos de mensaje

| `ContentType` | Destino |
|---|---|
| `OPPORTUNITY` | Endpoint de oportunidades. |
| `CONTACT` | Endpoint de personas físicas/contactos. |
| `ACCOUNT` | Endpoint de personas jurídicas/empresas. |
| `CLIENTESAP` | Persona física o jurídica según `TipoCliente`. |

### Comportamiento

- Obtiene colas, endpoints y credenciales desde `ConfiguracionesRepository`.
- Crea un `ServiceBusProcessor` con una ejecución concurrente.
- Desactiva `AutoCompleteMessages`.
- Obtiene un token OAuth contra el gateway.
- Envía el JSON recibido al endpoint correspondiente.
- Completa el mensaje cuando considera exitosa la respuesta.
- Mantiene un contador de reintentos en memoria.
- Envía a dead-letter los mensajes que superan el máximo configurado.

## 5.6 MicrotechCommonLib

Ubicación: [`MicrotechIdentity/MicrotechCommonLib`](MicrotechIdentity/MicrotechCommonLib)

Biblioteca compartida con los siguientes paquetes funcionales:

| Área | Contenido |
|---|---|
| `api` | Cliente HTTP, OAuth, Basic Auth y operaciones GET/POST/PATCH. |
| `result` | Respuestas genéricas y mapeo de resultados de servicios. |
| `railways` | Implementación de `Result<T>`, `Bind`, `Map`, `Combine`, `Traverse` y errores tipados. |
| `SAP` | Conexión SAP Business One DI API y consultas dinámicas. |
| `SSIS` | Ejecución programática de paquetes SSIS. |
| `mail` | Envío y administración de correo. |
| `job` | Planificación de trabajos con Quartz. |
| `ssl` | Certificados y validación TLS. |
| `xml` | Mapeo de XML/JSON hacia objetos. |
| `reflection` | Utilidades de reflexión. |

Aunque su nombre indica una librería, el proyecto está configurado como `WinExe` e incluye un `Main` experimental en `Pruebas.cs`.

## 5.7 FortalezaCoreProcesosSSIS

Ubicación: [`MicrotechIdentity/FortalezaCoreProcesosSSIS`](MicrotechIdentity/FortalezaCoreProcesosSSIS)

Proyecto de SQL Server Integration Services para extracción, carga y transferencia de información.

### Paquetes identificados

| Paquete | Función inferida |
|---|---|
| `ODS_DIARIO.dtsx` | Proceso diario de carga/actualización de ODS. |
| `ODS_TEMPLATE_CARGA.dtsx` | Plantilla de carga desde SQL Server. |
| `ODS_TEMPLATE_CARGA_ORACLE.dtsx` | Plantilla de carga desde Oracle. |
| `sample.sqlserver.TRASPASO.ASIENTOS.dtsx` | Traspaso de asientos desde SQL Server. |
| `sample.oracle.TRASPASO.PCODAD.dtsx` | Traspaso de información desde Oracle. |
| `sample.odata.TRASPASO.GeneralJournalAccountEntryEntity.dtsx` | Carga mediante OData hacia una entidad de asientos contables. |

El proyecto contiene parámetros y administradores de conexión. Los valores definitivos pueden ser reemplazados en catálogo SSIS durante el despliegue.

## 6. Módulos funcionales

## 6.1 Clientes

Controladores principales:

- `ClienteController`.
- `ClientesController`.
- `View_Tabs_ClientesController`.
- `Cliente_TarjetaController`.
- `Cliente_SegmentoController`.
- `Cliente_ContratoController`.
- `TitularesContratoController`.

Funcionalidades identificadas:

- Alta, consulta y modificación de clientes.
- Personas físicas y jurídicas.
- Direcciones, contactos y datos personales.
- Estados, tipos, categorías y segmentos.
- Asociación entre clientes y contratos.
- Gestión de titulares, codeudores, garantías e inquilinos.
- Transferencia de titularidad.
- Administración de tarjetas y procesadoras.
- Fidelización y productos adicionales asociados.
- Sincronización de clientes con CRM/Dynamics 365.
- Consulta de facturas y contratos del cliente.

Entidades relacionadas: `Cliente`, `Cliente_Contacto`, `Cliente_Direccion`, `Cliente_Persona_Juridica`, `Cliente_Tarjeta`, `Cliente_Categoria`, `Cliente_Segmento`, `Contrato_Cliente` y diversas vistas `View_Cliente_*`.

## 6.2 Contratos

Controladores principales:

- `ContratoController`.
- `ContratosTablaController`.
- `Contrato_ArticuloController`.
- `Contrato_Articulo_CuotaController`.
- `Contrato_Articulo_InstruccionController`.
- `Contrato_Articulo_PagoMetodoController`.
- `AplicarClausulaController`.
- `EditarFechasController`.
- `View_Aprobar_OperacionController`.

Funcionalidades identificadas:

- Creación y edición de contratos.
- Clasificación, categoría, ciclo, tipo, estado y subestado.
- Asociación de artículos y productos.
- Generación y mantenimiento de cuotas.
- Configuración de instrucciones y métodos de pago.
- Aprobación y cambio de estado.
- Cambio de fecha y aplicación de cláusulas.
- Aportes ordinarios, extraordinarios y pagos mínimos.
- Transferencias de aporte y titularidad.
- Mercado secundario.
- Historial de contratos, instrucciones, pagos y operaciones.
- Garantías, codeudores e inmuebles asociados.

## 6.3 Planes y productos

Controladores principales:

- `PlanController`.
- `Plan_Detalle_ProductoController`.
- `ProductoController`.
- `Producto_ConceptoController`.
- `ProductoAdicionalController`.
- `ProdAdicional_Detalle_PlanesController`.
- `ProdAdicional_Detalle_ProductosController`.
- `ArticuloController`.
- `Articulo_ConceptoController`.
- `Articulo_Concepto_PrecioController`.
- `Articulo_Tipo_InteresController`.

Funcionalidades identificadas:

- CRUD de planes y productos.
- Composición de planes por productos y conceptos.
- Productos adicionales simples o combinados.
- Cantidades y precios por plan/producto.
- Monedas, tasas y tipos de interés.
- Precios y códigos de integración SAP/D365.
- Configuración de aportes y desglose de productos.
- Cálculo de planes tangibles y no tangibles.
- Actualización masiva de precios en Dynamics 365.

## 6.4 Cobros y pagos

Controladores principales:

- `PagoController`.
- `Pago_LoteController`.
- `Pago_Lote_DetalleController`.
- `PagosAplicadosController`.
- `View_Boca_CobranzaController`.
- `View_Cobros_ManualesController`.
- `CobroContratoPendienteController`.
- `MedioPagoDetalleController`.

Funcionalidades identificadas:

- Registro de pagos individuales.
- Aplicación de pagos a comprobantes y cuotas.
- Pagos manuales.
- Pagos por lote.
- Carga y procesamiento de archivos de procesadoras.
- Boca de cobranza.
- Débito automático.
- Pago a cuenta, efectivo, depósito, POS, transferencia, canje y nota de crédito.
- Control de estados e historial de lotes.
- Reversión y anulación de cobros.
- Seguimiento de mensajes de Bancard, BNF, Cabal, DebiPago, Itau, Panal, Procard, Regional, Sudameris, UENO y Visión.
- Conciliación y envío de recibos a SAP.

Entidades relevantes: `Pago`, `Pago_Lote`, `Pago_Lote_Detalle`, `Pago_Estado`, `Pago_Medio`, `Pago_Metodo`, `Comprobante_Pago`, `Entidad_Procesadora` y `Entidad_Procesadora_Moneda`.

## 6.5 Comprobantes y facturación

Controladores principales:

- `ComprobanteController`.
- `View_Comprobantes_Creditos_PendientesController`.
- `Deposito_SapController`.

Funcionalidades identificadas:

- Facturas contado y crédito.
- Notas de crédito.
- Refacturación.
- Comprobantes de productos adicionales.
- Facturación de expensas.
- Aplicación y reversión de pagos.
- Generación de JSON para SAP.
- Seguimiento de número interno SAP.
- Reenvío de comprobantes e integraciones fallidas.
- Procesamiento mediante stored procedures y paquetes SSIS.

## 6.6 Pagarés

Controladores y repositorios principales:

- `PagareController`.
- `Pagare_CabeceraRepository`.

Funcionalidades identificadas:

- Generación de pagarés por contrato y artículo.
- Cabecera, detalle, clientes y datos del cónyuge.
- Estados y ubicación física.
- Movimientos por lote.
- Gestión de documentos pendientes de migración.
- Envío o control con Tesorería.
- Generación de documentos PDF.
- Historial de pagarés.

## 6.7 Edificios, unidades y expensas

Controladores principales:

- `EdificioController`.
- `Edificio_Unidad_PrecioController`.
- `Unidad_EstadoController`.
- `Unidad_ExpensaController`.
- `Unidad_MedidaController`.
- `Tipo_Unidad_CategoriaController`.
- `Tipo_Unidad_CostoController`.
- `Tipo_Unidad_Cupon_CostoController`.

Funcionalidades identificadas:

- Administración de edificios, pisos y áreas comunes.
- Unidades, categorías, tipos, medidas y estados.
- Precios y costos por unidad.
- Cupones y porcentajes de venta.
- Asociación de unidades con contratos.
- Migración e importación de expensas.
- Generación masiva de comprobantes de expensas.
- Mercado secundario y adjudicación de unidades.

## 6.8 Operaciones y aprobaciones

Controladores principales:

- `OperacionController`.
- `View_Aprobar_OperacionController`.
- `RolOperacionController`.
- `ComentarioController`.

Funcionalidades identificadas:

- Creación de operaciones pendientes.
- Aprobación o rechazo por usuarios autorizantes.
- Tipos de operación configurables.
- Comentarios y motivos de rechazo.
- Autorizaciones y roles por tipo de operación.
- Persistencia de parámetros variables en JSON.
- Aplicación posterior de cambios sobre contratos, cuotas, artículos y aportes.
- Historial de operaciones.

El módulo utiliza formularios JSON dinámicos y comentarios almacenados con la operación, por lo que parte del comportamiento depende de configuraciones externas.

## 6.9 Adjudicaciones y licitaciones

Controladores principales:

- `LicitacionController`.
- `Ejecutivo_AdjudicacionesController`.
- `FortalezaApp_AdjudicacionController`.
- `Tipo_AdjudicacionController`.

Funcionalidades identificadas:

- Eventos de adjudicación.
- Ofertas licitatorias.
- Cálculo de punto licitatorio.
- Procesamiento y aprobación de licitaciones.
- Asignación de edificios, departamentos, cocheras u otros bienes.
- Ejecutivos responsables.
- Adjudicaciones suplentes.
- Entrega de llaves y transferencias.
- Sorteos y consulta de resultados.

## 6.10 Calculadoras, tasas y combinaciones

Controladores principales:

- `CalculadoraController`.
- `TasasController`.
- `Tipo_InteresController`.
- `Tipo_CombinacionController`.
- `Tipo_Combinacion_Plazo_PorcentajeController`.
- `Tipo_Combinacion_Porcentaje_DescuentoController`.
- `Plazos_PorcentajesController`.

Funcionalidades identificadas:

- Cálculo de planes y cuotas.
- Tasas e intereses.
- Combinaciones de productos.
- Porcentajes por plazo.
- Descuentos.
- Mercado secundario.
- Cupones de venta y distribución porcentual.

## 6.11 Fortaleza App

Controladores principales:

- `FortalezaAppController`.
- `FortalezaApp_AdjudicacionController`.
- `ArchivoAppController`.

Funcionalidades identificadas:

- Información y preguntas frecuentes.
- Módulos, aplicaciones y tipos de información.
- Archivos y contenido descargable.
- Consultas o procesos de adjudicación expuestos a Fortaleza App.

Entidades relacionadas: `Aplicacion`, `Informacion`, `Informacion_Modulo`, `Modulo`, `Tipo_Informacion`, `Archivo_App` y `Archivo_Tipo`.

## 6.12 TPago

Controladores principales:

- `TPagoMigracionController`.
- `TPagoReprocesoController`.
- `TPagoSuscripcionesController`.

Funcionalidades identificadas:

- Migración y asociación de registros TPago.
- Historial DBA.
- Reprocesamiento de transacciones.
- Actualización masiva de suscripciones.
- Control de `TPago_Inbox` y `TPago_Link`.

## 6.13 Reportes y cumplimiento

Componentes principales:

- `ReporteSepreladController`.
- `Reportes.aspx`.
- Carpeta `ReportesPdf`.
- Generadores NPOI/OpenXML.
- ReportViewer.

Reportes identificados:

- Estado de cuenta resumido y detallado.
- Estado de cuenta por cliente o artículo.
- Punto licitatorio.
- Pagarés.
- Expensas.
- Reporte SEPRELAD.
- Exportaciones Excel.
- Consultas operativas de cobros, pagos, contratos y adjudicaciones.

El reporte SEPRELAD requiere el procedimiento `[code].[sp_reporte_seprelad]` y el rol `MENU_CUMPLIMIENTO`, según el README del proyecto web.

## 6.14 Archivos, correo y FTP

Componentes:

- `ArchivoController`.
- `FileManager`.
- `FTPServer`.
- `MailServer`.
- `MailManager`.

Responsabilidades:

- Carga y descarga de adjuntos.
- Rutas configurables para estados de cuenta, pagarés, expensas y archivos de procesadoras.
- Transferencia FTP.
- Correos de notificación.
- Archivos asociados a pagos por lote, comentarios y aplicaciones.

## 7. Modelo de datos

El modelo principal se encuentra en [`dbFortalezaCoreModel.edmx`](MicrotechIdentity/FortalezaCoreWebApp/Models/dbFortalezaCoreModel.edmx).

La definición completa de SQL Server se encuentra fuera de este repositorio, en:

```text
C:\Users\robertruiz\source\repos\BaseDatosCore\DdlBases\dbFortalezaCore.sql
```

El EDMX representa el subconjunto consumido mediante Entity Framework. El DDL incluye además tablas operativas, históricos, staging, procesos de integración, vistas de reportería y objetos auxiliares que no están mapeados por la aplicación.

### 7.1 Áreas de entidades

| Área | Entidades representativas |
|---|---|
| Clientes | `Cliente`, `Cliente_Contacto`, `Cliente_Direccion`, `Cliente_Tarjeta`, `Cliente_Categoria`. |
| Contratos | `Contrato`, `Contrato_Cliente`, `Contrato_Articulo`, `Contrato_History`, `Contrato_Garantia`. |
| Cuotas | `Contrato_Articulo_Cuota`, `Contrato_Articulo_Cuota_Interes`, `Cuota_Estado`. |
| Pagos | `Pago`, `Pago_Lote`, `Pago_Lote_Detalle`, `Pago_Medio`, `Pago_Metodo`. |
| Comprobantes | `Comprobante`, `Comprobante_Detalle`, `Comprobante_Pago`, `Comprobante_Tipo`. |
| Planes y productos | `Plan`, `Producto`, `Articulo`, `Producto_Concepto`, `ProdAdicional`. |
| Operaciones | `Operacion`, `Operacion_Autorizacion`, `Operacion_Comentario`, `Operacion_History`. |
| Pagarés | `Pagare_Cabecera`, `Pagare_Detalle`, `Pagare_Cliente`, `Pagare_History`. |
| Inmuebles | `Edificio`, `Edificio_Unidad`, `Edificio_Piso`, `Unidad_Expensa`. |
| Adjudicación | `Evento_Adjudicacion`, `Evento_Adjudicacion_Detalle`, `Calculo_Licitacion_Contrato`. |
| Integración | `Log_WebService_Incoming`, `Log_WebService_Outcoming`, `Log_Respuesta_SSIS`. |
| Fortaleza App | `Aplicacion`, `Informacion`, `Modulo`, `Archivo_App`. |

### 7.2 Acceso a datos

Se utilizan cuatro mecanismos principales:

1. Entidades y funciones importadas mediante Entity Framework Database First.
2. Repositorios generados por entidad.
3. Repositorios personalizados para consultas y procesos complejos.
4. SQL directo con ADO.NET, Dapper y `Database.SqlQuery`.

La unidad de trabajo principal es `EdmRepositoryFactory`, que agrupa repositorios sobre un contexto compartido y expone `Save()`.

### 7.3 Procedimientos y funciones relevantes

Entre los procesos importados por el EDMX se encuentran:

- Creación, carga y anulación de lotes.
- Carga de comprobantes y pagos.
- Facturación y notas de crédito.
- Ejecución y consulta de paquetes SSIS.
- Aplicación de cláusulas y movimiento de fechas.
- Creación y fraccionamiento de cuotas.
- Cálculo de precios y estados de cuenta.
- Integración de clientes y oportunidades con CRM.
- Generación de archivos para procesadoras.
- Carga de productos adicionales y refacturación.

### 7.4 Inventario del DDL

El script completo contiene el siguiente inventario aproximado:

| Tipo de objeto | Cantidad |
|---|---:|
| Esquemas declarados | 21 |
| Tablas | 354 |
| Vistas | 235 |
| Procedimientos almacenados | 403 |
| Funciones | 230 |
| Secuencias | 2 |
| Claves primarias | 218 |
| Claves foráneas | 215 |
| Índices creados explícitamente | 68 |
| Tablas con versionado temporal explícito | 23 |
| Usuarios de base incluidos en el script | 42 |
| Roles personalizados | 6 |

No se identificaron triggers, sinónimos, tablas memory-optimized, índices columnstore ni particionamiento. La lógica reactiva y transaccional reside principalmente en procedimientos y funciones, no en triggers.

Las cantidades de claves e índices deben interpretarse considerando que el DDL incluye tablas históricas, temporales, staging, respaldo y migración que intencionalmente pueden no tener las mismas restricciones que las tablas transaccionales.

### 7.5 Organización por esquemas SQL

| Esquema | Objetos principales | Responsabilidad inferida |
|---|---:|---|
| `dbo` | 316 tablas, 14 vistas, 33 procedimientos, 8 funciones | Modelo transaccional principal y objetos históricos/auxiliares. |
| `code` | 2 tablas, 126 vistas, 261 procedimientos, 211 funciones | Reglas de negocio, cálculos, consultas y contratos de integración. |
| `ssis` | 68 procedimientos | Orquestación transaccional y ejecución de procesos SSIS. |
| `ssrs` | 76 vistas | Datasets de SSRS, BI, cartera, cobranzas, ventas y cumplimiento. |
| `temp` | 27 tablas, 2 procedimientos | Staging de migraciones, procesadoras, precios, expensas y D365. |
| `app` | 11 vistas, 2 funciones | Datos preparados para Fortaleza App y adjudicaciones. |
| `jobs` | 14 procedimientos, 4 funciones | Procesos periódicos de estados, categorías, cartera y mantenimiento. |
| `log` | 6 tablas, 7 procedimientos, 2 secuencias | Trazabilidad de servicios, SSIS, stored procedures y estados de cuenta. |
| `oper` | 2 vistas, 6 procedimientos | Aplicación de cláusulas, pagos mínimos, fraccionamientos y movimientos de fecha. |
| `sap` | 1 tabla, 5 procedimientos | Snapshot e intercambio de respuestas y documentos SAP. |
| `ini` | 4 vistas, 3 procedimientos | Inicialización y sincronización de catálogos con D365/SAP. |
| `config` | 3 procedimientos | Actualización de conceptos, precios y composición de planes. |
| `d365` | 2 funciones | Resolución de tipos e IDs utilizados por Dynamics 365. |
| `param` | 1 tabla, 1 procedimiento | Filtros parametrizables y generación de sentencias de búsqueda. |
| `aud` | 1 tabla | Auditoría especializada de artículos. |
| `ext` | 1 vista | Exposición de información de boca de cobranza. |
| `dummy` | 1 vista, 3 funciones | Simulación o pruebas de creación de pagos y JSON. |

También existen esquemas declarados con poco o ningún objeto en esta fotografía, como `boca`, `demo`, `ope`, `test` y esquemas personales. Deben considerarse auxiliares o históricos hasta validar su utilización en el servidor activo.

### 7.6 Relaciones centrales del dominio

El núcleo financiero puede representarse de forma simplificada así:

```text
Cliente
  └── Contrato
       ├── Contrato_Cliente
       ├── Contrato_Articulo
       │    ├── Contrato_Articulo_Cuota
       │    │    ├── Contrato_Articulo_Cuota_Interes
       │    │    └── Comprobante_Pago ──► Pago
       │    ├── Contrato_Articulo_Instruccion
       │    └── Contrato_Articulo_PagoMetodo
       ├── Comprobante
       │    ├── Comprobante_Detalle
       │    └── Comprobante_Pago
       ├── Operacion
       │    └── Operacion_Autorizacion
       ├── Pagare_Cabecera
       │    └── Pagare_Detalle
       └── Contrato_Edificio_Unidad ──► Edificio_Unidad
```

Relaciones y responsabilidades destacadas:

- `Cliente` es la raíz de personas físicas o jurídicas, contactos, direcciones, tarjetas, categorías, segmentos e IDs de CRM/SAP.
- `Contrato` vincula cliente, plan, asesores, método de pago, estado, clasificación, sucursal e identificadores de Dynamics 365.
- `Contrato_Articulo` representa los componentes contratados y su configuración de cobro.
- `Contrato_Articulo_Cuota` es el núcleo del cuotero; admite cuotas padre/hija, fraccionamiento, descuentos, mora, pagarés, operaciones y referencias entre cuotas.
- `Comprobante` representa documentos contables; `Comprobante_Detalle` contiene conceptos facturados y `Comprobante_Pago` distribuye pagos e intereses.
- `Pago` describe el movimiento recibido; `Pago_Lote` y `Pago_Lote_Detalle` organizan cobranzas masivas, respuestas de procesadoras y pagos pendientes de aplicar.
- `Operacion` conserva solicitudes de cambio en JSON y `Operacion_Autorizacion` registra su estado de aprobación o rechazo.
- `Edificio`, `Edificio_Piso` y `Edificio_Unidad` modelan el inventario inmobiliario; los contratos se asocian a unidades mediante `Contrato_Edificio_Unidad` y garantías/inquilinos.
- `Evento_Adjudicacion` y sus detalles enlazan eventos, contratos, unidades, ofertas y suplentes.

Las tablas más referenciadas por claves foráneas son `Contrato`, `Moneda`, `Cliente`, `Tipo_Unidad`, `Producto`, `ProdAdicional`, `Operacion`, `Edificio_Unidad`, `Edificio` y `Articulo`, lo que confirma su papel como agregados principales.

### 7.7 Datos principales por agregado

| Agregado | Información relevante persistida |
|---|---|
| Cliente | Documento, RUC, datos personales, trabajo, ingreso, categoría, segmento, riesgo, consentimiento, códigos SAP y CRM. |
| Contrato | Número, plan, cliente, asesores, estado, clasificación, ciclo, fecha contractual, sucursal, oportunidad D365 y contrato anterior. |
| Artículo contratado | Moneda, plazo, fecha y día de cobro, descuentos, entrega inicial, intereses, estado, unidad y configuración de débito. |
| Cuota | Número, monto, saldo, vencimiento, fecha prevista, estado, descuento, mora, cuota padre, operación y pagaré. |
| Comprobante | Tipo, estado, fechas, contrato, RUC, número SAP, cotización y condición de interés/refacturación. |
| Pago | Cliente, fecha, moneda, monto, conversión, medio, método, lote, tarjeta, transacción, voucher y referencias SAP. |
| Lote de pagos | Procesadora, cobrador, moneda, método, medio, estado y usuarios de creación/modificación. |
| Detalle de lote | Contrato/artículo, estado, montos, moneda, cotización, tarjeta, respuesta de procesadora, payload JSON, TPago e instrucciones. |
| Operación | Tipo, solicitante, autorizante, contrato, fechas, propietario asignado y parámetros JSON. |
| Pagaré | Contrato, cliente, moneda, estado, ubicación, cuotas, importes, fechas, lote y condición digital. |
| Edificio/unidad | Ubicación, superficie, estado, disponibilidad, copropiedad, costos, avance de obra y datos catastrales. |

La base almacena datos personales, financieros, contractuales y potencialmente información de tarjetas. Estos campos deben tratarse como información sensible en accesos, reportes, respaldos, logs y ambientes no productivos.

### 7.8 Tablas temporales del sistema e historial

SQL Server System-Versioned Temporal Tables está habilitado para al menos las siguientes tablas principales:

- `Cliente` → `Cliente_History`.
- `Contrato` → `Contrato_History`.
- `Contrato_Articulo` → `Contrato_Articulo_History`.
- `Contrato_Articulo_Cuota` → `Contrato_Articulo_Cuota_History`.
- `Contrato_Articulo_Cuota_Interes` → `Contrato_Articulo_Cuota_Interes_History`.
- `Contrato_Articulo_Instruccion` → `Contrato_Articulo_Instruccion_History`.
- `Contrato_Articulo_PagoMetodo` → `Contrato_Articulo_PagoMetodo_History`.
- `Contrato_Amplia` → `Contrato_Amplia_History`.
- `Pago` → `MSSQL_TemporalHistoryFor_1791345446`.
- `Pago_Lote` → `Pago_Lote_History`.
- `Pago_Lote_Detalle` → `Pago_Lote_Detalle_History`.
- `Comprobante` → `Comprobante_History`.
- `Comprobante_Detalle` → `Comprobante_Detalle_History`.
- `Comprobante_Pago` → `Comprobante_Pago_History`.
- `Operacion` → `Operacion_History`.
- `Pagare_Cabecera` → `Pagare_Cabecera_Historico`.
- `Pagare_Detalle` → `Pagare_Detalle_History`.
- `Edificio_Unidad_Precio` → `Edificio_Unidad_Precio_History`.
- `Plazos_Porcentajes` → `Plazos_Porcentajes_History`.
- `Tipo_Unidad_Cupon_Precios` → `Tipo_Unidad_Cupon_Precios_History`.
- `Tipo_Combinacion_Precio` → `Tipo_Combinacion_Precio_History`.
- `Impuesto` → `Impuesto_History`.
- `Impuesto_Detalle` → `Impuesto_Detalle_History`.

Todas usan columnas de período `TimeStart` y `TimeEnd`. Además, el DDL contiene numerosas tablas manuales con sufijos `_hist`, `_his`, `_bkp`, `_tmp`, `AUXILIAR` y `MIGRAR`; éstas no deben confundirse con el historial temporal administrado por SQL Server.

### 7.9 Staging, migraciones y tablas auxiliares

El esquema `temp` contiene áreas de trabajo para:

- Actualización de clientes y precios de Dynamics 365.
- Migración de expensas.
- Cálculo temporal de cantidades y precios de planes.
- Productos adicionales.
- Respuestas de Bancard, BNF, Cabal, Itau, Panal, Procard, Regional, Sudameris, UENO y Visión.
- Cobros de procesadoras.
- Pagarés y cuotas temporales.
- Excepciones y registros de actualización de precios.

En `dbo` también existen tablas auxiliares, copias, respaldos y migraciones históricas. Antes de depurarlas debe verificarse su uso desde procedimientos, reportes, jobs externos y paquetes SSIS.

### 7.10 Vistas de negocio y reportería

Las 235 vistas se concentran en tres objetivos:

1. **Aplicación (`code`)**: tabs de clientes/contratos, cuotero, pagos, comprobantes pendientes, operaciones, precios, instrucciones de cobro, mercado secundario y consultas SAP.
2. **Fortaleza App (`app`)**: cliente, contrato, edificio, facturas, adjudicaciones, ejecutivo, precios y unidades adjudicadas.
3. **Reportería (`ssrs`)**: cartera activa/inactiva, cobranzas, morosidad, cuotas, débitos automáticos, contratos, ventas, productos adicionales, fidelización, referidos, SEPRELAD y rendición de documentos.

El esquema `code` incluye además un conjunto de vistas `view_inconsistencias_*` para detectar diferencias estructurales, montos incorrectos, plazos y cuotas pendientes. Estas vistas forman un subsistema de control de calidad de datos que no era visible desde el EDMX.

### 7.11 Procedimientos y funciones de negocio

Los objetos programables confirman que una parte sustancial del dominio se ejecuta dentro de SQL Server:

- Cálculo y generación de cuoteros.
- Distribución de pagos, capital, intereses, descuentos y mora.
- Facturación contado/crédito y notas de crédito.
- Aplicación, reversión y reproceso de cobranzas.
- Mercado secundario, acuerdos, transferencias y pago mínimo.
- Archivos y respuestas de procesadoras.
- Construcción de JSON para SAP, D365 y clientes externos.
- Procesamiento de expensas y pagarés.
- Fidelización y recategorización de clientes.
- Adjudicaciones y cálculo de puntos licitatorios.
- Cierres, cartera y controles de consistencia.
- Ejecución y seguimiento de paquetes SSIS.

Se identificó uso extendido de características JSON de SQL Server: `FOR JSON`, `OPENJSON` y `JSON_VALUE`. Esto convierte a los procedimientos y funciones en parte del contrato de integración, no solamente en una capa de persistencia.

### 7.12 Procesos SSIS definidos desde la base

El esquema `ssis` implementa transacciones de varios pasos para:

- Débitos automáticos por procesadora.
- Boca de cobranza.
- Factura contado y crédito.
- Nota de crédito.
- Reprocesos.
- Respuestas Bancard.
- Migración de expensas.
- Actualización de clientes, productos y listas de precios D365.
- Envío de comprobantes y pagos a SAP.

Los procedimientos llaman directamente a `SSISDB.catalog` para crear ejecuciones, establecer parámetros, iniciar paquetes y consultar resultados. Las secuencias `log.SEQ_Execution_Id_Log_Stored_Procedure` y `log.SEQ_Execution_Id_Log_Traspaso_Proceso_SSIS` correlacionan las ejecuciones con los logs funcionales.

### 7.13 Procesos automáticos y mantenimiento

El esquema `jobs` contiene procesos programables para:

- Recalcular categorías de clientes físicos, jurídicos y Socio F.
- Actualizar estados de contratos y artículos.
- Finalizar productos adicionales.
- Actualizar días de cobro.
- Reprocesar paquetes de comprobantes.
- Actualizar cálculos de montos.
- Operaciones de mantenimiento `SHRINKDATABASE` y `SHRINKFILE`.

El DDL no contiene definiciones de SQL Server Agent Jobs; sólo contiene los procedimientos que éstos pueden invocar. La frecuencia, propietario, alertas y calendario deben consultarse en `msdb` o en la plataforma de automatización utilizada.

### 7.14 Dependencias entre bases y servidores

El DDL contiene referencias a:

- `SSISDB.catalog` para ejecución de paquetes.
- `dbFortalezaIdentity.dbo.Configuraciones` para parámetros compartidos.
- `ReportServer.dbo.Catalog` para metadatos de reportes.
- Bases SAP `FORTALEZABD` y `FORTALEZABD-DESARROLLO` mediante nombres de cuatro partes.
- Una base de interfaz de facturación.
- Una base/interfaz de cobro online.

Por tanto, restaurar únicamente `dbFortalezaCore` no deja operativo el sistema. También se requieren logins, linked servers, SSISDB, Identity, ReportServer, permisos y conectividad hacia SAP e interfaces.

### 7.15 Configuración de la base

La fotografía DDL define:

- SQL Server compatibility level 150.
- Query Store habilitado en modo lectura/escritura, con captura automática y espera de estadísticas.
- `PAGE_VERIFY CHECKSUM`.
- Recovery model `FULL`, aunque el script contiene un cambio temporal a `SIMPLE` y retorno a `FULL` hacia el final.
- `READ_COMMITTED_SNAPSHOT OFF`.
- `ALLOW_SNAPSHOT_ISOLATION OFF`.
- Service Broker deshabilitado.
- Auto close y auto shrink deshabilitados como opciones de base.
- Archivo de datos inicial de aproximadamente 60 GB y log inicial cercano a 1 GB en rutas locales del servidor de origen.

Las rutas físicas, tamaños y cambios de recovery son específicos del servidor donde se generó el script. Deben parametrizarse o retirarse antes de usar el DDL en otro ambiente. Después de alternar de `SIMPLE` a `FULL` se necesita una nueva copia completa para reiniciar correctamente la cadena de logs.

### 7.16 Seguridad de base de datos

El DDL incluye 42 usuarios y los roles personalizados:

- `RolUsuarioFull`.
- `helpdesk_poweruser`.
- `helpdesk`.
- `Desarrollador`.
- `ConsultasReportes`.
- `AnalistaBI`.

También incluye membresías en roles estándar como `db_owner`, `db_datareader`, `db_datawriter` y `db_backupoperator`. Estos usuarios y miembros pertenecen al ambiente de origen y no deberían desplegarse automáticamente en otros ambientes.

No se observaron sentencias `GRANT` o `DENY` explícitas en la fotografía, por lo que los permisos efectivos pueden depender de membresías, permisos existentes no incluidos, ownership chaining y configuraciones externas. Antes de un despliegue debe generarse una matriz separada de mínimos privilegios.

### 7.17 Consideraciones de integridad y rendimiento

- El núcleo tiene claves foráneas, pero numerosas tablas históricas y auxiliares carecen de restricciones formales.
- Existen pocos constraints `CHECK` frente al volumen total de tablas; gran parte de la validación depende de código y stored procedures.
- Los 68 índices explícitos son pocos en comparación con 354 tablas y cientos de consultas/reportes; deben complementarse con análisis real de Query Store y planes de ejecución.
- Los procedimientos mezclan lógica transaccional, JSON, integración y control de errores. Debe conservarse la correlación por execution ID cuando se refactoricen.
- Hay 35 usos de transacciones explícitas, 113 bloques `TRY`, además de `THROW` y `RAISERROR`; no todos los procesos tienen el mismo patrón de rollback y propagación de errores.
- Se detectan numerosos `MERGE`, por lo que deben revisarse condiciones de concurrencia, duplicados y garantías de idempotencia en cargas masivas.
- La existencia de procedimientos de `SHRINKDATABASE`/`SHRINKFILE` como jobs merece revisión operativa: el shrink periódico suele generar fragmentación y crecimiento reiterado.
- Las tablas temporales del sistema requieren política de retención y capacidad; el DDL no muestra una política automática de limpieza de históricos.

## 8. Autenticación y autorización

### 8.1 Mecanismos

- Windows Authentication para usuarios internos.
- Cookie OWIN `.AspNet.ApplicationCookie`.
- Login por formulario en Identity.
- Tokens OAuth bearer para Web API e integraciones.
- Roles ASP.NET Identity.
- Permisos por aplicación, controlador y acción.

### 8.2 Roles funcionales y de menú

Los roles se leen de `Web.config` y se almacenan en `HttpApplicationState` al iniciar la aplicación. Entre los roles configurables se encuentran:

- `ADMIN`.
- `RRHH`.
- `MENU_CONTRATOS`.
- `MENU_COBROS`.
- `MENU_FACTURAS`.
- `MENU_PAGOS`.
- `MENU_OPERACIONES`.
- `MENU_PLANES`.
- `MENU_CLIENTES`.
- `MENU_REPORTES`.
- `MENU_PAGARES`.
- `MENU_ADJUDICACIONES`.
- `MENU_FORTALEZA_APP`.
- `MENU_CUMPLIMIENTO`.
- `MENU_SAP`.
- `MENU_TPAGO`.

La visibilidad del menú no sustituye la autorización del endpoint. Los controladores deben estar protegidos mediante `PermissionFilter`, `Authorize` o una política equivalente.

## 9. Configuración

### 9.1 Archivos principales

- `FortalezaCoreWebApp/Web.config`.
- `MicrotechIdentity/Web.config`.
- `MicrotechIdentityWinAuth/Web.config`.
- `FortalezaCore2D365/App.config`.
- `FortalezaCoreWebClient/App.config`.
- Archivos `Web.*.config` de transformación y publicación.
- Tabla `Configuraciones` de la base de identidad.

### 9.2 Categorías almacenadas en Configuraciones

`ConfiguracionesRepository` expone parámetros para:

- `SSISConfig`.
- `FileConfig`.
- `ReportServerConfig`.
- `FortalezaCoreConfig`.
- `FortalezaCoreWS`.
- `FortalezaGatewayWS`.
- FTP.
- SAP.
- Dynamics 365.
- Azure Service Bus.
- Procesadoras y servicios externos.
- Alertas y validaciones.
- Jobs de reproceso.

Los valores marcados con `encriptado = "S"` se protegen mediante DPAPI. El usuario de ejecución de IIS o del proceso debe ser compatible con el usuario que cifró el dato.

### 9.3 Ambientes

La solución contiene configuraciones o perfiles para:

- Desarrollo local.
- Development/DEV.
- QA/LAB.
- Producción.
- Publicaciones históricas en Azure y servidores Diviserv.

Las configuraciones sensibles no deben mantenerse en texto claro ni dentro del historial Git.

## 10. Integraciones externas

## 10.1 SAP Business One

La integración con SAP incluye:

- Facturas.
- Notas de crédito.
- Recibos.
- Clientes/socios de negocio.
- Productos y códigos SAP.
- Tipos de cambio.
- Asientos contables.
- SAP DI API mediante `SAPbobsCOM`.
- Servicios HTTP y procedimientos SQL intermedios.

Los logs `Log_WebService_Incoming` y `Log_WebService_Outcoming` permiten rastrear solicitudes y respuestas.

## 10.2 Dynamics 365

Incluye:

- Autenticación OAuth client credentials.
- Alta/actualización de contactos, cuentas y oportunidades.
- Creación y actualización masiva de productos y precios.
- Procesamiento batch de Dynamics Web API.
- Mensajería mediante Azure Service Bus.

## 10.3 Bancard

Incluye servicios SOAP para:

- Envío de archivos DBA.
- Consulta de resultados.
- Catastro de contratos o tarjetas.
- Procesamiento de lotes y respuestas.

## 10.3.1 Otras procesadoras y bancos

El DDL muestra soporte de archivos, staging y respuestas para:

- BNF.
- Cabal.
- Itau.
- Panal.
- Procard.
- Regional.
- Sudameris.
- UENO.
- Visión.

Cada procesadora puede tener su propio formato de archivo, tabla temporal, tabla de respuesta y pasos específicos dentro de `ssis.sp_Transaccion_Debitos_*`. La configuración se completa mediante `Entidad_Procesadora`, `Entidad_Procesadora_Moneda`, `Procesadora_Lote` y parámetros almacenados en Identity.

## 10.4 DebiPago

Incluye autenticación, envío de solicitudes, procesamiento de respuestas y asociaciones con lotes o suscripciones.

## 10.5 SQL Server Integration Services

SSIS se utiliza para:

- Facturación y pagos.
- Procesos de integración con SAP.
- Traspasos diarios.
- Cargas desde SQL Server, Oracle y OData.
- Seguimiento de ejecución mediante IDs de tarea y logs.

## 10.6 Reportes y archivos

- ReportViewer/SSRS.
- NPOI y OpenXML para Excel.
- QuestPDF y otras bibliotecas para PDF.
- FTP para intercambio de archivos.
- Directorios configurables para adjuntos, pagarés, estados de cuenta y migraciones.

## 11. Logging y trazabilidad

La mayoría de los proyectos utiliza log4net mediante archivos `Log4Net.config`.

Se registran:

- Inicio y errores de aplicaciones.
- Login y autorización.
- Llamadas a servicios externos.
- Mensajes de Azure Service Bus.
- Ejecuciones de procedimientos almacenados y SSIS.
- Respuestas SAP, D365, Bancard y DebiPago.

Además de archivos de log, la base contiene entidades como:

- `Log_Stored_Procedure`.
- `Log_WebService_Incoming`.
- `Log_WebService_Outcoming`.
- `Log_Respuesta_SSIS`.

No deben registrarse contraseñas, tokens, números completos de tarjeta, documentos sensibles ni cuerpos que contengan datos personales sin enmascaramiento.

## 12. Pruebas

## 12.1 FortalezaCoreUnitTest

Contiene aproximadamente 95 métodos marcados como pruebas, distribuidos entre:

- Pruebas de stored procedures.
- Pruebas de web services entrantes.
- Pruebas de D365, SAP, Bancard y Fortaleza Core.
- Pruebas de migración.
- Pruebas de repositorios.
- Pruebas por módulos de cobros, planes, clientes y contratos.

Parte de estas pruebas son realmente pruebas de integración: requieren una base accesible, configuraciones válidas y servicios externos.

## 12.2 MicrotechIdentityUnitTest

Contiene 87 pruebas de navegación de pantallas que realizan solicitudes HTTP contra un ambiente configurado.

### Precauciones

- Algunas pruebas crean, editan o eliminan registros reales.
- Algunas usan IDs fijos.
- Las pruebas de pantallas dependen de LAB o localhost.
- Las pruebas de integración no deberían ejecutarse automáticamente contra producción.
- Se recomienda separar unitarias, integración, smoke tests y pruebas destructivas mediante categorías y variables de ambiente.

## 13. Scripts SQL versionados

Ubicación: [`DEV/SQL`](DEV/SQL)

Estos scripts son cambios puntuales del repositorio de aplicación. No reemplazan el DDL integral ubicado en `C:\Users\robertruiz\source\repos\BaseDatosCore\DdlBases\dbFortalezaCore.sql`, que contiene la fotografía completa de tablas, vistas, funciones, procedimientos, usuarios y opciones de base.

### `FCN_CrearJsonRecibo_SAP.sql`

Función SQL que construye el JSON de un recibo para SAP a partir de:

- Pago.
- Comprobante.
- Cuotas aplicadas.
- Intereses.
- Moneda y cotización.
- Medio y método de pago.
- Tarjeta o procesadora.
- Referencias internas Core/SAP.

La versión `New` separa los montos de cuota e interés y suma el interés una sola vez por combinación pago/comprobante.

### `InsertProcesadora.sql`

Inserta una relación faltante entre procesadora, moneda y código SAP cuando no existe.

## 14. Construcción y ejecución

### 14.1 Requisitos esperados

- Windows.
- Visual Studio con herramientas para ASP.NET MVC 5 y .NET Framework.
- Targeting packs 4.5, 4.6.1 y 4.6.2.
- IIS Express o IIS.
- SQL Server accesible.
- Paquetes NuGet restaurados.
- Componentes de SQL Server/SSIS requeridos.
- SAP Business One DI API para los componentes que usan `SAPbobsCOM`.
- Herramientas de proyectos SSIS para abrir `FortalezaCoreProcesosSSIS`.

### 14.2 Orden conceptual de ejecución

1. Restaurar paquetes NuGet.
2. Configurar conexiones de Identity y `dbFortalezaCore`.
3. Crear o restaurar `dbFortalezaCore` sin reutilizar ciegamente rutas físicas, usuarios o cambios de recovery del DDL de origen.
4. Configurar linked servers y accesos a SAP, interfaces, `SSISDB`, `ReportServer` y `dbFortalezaIdentity`.
5. Configurar URLs compartidas entre WebApp, Identity y WinAuth.
6. Configurar IIS/Windows Authentication para WinAuth.
7. Configurar claves de roles y menús.
8. Crear o validar configuraciones de integraciones en la tabla `Configuraciones`.
9. Compilar `MicrotechIdentity.sln`.
10. Ejecutar primero Identity/WinAuth y luego FortalezaCoreWebApp.
11. Ejecutar `FortalezaCore2D365` como proceso separado si se requiere sincronización por Service Bus.
12. Desplegar los paquetes SSIS en el catálogo correspondiente y validar sus referencias desde los procedimientos `ssis`.

### 14.3 Configuraciones compartidas importantes

- `WindowsLoginUrl`.
- `IdentityLoginUrl`.
- `IdentityApiUrl`.
- `ManageUrl`.
- `AppUrl`.
- `AccessDeniedUrl`.
- `TiempoExpiracionLogin`.
- `ServicioApiUrlBase`.
- Connection strings `DefaultConnection` y `dbFortalezaCoreEntities`.

## 15. Convenciones de desarrollo observadas

- Los nombres de entidades siguen los nombres físicos de tablas SQL y usan guion bajo.
- Los controladores CRUD suelen corresponder uno a uno con una entidad y una carpeta de vistas.
- Los controladores de prefijo `View_` trabajan principalmente con vistas SQL o pantallas compuestas.
- Los modelos de presentación suelen utilizar prefijo `VM`.
- Los procesos SQL usan prefijos `sp_` para procedimientos y `FCN_` para funciones.
- Las configuraciones se agrupan por los campos `tabla` y `columna`.
- Las operaciones complejas guardan parámetros dinámicos en JSON.
- Los estados y tipos suelen resolverse por códigos de texto, no únicamente por IDs.
- Los procesos externos mantienen IDs de ejecución para trazabilidad.

## 16. Riesgos y deuda técnica conocidos

Esta sección documenta aspectos relevantes para mantenimiento; no reemplaza una auditoría de seguridad.

### Seguridad

- Existen credenciales y conexiones históricas o activas dentro del código/configuración.
- El flujo de `returnUrl` necesita validación estricta para evitar redirecciones externas.
- OAuth permite HTTP inseguro en la configuración actual.
- La validación periódica del security stamp está deshabilitada en WebApp.
- Hay acciones POST sin protección antiforgery visible.
- `customErrors` está desactivado y el modo debug está habilitado en configuraciones base.
- Algunos mensajes de error incluyen stack traces en URLs o respuestas.
- Existe una excepción global de validación TLS para hosts confiables.
- La autorización se aplica de forma distribuida y no mediante una política global.

### Mantenibilidad

- Varios controladores superan miles de líneas.
- La lógica de negocio, persistencia y transporte suele estar mezclada.
- Hay muchas llamadas directas a `SaveChanges`.
- Los repositorios generados y personalizados tienen responsabilidades solapadas.
- Existen consultas SQL construidas manualmente que requieren revisión de parametrización.
- Hay código experimental y grandes bloques comentados dentro de proyectos productivos.
- Los contextos y recursos no siempre tienen una política clara de liberación.
- Los paquetes y frameworks presentan versiones heterogéneas.

### Operación

- El consumidor D365 mantiene reintentos sólo en memoria.
- El tratamiento de respuestas con texto `error` necesita revisión antes de completar mensajes.
- Los paquetes SSIS y objetos SQL no están completamente cubiertos por el versionado del repositorio.
- La base depende de linked servers, `SSISDB`, `ReportServer` y `dbFortalezaIdentity`; un respaldo aislado no contiene toda la topología operativa.
- El DDL incluye usuarios, rutas físicas y opciones propias del servidor de origen.
- Las pruebas pueden modificar datos reales.
- No se identificó un pipeline CI/CD versionado.

### Higiene del repositorio

- La carpeta `packages` contiene dependencias versionadas parcialmente aunque también figura en `.gitignore`.
- Hay archivos `.user`, `obj`, perfiles temporales y metadatos antiguos de control de código fuente.
- `.gitignore` contiene una regla que ignora toda la carpeta `MicrotechIdentity`, por lo que archivos nuevos pueden quedar fuera de control de versiones.

## 17. Recomendaciones de evolución

### Prioridad inmediata

1. Rotar y retirar credenciales del código, archivos de configuración e historial Git.
2. Validar `returnUrl` mediante URL local o una lista explícita de hosts permitidos.
3. Eliminar `AllowInsecureHttp` en ambientes no locales.
4. Evitar registrar contraseñas, tokens y cuerpos con información sensible.
5. Corregir el criterio de éxito, reintentos y dead-letter de `FortalezaCore2D365`.
6. Desactivar debug, activar errores personalizados y endurecer cookies en producción.

### Corto plazo

1. Aplicar autorización global y declarar explícitamente las acciones anónimas.
2. Revisar todas las acciones POST y agregar antiforgery cuando corresponda.
3. Clasificar y aislar las pruebas destructivas o de integración.
4. Añadir un pipeline que compile, analice y ejecute pruebas seguras.
5. Corregir `.gitignore` y retirar artefactos generados del control de versiones.
6. Crear scripts de base de datos versionados para todos los objetos requeridos.

### Mediano plazo

1. Extraer servicios de dominio desde los controladores más grandes.
2. Definir límites transaccionales y una estrategia consistente de unidad de trabajo.
3. Sustituir consultas concatenadas por parámetros tipados.
4. Consolidar clientes HTTP y políticas de timeout/reintento.
5. Separar `MicrotechCommonLib` en una librería real y herramientas ejecutables independientes.
6. Actualizar progresivamente framework y dependencias.
7. Añadir pruebas unitarias de reglas de negocio sin dependencias externas.

## 18. Guía rápida para localizar funcionalidades

| Necesidad | Ubicación principal |
|---|---|
| Login, usuarios y roles | `AspNetIdentity2ExtendingUsersAndRoles/Controllers` |
| Permisos | `AspNetIdentity2ExtendingUsersAndRoles/Filters` y `Repositories/PermissionRepository.cs` |
| Parámetros de integraciones | `Repositories/ConfiguracionesRepository.cs` |
| Contratos | `FortalezaCoreWebApp/Controllers/Contrato*` |
| Clientes | `FortalezaCoreWebApp/Controllers/Cliente*` y `View_Tabs_ClientesController.cs` |
| Cobros y pagos | `Pago*`, `PagosAplicados*`, `View_Boca_Cobranza*` |
| Facturación | `ComprobanteController.cs` |
| Planes y productos | `Plan*`, `Producto*`, `Articulo*` |
| Operaciones | `OperacionController.cs` y repositorios de operación |
| Pagarés | `PagareController.cs`, `Pagare_CabeceraRepository.cs`, `ReportesPdf` |
| Edificios y expensas | `Edificio*`, `Unidad_Expensa*`, `Tipo_Unidad*` |
| Adjudicaciones | `LicitacionController.cs`, `FortalezaApp_AdjudicacionController.cs` |
| SAP | `FortalezaCoreWebClient/SapWS`, `MicrotechCommonLib/SAP`, SQL/SSIS |
| D365 | `FortalezaCore2D365`, `FortalezaCoreWebClient/Dynamics365WS` |
| Bancard | `FortalezaCoreWebClient/BancardWS` |
| DebiPago | `FortalezaCoreWebClient/DebiPago` |
| SSIS | `FortalezaCoreProcesosSSIS`, `MicrotechCommonLib/SSIS` |
| Reportes | `ReportesPdf`, `Reportes.aspx`, `ReporteSepreladController.cs` |
| Modelo de base | `Models/dbFortalezaCoreModel.edmx` |
| Repositorios | `Repositories/GeneratedCode` y `Repositories/CustomCode` |

## 19. Glosario

| Término | Significado dentro del sistema |
|---|---|
| Aporte | Cuota o componente económico asociado a un contrato/artículo. |
| Artículo | Instancia comercial incluida en un contrato, derivada de un producto o plan. |
| Comprobante | Documento de facturación: factura, nota de crédito u otro tipo. |
| Pago aplicado | Relación entre un pago y una cuota/comprobante. |
| Pago lote | Agrupación de pagos provenientes de procesadoras o archivos masivos. |
| Operación | Solicitud de cambio que puede requerir autorización. |
| Cuotero | Calendario o composición de cuotas de un contrato. |
| Procesadora | Entidad externa que procesa cobros, tarjetas o lotes. |
| Nro. interno SAP | Identificador del documento generado en SAP Business One. |
| Execution ID | Identificador usado para rastrear procedimientos o paquetes SSIS. |
| Fortaleza App | Aplicación o canal complementario que consume información de Core. |
| TPago | Módulo de suscripciones, enlaces y reprocesos de pagos. |

## 20. Alcance y mantenimiento de esta documentación

Para mantener este archivo actualizado se recomienda:

1. Actualizar la tabla de módulos al agregar un controlador o proceso nuevo.
2. Documentar toda nueva integración y sus claves de configuración sin incluir secretos.
3. Registrar nuevos stored procedures y scripts de despliegue.
4. Mantener una matriz de roles y permisos por módulo.
5. Documentar cambios en contratos de API, formatos SAP y mensajes Service Bus.
6. Añadir diagramas de secuencia para los procesos críticos de facturación, pagos, adjudicaciones y sincronización D365.
7. Complementar este documento con manuales operativos y funcionales validados por los usuarios de negocio.

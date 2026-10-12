# Perfil: FORTALEZACORE (CORE actual / legado)

Id: `fortalezacore-legado` · Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: borrador derivado de [DocumentacionCore.md](../contexto-documentacion-core.md), que es una revisión estática del repositorio y una fotografía DDL del 5 de agosto de 2026 (354 tablas). El DDL del 12 de octubre de 2026 (435 tablas) está en `contexto/dbFortalezaCore.txt` y se resume en [Contexto:fortaleza-logica-core](../contexto-logica-core-fortaleza.md). No se contrastó con el repositorio actual ni con LAB.

## 1. Identidad

- **Rol en el grupo:** CORE es el sistema donde Fortaleza gestiona los contratos de inversión (20 años, aporte mensual, adjudicación de un departamento), las cobranzas, las adjudicaciones y todo el ciclo de vida del contrato. Hoy es exclusivo de Fortaleza. Ver [contexto del grupo](../contexto-grupo-karimbata.md).
- **Qué es:** monolito empresarial para clientes, contratos, planes y productos, cuotas, cobranzas, comprobantes, pagarés, inmuebles, adjudicaciones y contabilidad.
- **Tipo de plataforma:** desarrollo a medida.
- **Tecnología:** ASP.NET MVC 5 con Razor, ASP.NET Identity 2 con OWIN, Entity Framework 6 Database First (`.edmx`), SQL Server, Dapper y ADO.NET. Frameworks por proyecto: 4.6.2 (WebApp, Identity, WebClient, 2D365), 4.6.1 (WinAuth) y 4.5 (MicrotechCommonLib).
- **Fuentes autorizadas:** [DocumentacionCore.md](../contexto-documentacion-core.md), repositorio FORTALEZACORE, DDL `contexto/dbFortalezaCore.txt` (12/10/2026, local, excluido de git). Dueños técnico y funcional: pendientes.
- **Módulos:** clientes, contratos, planes y productos, cobros y pagos, comprobantes y facturación, pagarés, edificios y expensas, operaciones y aprobaciones, adjudicaciones y licitaciones, calculadoras y tasas, Fortaleza App, TPago, reportes y cumplimiento (SEPRELAD), archivos, correo y FTP.

## 2. Vocabulario

Ver glosario en la sección 19 de DocumentacionCore.md. Términos clave: aporte, artículo, comprobante, pago aplicado, pago lote, operación, cuotero, procesadora, nro. interno SAP, execution ID.

Lógica de negocio leída del DDL (12/10/2026) en [Contexto:fortaleza-logica-core](../contexto-logica-core-fortaleza.md). Resumen para el análisis:
- El tipo de aporte es un **producto de plan** (`ESPERA`, `POSESION`, `POS.PURA`, `EXT.*`, `INSCRIPCION`, variantes `PP1` y `PPFLEX`) con artículo y precio propios; el cuotero es `Contrato_Articulo` + `Contrato_Articulo_Cuota`.
- Estados de contrato vistos en código: `ACTIVO`, `GESTION`, `ADJUDICADO`, `POSESIÓN`, `PENDIENTE.COBRANZAS`, `BAJA`, `FINALIZADO`, `INACTIVO`, con subestados. Estados de cuota y de línea del cuotero: ver el documento.
- Adjudicación: `Contrato_Edificio_Unidad`, eventos de sorteo/licitación con oferta, puntaje de licitación por antigüedad del aporte.
- `Fecha_Contractual` se desplaza por adelantos y ajustes; no es una fecha fija de fin.
- Hay números de artículo y nombres de plan escritos en procedimientos.

## 3. Preguntas de relevamiento

- [ ] ¿El cambio aplica a contratos nuevos, a vigentes o a ambos? Los contratos duran 20 años y tienen historial.
- [ ] ¿En qué estado del contrato aplica: Activo, Adjudicado o Posesión? Hay un proyecto en curso que reorganiza los estados del contrato: verificar si los estados vigentes cambiaron. El paso a Posesión cambia el tipo de aporte del cuotero (de espera a posesión, mucho más elevado); no se agrega otro cuotero. La adjudicación no cambia el aporte ni transfiere posesión.
- [ ] ¿Toca la adjudicación? Puede ser anticipada (sorteo o licitación con inyección extra de capital) o al cabo del plazo. ¿Qué vía y qué efecto en cuotas, cobranza y contabilidad?
- [ ] ¿El cambio de estado debe disparar algo hacia otros sistemas (CRM, SAP, empresas del grupo como Amterra o Arenda)?
- [ ] ¿Hay integración con el CRM involucrada? Hoy es Dynamics 365 y será Zoho CRM: ¿el cambio debe funcionar con ambos durante la transición?
- [ ] ¿Qué módulo y qué consumidores se ven afectados? Recorrer: vista/controlador → repositorio/EDMX → procedimiento o función SQL → integración o reporte.
- [ ] ¿El cambio toca cuotas, comprobantes o pagos? Si es así, ¿cómo afecta a SAP, a procesadoras y a reportes de cartera?
- [ ] ¿Hay operaciones con aprobación? ¿Qué tipo de operación y quién autoriza?
- [ ] ¿Qué roles de menú y permisos por controlador y acción intervienen? ¿Cambia la autorización?
- [ ] ¿Se espera historial? Varias tablas tienen historial temporal de SQL Server.
- [ ] ¿Hay integraciones involucradas (SAP, Dynamics 365, Service Bus, Bancard y otras procesadoras, DebiPago, SSIS, SSRS)? ¿Qué efectos externos tiene probar?
- [ ] ¿Qué productos de plan (`ESPERA`, `POSESION`, `POS.PURA`, `EXT.*`, `PP1`, `PPFLEX`, cochera) y qué planes o promociones (Naranja, Plan amigo, mercado secundario) alcanza el cambio? ¿Se tocan artículos con id fijo en el código (20, 21, 22, 24, 25)?
- [ ] ¿El cambio mueve `Fecha_Contractual` (adelantos, inversión programada, ajuste de cuotero)?
- [ ] ¿Afecta el puntaje de licitación o a eventos de adjudicación ya calculados?
- [ ] ¿Hay clientes con moneda distinta o cotización involucrada?
- [ ] ¿La regla vive en C# o en un procedimiento SQL? Parte de la lógica reside en SQL (esquemas `code`, `ssis`, `jobs`, `oper`).
- [ ] ¿El cambio requiere carga inicial o corrección de datos productivos?

## 4. Consideraciones técnicas típicas

- Cambios coordinados entre vistas Razor, controladores, repositorios (`GeneratedCode` y `CustomCode`), EDMX y objetos SQL. Una regeneración del EDMX puede pisar cambios manuales.
- Esquema como scripts versionados; no hay migraciones Code First.
- Procedimientos usan JSON (`FOR JSON`, `OPENJSON`) como contrato de integración. Conservar la correlación por execution ID.
- Convenciones: nombres de entidades con guion bajo, view models `VM`, controladores `View_` sobre vistas SQL, prefijos `sp_` y `FCN_`, estados por código de texto.
- Pruebas existentes (`FortalezaCoreUnitTest`, `MicrotechIdentityUnitTest`) incluyen pruebas que modifican datos reales o llaman servicios externos. No asumir que son aisladas.
- Dependencias fuera de `dbFortalezaCore`: Identity, SSISDB, ReportServer y servidores vinculados.
- Un proyecto de la solución, `FortalezaCoreProcesosSSIS`, y las pruebas de Identity están fuera de la solución principal.

## 5. Riesgos y deuda conocida

Credenciales en código y configuración, `returnUrl` sin validación estricta, POST sin antiforgery visible, reintentos de `FortalezaCore2D365` solo en memoria, falta de CI/CD versionado, regla de `.gitignore` que excluye `MicrotechIdentity`. Detalle en las secciones 16 y 17 de DocumentacionCore.md.

La deuda técnica se registra aparte de los requisitos de negocio. No se presenta como requisito aprobado.

## 6. Pruebas y validación

Entorno LAB. Pruebas de regresión por módulo afectado. Verificar permisos, validaciones y persistencia. Distinguir pruebas reales, simuladas, bloqueadas y pendientes. Integraciones solo contra destinos de LAB.

## 7. Convenciones de planificación

- Tareas habituales: análisis de impacto, ajuste SQL, actualización de EDMX y repositorios, controlador y vista, permisos, pruebas de regresión, documentación.
- Roles: analista funcional, desarrollador .NET, DBA, QA, responsables de integraciones.
- Destino Jira: proyecto CORE; clave pendiente (ver [configuración Jira](../jira-configuracion.json)).

## 8. Estado de validación

Sin revisión del dueño técnico. Falta contrastar versiones, estructura del repositorio y objetos SQL con el commit y el ambiente actuales.
La sección de vocabulario se enriqueció con una lectura del DDL (v0.2 del perfil). El DDL no trae datos de catálogos: los códigos de estado y producto salen de literales del código y deben contrastarse con las tablas reales.

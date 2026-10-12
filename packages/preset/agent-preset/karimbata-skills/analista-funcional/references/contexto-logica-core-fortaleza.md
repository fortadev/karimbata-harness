# Lógica de negocio de Fortaleza observada en el DDL de CORE

Versión: 0.1 · Fecha: 12 de octubre de 2026.
Fuente: DDL de la base `dbFortalezaCore` (script del 12/10/2026, archivo `contexto/dbFortalezaCore.txt`, local y excluido de git). Contiene estructura y código SQL; **no contiene datos de catálogo**, por lo que los valores de las tablas de tipos y estados salen solo de los literales que usa el código.
Este documento se cita como `Contexto:fortaleza-logica-core`. Complementa a [Contexto:grupo-karimbata](contexto-grupo-karimbata.md) y al [perfil de CORE legado](perfiles/fortalezacore-legado.md).

**Regla de lectura.** Lo marcado **[Observado]** está escrito en el DDL (tabla, columna o literal en un procedimiento). Lo marcado **[Hipótesis]** es una interpretación del nombre o del código y requiere confirmación del dueño funcional. Nada de esto es una regla de negocio aprobada. Los procedimientos con partes comentadas o con sufijos `_bkp`, `_old`, `_borrar` no son evidencia de comportamiento vigente.

## 1. Tamaño y organización

- **[Observado]** 435 tablas, 359 procedimientos, 158 vistas y 225 funciones. Cerca de la mitad de las tablas son temporales, respaldos o migraciones (`temp_*`, `*_histv5…v10`, `TMP_*`, `AUXILIAR_*`, `bd_tablas_migra`). No son modelo de negocio.
- **[Observado]** Frente a [DocumentacionCore.md](contexto-documentacion-core.md) (DDL del 5/8/2026: 354 tablas), el DDL del 12/10/2026 tiene 435: +81 tablas en ~2 meses, en su mayoría `temp_*`, `TMP_*`, `*_hist*`, copias `_v2…_v10` y `PO_*`. Las cifras por esquema de DocumentacionCore ya no coinciden y deben tomarse como aproximadas.
- **[Observado]** Esquemas con función clara: `dbo` (modelo), `code` (lógica de negocio en SQL), `ssis` (pasos de integración y cobranza), `jobs` (procesos programados), `oper` (parámetros de operaciones), `ssrs` (reportes), `app` (Fortaleza App), `ext` (consumo externo), `ini` (carga inicial), `param`, `aud` (auditoría), `log`, `sap`, `oraculo`.
- **[Observado]** Mucha lógica de negocio vive en SQL, no en C#. Los procedimientos cargan parámetros desde `dbFortalezaIdentity.dbo.Configuraciones` (por ejemplo, días de mora para cambio de estado).
- **[Observado]** Tablas temporales de SQL Server (`*_History`) en contrato, cuota, comprobante, pago, cliente, operación.

## 2. Modelo central: contrato, plan y cuotero

```text
Cliente ── Contrato_Cliente ──► Contrato ──► Plan ──► Plan_Detalle_Producto ──► Producto (tipo de aporte)
                                   │                                              │
                                   │                                              └► Articulo ──► Articulo_Concepto ──► Precio por moneda
                                   │
                                   └► Contrato_Articulo  (una línea del cuotero: artículo contratado,
                                          │                cantidad de cuotas, día de cobro, moneda, estado)
                                          └► Contrato_Articulo_Cuota  (cada aporte: nro, estado, monto,
                                                                       vencimiento, saldo, mora, padre/hijas)
```

- **[Observado]** `Contrato` guarda número, plan, cliente, estado y subestado, tipo, categoría, ciclo, motivo, clasificación, sucursal, asesores, edificio, `Fecha_Contractual`, `Codigo_Oportunidad_D365`, `Contrato_Anterior_Id` y `Custom_Fields_Json`. Un contrato puede tener varios clientes con roles: titular, facturar a, referente, representante legal, codeudor.
- **[Observado]** `Plan` define la cantidad de años (`Cantidad_Anhos`), el tipo, el estado y el código SAP. Un plan se compone de productos con cantidad de cuotas (`Plan_Detalle_Producto`).
- **[Hipótesis]** «Cuotero» en el lenguaje del negocio corresponde a `Contrato_Articulo` más sus `Contrato_Articulo_Cuota`.
- **[Observado]** `Fecha_Contractual` se **mueve** en procesos: se adelanta (resta meses) cuando el inversor paga cuotas por adelantado o inversión programada, y se corre (suma meses) cuando el cuotero se ajusta. Es el reloj del plazo de 20 años: no equivale a la fecha de firma.
- **[Observado]** `Contrato_Articulo.Porcentaje_Monto_Espera`, `Aplica_Promo_20_30`, `Modifica_Plazo`, `Monto_Entrega_Inicial`, `Devolucion`, `Pago_A_Cuenta`, `Exonerada` indican variantes de plan y de cobro (promociones, entrega inicial, exoneración de intereses).

## 3. Tipos de aporte

**[Observado]** El «tipo de aporte» es un **producto** del plan (`Producto_Codigo`), no un campo suelto. Productos citados en el código:

| Código de producto | Lectura probable | Marca |
|---|---|---|
| `ESPERA` | Aporte ordinario de espera (mensual) | Observado |
| `POSESION` | Aporte ordinario de posesión | Observado |
| `POS.PURA` | «Posesión pura»: aporte de posesión con instrucción propia y precio propio | Observado; alcance exacto Hipótesis |
| `EXT.ESPERA`, `EXT.POSESION`, `EXT.ADJU` | Aportes **extraordinarios** de espera, de posesión y de adjudicación | Observado |
| `INSCRIPCION` | Cargo de inscripción | Observado |
| `ESPERA.INICIAL`, `ESPERA.PP1`, `POS.PURA.PP1`, `POSESIONPP1`, `EXT.POSESION.PP1`, `EXT.ESPERA.PP1` | Variantes del plan promocional «PP1» | Observado; sentido comercial Hipótesis |
| `PPFLEX1..3`, `PPFLEX.EXT1..3` (artículos) | Posesión flexible: precios escalonados de posesión | Observado |
| `COCHERA`, `PCOCHERA`, `PLANCOCHERA50/75/100` | Planes de cochera (producto adicional) | Observado |
| `MDO.SECUNDARIO` | Mercado secundario | Observado |

- **[Observado]** `Producto_Tipo` distingue `APORTE_ORDINARIO` de `APORTE_EXTRAORDINARIO`. Los extraordinarios tienen período de 6 meses (semestral enero/julio, además de variantes anual y mensual fraccionada); los ordinarios, 1 mes.
- **[Observado]** El precio sale de `Articulo_Concepto_Precio` por moneda. Las conversiones usan `FCN_Obtener_Articulo_Precio_Moneda_Convertida` y cotizaciones de SAP. `Historial_Precios_Aportes` lleva por fecha de vigencia tres montos: cuota de espera, de posesión y de posesión pura. Hay actualización masiva de precios del cuotero (`sp_Actualizacion_Precio_cuotero`) y sincronización de listas de precio con Dynamics (`PriceLevels`, `Lista_Precio_Dynamics`).
- **[Observado]** Los conceptos de espera se separan en `ESPERA_GRAVADA` y `ESPERA_EXENTA`: el aporte tiene componente con y sin impuesto.
- **[Hipótesis]** Cómo coincide esto con lo informado por el PM («solo se cambia el tipo de aporte del cuotero»): cada cuota apunta a un artículo (`Contrato_Articulo_Cuota.Articulo_Id`) que pertenece a un producto; cambiar el producto/artículo de las cuotas pendientes cambia el monto. Hay código que reescribe `Articulo_Id` y pone `Cuota_Monto = NULL` en cuotas pendientes para recalcular. Falta confirmar qué proceso ejecuta el paso a Posesión.

## 4. Estados

### Contrato (`Contrato_Estado`)

**[Observado]** Códigos usados en el código: `ACTIVO`, `GESTION`, `ADJUDICADO`, `POSESIÓN` (id 7 según comentarios), `PENDIENTE.COBRANZAS`, `BAJA`, `FINALIZADO`, `INACTIVO`.
La lista coincide con la advertencia del PM: hay más estados que Activo/Adjudicado/Posesión y se está reorganizando. **Esta lista es la del 12/10/2026 y debe contrastarse con los datos reales de la tabla.**

Subestados (`Contrato_SubEstado`, con banderas `Es_Normal`, `Esta_Activo`, `Esta_Pagando`, `Esta_En_Gestion_De_Cobranza`, `Esta_Adjudicado`): `GESTION`, `GESTION_CERRADO`, `GESTION_FINANCIERO`, `BAJA`, `BAJA_INSCRIPCION`, `BAJA_SIN_CUOTAS`, `RENUNCIA`, `CERRADO`.

Transiciones observadas:
- **[Observado]** `ACTIVO → GESTION`: job diario `jobs.sp_Actualiza_Contrato_Estado`; el contrato activo que no pagó el mes anterior y tiene cuotas pendientes o parcialmente canceladas vencidas pasa a gestión de cobranza. `GESTION → ACTIVO` cuando pagó y quedó al día.
- **[Observado]** `→ BAJA` por mora: existe la lógica (días de mora configurables), pero en este job aparece **comentada**. Quién da hoy las bajas es **Hipótesis** (otro proceso u operación `CONTRATO-CAMBIAR_ESTADO`).
- **[Observado]** `→ ADJUDICADO`: `sp_Confirmar_Cuotas_A_Pagadas` pone el contrato en `ADJUDICADO` cuando se cancelan todas las cuotas del cuotero de un plan promocional (rama PP1) y finaliza el artículo. El paso a `ADJUDICADO` por sorteo o licitación no se vio en esta lectura: se modela con el evento de adjudicación (sección 5) y no se confirmó qué procedimiento cambia el estado.
- **[Observado]** `→ POSESIÓN`: el código **consume** el estado (id 7) para elegir aportes de posesión y para marcar `Propietario`; **no se encontró** en esta lectura el procedimiento que lo establece. Probablemente lo hace la aplicación (C#) o una operación. **Pendiente.**
- **[Observado]** `Propietario = 1` cuando el contrato está en Posesión y tiene más de 150 aportes cancelados del artículo «posesión espera» (artículo 25). Es una regla con número fijo (150).
- **[Riesgo]** Inconsistencia de código: unos objetos comparan `'POSESIÓN'` (con tilde) y otros `'POSESION'`. Si el dato real lleva tilde, los que comparan sin tilde nunca filtran. Verificar en datos.

### Línea del cuotero (`Contrato_Articulo_Estado`)
**[Observado]** `ACTIVO`, `FINALIZADO`, `ANULADO`, `INACTIVO`, `PENDIENTE.MIDDLEOFFICE`, `PENDIENTE.COBRANZAS`, `PENDIENTE_FACTURACION`, `PENDIENTE_DOCUMENTACION`. Los ids 3 y 4 se usan como «en curso» y «finalizado».

### Cuota (`Cuota_Estado`)
**[Observado]** `PENDIENTE` (1), `EN_PROCESO_DE_COBRO` (3), `PARCIALMENTE_CANCELADA` (4), `CANCELADA` (5), `CANCELADA_EXONERADA` (7), `CANCELADA_REFACTURADA`, `CON_CREDITO_PENDIENTE`. Ids tomados de comentarios del código; confirmar con la tabla.

## 5. Adjudicación, licitación y sorteo

- **[Observado]** Asignación: `Contrato_Edificio_Unidad` une contrato y unidad con `Fecha_Adjudicacion`, `Tipo_Adjudicacion_Id`, `Tipo_Garantia_Id`, `Unidad_Estado_Id` (con indicador de entrega) y `Fecha_Posesion_Unidad`. Esto sostiene lo informado: adjudicación y posesión son hitos distintos, con fechas separadas.
- **[Observado]** Unidades (`Edificio` → `Edificio_Piso` → `Edificio_Unidad`) tienen banderas `Disponible_Venta_Directa`, `Para_Adjudicar`, `Para_Licitar`, `Transferido`, metros cuadrados, cuenta catastral y porcentajes de copropiedad y de expensa. Una unidad se destina a adjudicación (sorteo), a licitación o a venta directa.
- **[Observado]** Eventos: `Evento_Adjudicacion` (número, fecha, estado, ubicación) con `Tipo_Evento_Adjudicacion` que lleva `Es_Licitacion` y `Es_Sorteo`. Detalle por unidad (`Evento_Adjudicacion_Detalle`) y por contrato (`Evento_Adjudicacion_Detalle_Contrato`) con `Monto_Oferta`; y `Evento_Adjudicacion_Suplente` con su `Monto_Oferta`. Esto corresponde a la inyección extra de capital de la licitación.
- **[Observado]** Garantía: `Contrato_Garantia` (tipo, escritura, escribanía, monto, vigencia) por contrato y unidad. `Contrato_Inquilino` registra el inquilino de una unidad (vínculo con alquiler, relacionado con Arenda: **Hipótesis**).
- **[Observado]** Cálculo de puntaje de licitación (`FCN_Calculadora_Puntos_Licitacion`, `FCN_Calcular_Antiguedad_Puntaje`): para cada aporte pagado, antigüedad en meses entre la fecha del comprobante y la fecha de licitación; `puntaje = antigüedad × 0,005 × importe`, redondeado. El mes en curso cuenta 0,005. El importe usa el precio del artículo 24 (normal) o 25 (planes «Naranja» y planes `Plan 7/5`, `10/7`, `15/10`, `20/12`, `20/15`, `20/14`, `20/17`). Se guarda en `Calculo_Licitacion_Contrato` (con proyección) y su detalle por línea del cuotero.
- **[Hipótesis]** Los números fijos de artículo (20, 21, 22, 24, 25) y los nombres de plan en el código indican reglas ligadas a datos concretos: cambiarlas exige revisar datos y funciones.
- **Sin evidencia en el DDL** de: cupos, frecuencia de eventos, monto mínimo de la oferta, cómo se aplica la oferta ganadora al cuotero o a la contabilidad (salvo `app.FCN_Retonar_Oferta_Ganadora_PL`, que alimenta la app). Siguen pendientes.

## 6. Operaciones con aprobación

- **[Observado]** `Operacion` + `Operacion_Tipo` (con `Operacion_Tipo_JsonFields` y `Requiere_Autorizacion`) + `Operacion_Autorizacion` + `Operacion_Motivo_Rechazo` + `Rol_Tipo_Operacion` (qué rol puede qué tipo). Los parámetros de cada operación van en JSON.
- **[Observado]** Tipos con código literal: `NOTA_DE_CREDITO`, `ARTICULO-PAGO_MINIMO`, `CUOTA-PAGO_MINIMO`, `POSESION-FLEXIBLE`, `RETORNAR-POSESION-NORMAL`, `CONTRATO-RESERVA_MERCADO_SECUNDARIO`, `CONTRATO-CAMBIAR_ESTADO`, `CAMBIAR-ACUERDO-EXTRAORDINARIO`, `ARTICULO-EXONERAR-INTERES`. Además hay procedimientos de aprobación de **financiación/refinanciación** y de **transferir cuotas**.
- **[Observado]** `RETORNAR-POSESION-NORMAL` (`sp_Aprobar_Operacion_Retornar_Posesion`): vuelve de «posesión flexible» al precio normal de posesión, recalculando cuotas pendientes por tipo de aporte (`ESPERA` o `EXTRAORDINARIO`).
- **[Observado]** Cada operación crea tarea en Dynamics (`sp_Crear_Json_Dynamics365WS_Create_Task_Operacion`).

## 7. Cobranza, mora, comprobantes y pagos

- **[Observado]** Mora: tasa anual por rango de fechas (`Monto_Mora_Porcentaje`), interés diario por cuota (`Contrato_Articulo_Cuota_Interes`) y exoneración por operación aprobada. Cuotas pueden **fraccionarse** (cuota padre e hijas).
- **[Observado]** Pagos: método de pago (`Pago_Metodo`), pago por lote (`Pago_Lote`), débito automático con procesadoras (Bancard, BNF, Cabal, DebiPago, Itaú, Panal, Procard, Regional, Sudameris, UENO, Visión), boca de cobranza, TPago, pagarés (físico y digital), pago mínimo, pagos a cuenta y adelantos.
- **[Observado]** Comprobantes: factura crédito (FCR), factura contado (FCO), nota de crédito (NCR). Envío a SAP por JSON (`sp_Crear_Json_SapWS_*`, `sp_Enviar_Comprobantes_Y_Pagos_SAP`), con `Cod_Cliente_Sap` y número interno SAP. Impuestos y tasas por comprobante.
- **[Observado]** Cierre mensual: `sp_Proceso_Cierre` encadena actualización de estados en gestión, congelamiento de datos adicionales y recategorización de clientes.

## 8. Otros productos y procesos de negocio

- **Mercado secundario** (`Calculo_Mercado_Secundario*`, reserva): **[Observado]** cálculo de valor de un contrato a transferir sobre aportes ordinarios y extraordinarios de espera; **[Hipótesis]** es una reventa o cesión de derechos entre inversores.
- **Plan amigo / referidos** (`Referido_Por`, `contratos_referidos_migrados`, pagos de plan amigo): **[Observado]** beneficio por referidos.
- **Inversión programada** y **adelantos**: **[Observado]** pagos anticipados que adelantan la fecha contractual.
- **Amplia** (`Contrato_Amplia`, `ProdAdicional`): **[Observado]** productos adicionales contratados sobre el contrato; **[Hipótesis]** «Amplia» es un producto de cobranza de servicios adicionales.
- **Expensas** (`Unidad_Expensa*`): **[Observado]** facturación de expensas por unidad y débito.
- **Fidelización y categorías** (`Cliente_Categoria`, `Puntos_Acumulados`, `Cliente_Segmento`, esquema `oraculo` con puntajes de retención): **[Observado]** segmentación del inversor; la categoría «Socio F» se actualiza en cierre.
- **Cumplimiento**: **[Observado]** campos PEP/PIP y `Riesgo_Equifax` en cliente; `ssrs.View_Seprelad`; cola de `Cumplo360`.

## 9. Integraciones visibles en el modelo

| Destino | Evidencia en el DDL |
|---|---|
| **SAP B1** | Códigos SAP en plan, cliente, artículo-concepto; JSON de facturas, notas de crédito y recibos; snapshot de artículos; cotizaciones; vistas con número interno SAP |
| **Dynamics 365** | `Codigo_Oportunidad_D365`, `cliente_crm_id`, listas de precios, JSON de cliente, tarea de acción de cobro, cambio de titular, `Custom_Fields_Json` |
| **Sincronización por bandeja** | `temp.Sincronizacion_Outbox`, `temp.Sincronizacion_Entrada`, `temp.Sincronizacion_UltimoWebhook` y `dbo.Sincronizacion_Control` (entidad, operación, JSON, estado, intentos, webhook). **[Hipótesis]** patrón de bandeja de salida/entrada para sincronizar entidades con un CRM; no se sabe si cubre Dynamics, Zoho o ambos |
| **Zoho CRM** | **Sin ninguna mención** (0 coincidencias) en el DDL. Coherente con «integración CORE↔Zoho pendiente» |
| **Procesadoras y bancos** | Tablas de lote y de respuesta por procesadora; archivos por formato |
| **Fortaleza App** | Esquema `app` (datos de unidades adjudicadas, factura, cliente, edificio, oferta ganadora) |

## 10. Implicancias para el Analista Funcional

- Un «tipo de aporte» es un **producto/artículo de plan con precio propio**. Todo cambio de monto o de tipo toca `Articulo`, precios, cuotas pendientes, comprobantes y envío a SAP.
- Hay **números de artículo y nombres de plan escritos en el código**. Cualquier plan nuevo o renombrado puede dejar de calcular licitación o promociones.
- El contrato no tiene fecha fin fija: `Fecha_Contractual` se mueve. Todo cambio que adelante o corra cuotas debe decir su efecto en esa fecha.
- Tres hitos distintos, con datos distintos: **adjudicación** (`Contrato_Edificio_Unidad`), **posesión** (estado + `Fecha_Posesion_Unidad` + cambio de aporte) y **propietario** (≥150 aportes en posesión).
- El estado del contrato lo cambian **procesos automáticos** (jobs de gestión/activo, cierre) y **operaciones aprobadas**. Un cambio de estados debe revisar ambos, los reportes `ssrs` y los literales de código con tilde.
- Parte de los objetos son respaldos, copias `_v2…_v10` y temporales: pedir confirmación antes de tratarlos como vigentes.

## 11. Pendientes que el DDL no resuelve

- Contenido real de los catálogos (`Contrato_Estado`, `Producto`, `Tipo_Adjudicacion`, `Unidad_Estado`, `Operacion_Tipo`) y de sus ids.
- Qué proceso o pantalla pasa el contrato a `POSESIÓN` y qué dispara el cambio de aporte.
- Quién da de `BAJA` hoy y con qué regla de mora.
- Reglas completas de licitación y sorteo (cupos, frecuencia, oferta mínima) y el tratamiento contable de la oferta.
- Sentido comercial de PP1, Naranja, PPFLEX, Posesión Pura y Amplia.
- Alcance de la bandeja de sincronización (qué CRM y qué entidades).
- Fidelidad con el repositorio actual: este documento sale del DDL, no del código C#.

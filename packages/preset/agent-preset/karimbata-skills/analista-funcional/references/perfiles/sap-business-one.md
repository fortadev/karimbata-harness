# Perfil: SAP Business One

Id: `sap-business-one` · Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: borrador basado en conocimiento general de la plataforma. No se revisó el entorno de Fortaleza. La edición (SQL Server o HANA), la versión, los add-ons y las personalizaciones reales son pendientes.

## 1. Identidad

- **Qué es:** ERP para pequeñas y medianas empresas (finanzas, ventas, compras, inventario, socios de negocio).
- **Tipo de plataforma:** paquete configurable con puntos de extensión.
- **Contexto del grupo** (según el [contexto del grupo](../contexto-grupo-karimbata.md)): SAP B1 es el **ERP oficial de todas las empresas del grupo Karimbatá** para administración y contabilidad. Si las empresas comparten una base o tienen una cada una es pendiente. Hoy **solo CORE se integra con SAP B1**; ningún CRM (Dynamics ni Zoho) se integra directamente.
- **Contexto Fortaleza conocido** (según [DocumentacionCore.md](../contexto-documentacion-core.md)): el CORE legado envía facturas, notas de crédito, recibos, clientes y asientos a SAP B1, por DI API (`SAPbobsCOM`) y servicios HTTP. Las bases `FORTALEZABD` y `FORTALEZABD-DESARROLLO` se consultan con nombres de cuatro partes.
- **Fuentes autorizadas, dueños y entornos:** pendientes.

## 2. Vocabulario

Socio de negocio, artículo, documento de marketing (factura, entrega, pedido), asiento contable, plan de cuentas, campo definido por el usuario (UDF), tabla definida por el usuario (UDT), objeto definido por el usuario (UDO), Service Layer, DI API, query manager, transacciones de usuario.

## 3. Preguntas de relevamiento

- [ ] ¿La necesidad se resuelve con configuración, campos definidos por el usuario, reportes, o requiere desarrollo (DI API, Service Layer, add-on)?
- [ ] ¿Qué documentos y maestros se afectan? ¿Hay impacto contable, de impuestos o de moneda y tipo de cambio?
- [ ] ¿Quién crea o actualiza datos en SAP: usuarios, integraciones o ambos? ¿Quién es el sistema de registro de cada dato?
- [ ] ¿Qué integraciones leen o escriben (CORE, Dynamics, Zoho, bancos)? ¿Qué pasa con ellas si cambia un dato maestro o un campo?
- [ ] ¿Hay cierres contables o períodos que condicionen la fecha de puesta en producción?
- [ ] ¿Qué autorizaciones y procedimientos de aprobación aplican?
- [ ] ¿La edición y versión admiten la funcionalidad necesaria?
- [ ] ¿Qué legislación local y requisitos fiscales aplican (numeración, timbrado, localización)?
- [ ] ¿El cambio aplica a una empresa del grupo o a varias? ¿Hay base o sociedad separada por empresa y operaciones intercompañía?
- [ ] ¿Hay informes (Crystal, query) o reportes de terceros que dependan de lo que se modifica?

## 4. Consideraciones técnicas típicas

- Las personalizaciones se acotan a lo que permite la plataforma: configuración, UDF, UDT, UDO, queries, alertas, Service Layer o DI API, add-ons.
- Una escritura por DI API o Service Layer genera documentos reales y puede afectar saldos. Probar solo en una base de pruebas, nunca asumirlo reversible.
- Un cambio en datos maestros se propaga a las integraciones consumidoras.
- Actualizaciones de versión pueden afectar add-ons y UDOs.

## 5. Riesgos y deuda conocida

| Riesgo | Efecto en un proyecto |
|---|---|
| Personalizaciones no documentadas | Alcance incompleto; requiere inventario previo |
| Integraciones que escriben directamente sobre tablas | Pérdida de consistencia y soporte |
| Cierres contables | Restringe fechas de puesta en producción |

## 6. Pruebas y validación

Base de pruebas de SAP con datos representativos. Validación funcional con el área contable o de negocio. Conciliación de saldos y documentos cuando haya impacto contable.

## 7. Convenciones de planificación

Tareas habituales: relevamiento de proceso, parametrización o desarrollo, pruebas con usuarios, migración o carga de datos, capacitación, paso a producción coordinado con cierre. Destino Jira: proyecto SAP; clave pendiente.

## 8. Estado de validación

Sin revisar por el dueño de SAP. Confirmar versión, edición, add-ons y localización.

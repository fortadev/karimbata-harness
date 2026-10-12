# Perfil: Dynamics 365 (CRM de Fortaleza, en retiro)

Id: `dynamics-365` · Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: borrador. Combina lo informado por el PM (sistema en retiro, reemplazado por Zoho) con lo documentado en [DocumentacionCore.md](../contexto-documentacion-core.md). No se revisó la instancia de Dynamics. Edición, módulos y entidades personalizadas son pendientes.

## 1. Identidad

- **Qué es:** CRM actual de Fortaleza.
- **Estado:** **en retiro**, sin fecha de baja definida. Zoho CRM será el CRM oficial del grupo. La estrategia es la **coexistencia de ambos CRM** mientras se implementa Zoho en Fortaleza, con integraciones CORE–Dynamics–Zoho, hasta quedar solo CORE–Zoho. Dynamics no se integra con SAP B1. Ver [contexto del grupo](../contexto-grupo-karimbata.md).
- **Tipo de plataforma:** SaaS.
- **Integraciones documentadas con CORE:**
  - Autenticación OAuth client credentials.
  - Alta y actualización de contactos, cuentas y oportunidades, por Azure Service Bus y el consumidor `FortalezaCore2D365`.
  - Creación y actualización masiva de productos y listas de precios mediante la Web API (procesamiento por lotes).
  - Sincronización de clientes y códigos de integración SAP/D365 en esquemas SQL (`ini`, `d365`, `temp`).
- **Dueños, fuentes y entornos:** pendientes.

## 2. Vocabulario

Cuenta (`ACCOUNT`, persona jurídica), contacto (`CONTACT`, persona física), oportunidad (`OPPORTUNITY`), `CLIENTESAP`, lista de precios, producto. Los tipos de mensaje provienen de DocumentacionCore (sección 5.5).

## 3. Preguntas de relevamiento

Para cualquier proyecto que toque Dynamics 365 mientras esté vigente:

- [ ] ¿Vale la pena construir sobre Dynamics, o el requisito debe resolverse directamente en Zoho? Un desarrollo nuevo sobre un sistema en retiro debe justificarse; no hay fecha de baja, así que preguntar hasta cuándo se espera que funcione.
- [ ] ¿Qué se pierde si el cambio no se hace?
- [ ] ¿Qué integraciones con CORE dependen de la entidad o campo afectado?

Para la migración a Zoho:

- [ ] ¿Qué entidades se migran (cuentas, contactos, oportunidades, productos, precios, historial de actividades, adjuntos)?
- [ ] ¿Cuál es el sistema de registro de cada dato durante la transición y después?
- [ ] ¿Cómo se mapean campos, estados y tipos entre Dynamics y Zoho? ¿Hay entidades o campos personalizados sin equivalente?
- [ ] ¿Cómo se identifican los clientes ya sincronizados con CORE y SAP (códigos de integración)? ¿Se conservan los identificadores de Dynamics para trazabilidad?
- [ ] La coexistencia está decidida. ¿Qué se sincroniza entre Dynamics, Zoho y CORE durante ese período, en qué dirección y con qué sistema de registro por dato? ¿Cómo se evitan duplicados y conflictos?
- [ ] ¿En qué fase de la transición (solo Dynamics, coexistencia, solo Zoho) debe operar el cambio?
- [ ] ¿Qué usuarios, roles y reportes de Dynamics hay que reproducir?
- [ ] ¿Qué se archiva y por cuánto tiempo, y qué debe poder consultarse después de la baja?
- [ ] ¿Cuál es el plan de reversa si la migración falla?
- [ ] ¿Qué condición dispara el corte final, dado que no hay fecha de baja definida?

## 4. Consideraciones técnicas típicas

- El consumidor `FortalezaCore2D365` reintenta solo en memoria y tiene un criterio de éxito a revisar (DocumentacionCore, sección 16). No asumir que los mensajes ya enviados están todos reconciliados.
- Los procedimientos SQL del CORE construyen JSON de integración para D365; reemplazar el destino implica revisar esos contratos.
- La baja de Dynamics afecta a todo lo que lo consume: el consumidor, el cliente `Dynamics365WS`, los procedimientos `ssis.sp_*` de actualización de clientes, productos y precios, y las colas de Service Bus.

## 5. Riesgos y deuda conocida

| Riesgo | Efecto en un proyecto |
|---|---|
| Sin fecha de baja y coexistencia prolongada | Mantener dos CRM y sus integraciones con CORE aumenta duplicados y costo |
| Integraciones CORE↔D365 sin documentación funcional completa | Reglas de sincronización difíciles de reproducir en Zoho |
| Datos duplicados o inconsistentes entre CRM, CORE y SAP | Arrastran errores a la migración |
| Mensajes pendientes o fallidos en la cola | Datos faltantes tras el corte |

## 6. Pruebas y validación

Conciliar cantidades y muestras de registros entre origen y destino; validar con el área comercial; ensayo general de corte. Detalle en el catálogo de [tipos de proyecto](../tipos-de-proyecto.md), migración de datos e integración.

## 7. Convenciones de planificación

Destino Jira: pendiente de acordar. Proyecto CRM aún sin clave confirmada.

## 8. Estado de validación

Sin validar. Deprecado a mediano plazo; mantener este perfil solo mientras dure la transición.

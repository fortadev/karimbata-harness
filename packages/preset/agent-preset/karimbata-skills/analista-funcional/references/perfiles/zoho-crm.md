# Perfil: Zoho CRM

Id: `zoho-crm` · Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: borrador basado en conocimiento general de la plataforma. No se revisó la cuenta de Fortaleza. Edición, módulos activos y personalizaciones son pendientes.

## 1. Identidad

- **Qué es:** CRM en la nube para gestión comercial (leads, contactos, cuentas, oportunidades).
- **Tipo de plataforma:** SaaS configurable con extensibilidad por scripting y API.
- **Contexto del grupo** (según el [contexto del grupo](../contexto-grupo-karimbata.md)): Zoho CRM es el **CRM oficial del grupo Karimbatá**. Lo usan Fortezza, Fiscrea, Amterra y Arenda (implementado hace unos meses). Fortaleza hoy usa [Dynamics 365](dynamics-365.md) y migrará a Zoho; **ambos CRM coexistirán** durante la implementación, sin fecha de baja de Dynamics.
- **Integraciones:** Zoho ↔ CORE es pendiente de construir. **Zoho ↔ SAP B1 no existe**: ningún CRM se integra hoy directamente con SAP. Lo documentado de CORE es su integración con Dynamics 365.
- **Fuentes autorizadas, dueños y entornos:** pendientes.

## 2. Vocabulario

Módulo, registro, campo personalizado, diseño de página (layout), perfil y rol, regla de flujo de trabajo (workflow), blueprint, función personalizada (Deluge), webhook, API, sandbox, vista personalizada, plantilla de correo.

## 3. Preguntas de relevamiento

- [ ] ¿Se resuelve con configuración (campos, layouts, workflows, blueprints) o requiere funciones personalizadas e integración por API?
- [ ] ¿Qué módulos y campos se afectan? ¿Hay campos personalizados dependientes?
- [ ] ¿Qué perfiles y roles ven o editan los datos? ¿Cambian los permisos?
- [ ] ¿Cuál es el sistema de registro de clientes y contactos? ¿Cómo se sincronizan con ERP o CORE?
- [ ] ¿Qué automatizaciones existentes (workflows, blueprints, funciones) pueden chocar con el cambio?
- [ ] ¿Se requiere carga masiva o limpieza de duplicados?
- [ ] ¿Qué consumo de API esperan los procesos y qué límites de la edición contratada aplican?
- [ ] ¿Hay consentimientos, preferencias de contacto o datos personales que condicionen el uso?
- [ ] ¿Existe sandbox y se pueden copiar configuraciones a producción?
- [ ] ¿Fortaleza, Fortezza, Fiscrea, Amterra y Arenda comparten una sola cuenta de Zoho o tienen cuentas separadas? ¿Cómo se separan datos y permisos entre empresas?
- [ ] ¿El cambio debe aplicarse a todas las empresas del grupo o solo a una? ¿Quién aprueba cuando afecta a varias?
- [ ] ¿Un mismo inversor puede ser cliente de varias empresas del grupo? ¿Cómo se identifica sin duplicarlo entre empresas y entre CRMs?
- [ ] ¿Qué datos de CORE (estado del contrato, unidad, posesión) necesita ver cada empresa en Zoho y con qué permisos?
- [ ] ¿En qué fase de la transición opera el cambio: coexistencia con Dynamics o ya solo Zoho?
- [ ] Para Fortaleza: ¿qué parte del ciclo (clientes, oportunidades, contratos en cobranza) vive en Zoho y cuál sigue siendo registro de CORE?

## 4. Consideraciones técnicas típicas

- Las automatizaciones tienen límites por edición (cantidad de reglas, llamadas a API, funciones).
- Las integraciones suelen apoyarse en la API REST, webhooks y funciones Deluge.
- Los cambios de configuración en producción pueden afectar de inmediato a todos los usuarios. Preferir sandbox cuando exista.
- Los cambios de campos o módulos afectan a reportes, tableros e integraciones.

## 5. Riesgos y deuda conocida

| Riesgo | Efecto en un proyecto |
|---|---|
| Duplicados y datos de baja calidad | Condiciona migraciones y sincronizaciones |
| Automatizaciones superpuestas | Resultados inesperados al agregar una regla |
| Límites de API de la edición | Restringe integraciones masivas |

## 6. Pruebas y validación

Sandbox si existe; de lo contrario, usuarios y registros de prueba identificados. Validación con el área comercial.

## 7. Convenciones de planificación

Tareas habituales: relevamiento de proceso comercial, configuración, funciones o integración, carga o limpieza de datos, pruebas con usuarios, capacitación. Destino Jira: proyecto CRM; clave pendiente. Un proyecto de Fortaleza sobre Zoho suele ser también un proyecto de migración e integración: ver [Dynamics 365](dynamics-365.md).

## 8. Estado de validación

Sin revisar por el dueño del CRM. Confirmar edición, módulos, integraciones activas y si existe sandbox.

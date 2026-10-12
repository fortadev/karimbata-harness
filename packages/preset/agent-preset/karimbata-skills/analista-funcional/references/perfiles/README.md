# Perfiles de sistema

Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: propuesta para revisión. Los perfiles listados son puntos de partida; ninguno está validado con su dueño técnico salvo donde se indique.

## Contexto común al grupo

Además de los perfiles por sistema, existe un [contexto del grupo Karimbatá](../contexto-grupo-karimbata.md): empresas, modelo de negocio de Fortaleza y mapa de sistemas (CORE, Zoho CRM, Dynamics 365, SAP B1). Todo agente lo carga junto con los perfiles del proyecto.

## Qué es un perfil

Un **perfil** concentra lo que un agente necesita saber de una plataforma o sistema para trabajar en él, sin que esa información esté incrustada en el agente. El agente es común; el perfil es intercambiable. Un proyecto puede involucrar **varios perfiles** (por ejemplo, Zoho CRM + SAP B1 + integración).

Esto permite usar el mismo Analista Funcional —y más adelante los demás agentes— en CORE legado, CORE 2.0, SAP Business One, Zoho CRM, una app móvil o un sistema que todavía no tiene perfil.

## Qué contiene un perfil

Cada perfil vive en `perfiles/<id>/perfil.md` y sigue la [plantilla](_plantilla.md):

1. **Identidad:** qué es, tipo de plataforma, dueños y fuentes autorizadas.
2. **Vocabulario:** términos propios que el agente debe respetar.
3. **Preguntas de relevamiento:** lista de comprobación de lo que suele omitirse en esa plataforma.
4. **Consideraciones técnicas típicas:** restricciones, puntos de extensión, límites y formas habituales de cambio.
5. **Riesgos y deuda conocida.**
6. **Cobertura de pruebas y validación:** cómo se comprueba un cambio y qué entornos existen.
7. **Convenciones de planificación:** tipos de tarea habituales, roles y destino en Jira.
8. **Estado de validación:** quién lo revisó y qué falta confirmar.

## Reglas de uso

- El perfil **orienta preguntas y consideraciones**; no sustituye evidencia del proyecto. Una afirmación del perfil que se use en un alcance se cita como `Perfil:<id>` y se confirma con una fuente del proyecto cuando afecte alcance o reglas.
- Un perfil no autoriza acciones, accesos ni cambios. Los permisos los define la plataforma.
- El contexto de un perfil no se aplica a otro sin verificar pertinencia.
- Si el proyecto involucra una plataforma sin perfil, se usa [`generico`](generico.md) y se registra como pendiente la creación del perfil específico.
- Los perfiles son versionados. Cada alcance registra el id y la versión de los perfiles usados.

## Catálogo inicial

| Id | Plataforma | Estado |
|---|---|---|
| [`generico`](generico.md) | Cualquier sistema sin perfil propio | Borrador |
| [`fortalezacore-legado`](fortalezacore-legado.md) | CORE actual (ASP.NET MVC 5, EF6, SQL Server) | Borrador, derivado de [DocumentacionCore.md](../contexto-documentacion-core.md) |
| [`core-2`](core-2.md) | CORE 2.0 (.NET moderno, React) | Esqueleto; falta información del repositorio |
| [`sap-business-one`](sap-business-one.md) | SAP Business One | Borrador de conocimiento general; sin validar con el entorno de Fortaleza |
| [`zoho-crm`](zoho-crm.md) | Zoho CRM (CRM oficial del grupo) | Borrador con contexto del grupo; sin validar con la cuenta |
| [`dynamics-365`](dynamics-365.md) | Dynamics 365 (CRM de Fortaleza, en retiro) | Borrador; deprecado a mediano plazo |
| [`app-movil`](app-movil.md) | Aplicación móvil (nativa o multiplataforma) | Borrador de conocimiento general |

## Cómo agregar un perfil

1. Copiar la [plantilla](_plantilla.md) a `perfiles/<id>/perfil.md`.
2. Completar solo lo respaldado por documentación, repositorio o un responsable. Lo demás queda como «Pendiente de confirmar».
3. Registrar dueño técnico y fecha de revisión.
4. Probar el perfil con un relevamiento real antes de marcarlo como validado.

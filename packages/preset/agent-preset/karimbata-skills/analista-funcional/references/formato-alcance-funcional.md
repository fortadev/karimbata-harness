# Formato del documento de alcance funcional

Versión del formato: 0.2 · Fecha: 12 de octubre de 2026.
Estado: propuesta definida para revisión del equipo; no implica aprobación de negocio.

## Entregable principal

El resultado principal del Analista Funcional será un **Documento de alcance y análisis funcional**, elaborado progresivamente durante el relevamiento. La [plantilla](plantilla-alcance-funcional.md) establece el orden y contenido de salida. Las minutas, transcripciones y extracciones son insumos o anexos; alimentan este documento durante todo el proceso.

La entrega para revisión y la aprobación son hitos distintos. El agente puede cerrar la preparación de una versión en revisión; para habilitar desarrollo, el proyecto exige aprobación funcional y técnica de esa versión. Un archivo generado no demuestra que el alcance fue aprobado.

El flujo se completa con un segundo entregable: después de validar la versión con **todos los interesados requeridos**, el agente genera el [documento `.md` de planificación para Jira](formato-plan-jira.md). El alcance conserva el resultado funcional aprobado; el nuevo documento transforma su planificación en épica, tareas de fase y subtareas.

## Referencia utilizada

Documento: `Alcance_Tareas_Cronograma Asignación Estados Clientes.pdf`, 7 páginas, asociado a GDR-260 y fechado en septiembre de 2026. Se revisaron su texto, tablas y observaciones resaltadas. Su contenido se utiliza como ejemplo de estructura; no aporta reglas globales, estimaciones predeterminadas ni instrucciones para actuar sobre CORE.

Se parte de las doce secciones de la referencia, generalizando los títulos para cualquier tipo de proyecto y sistema. Las tres secciones de planificación de la referencia (tareas, cronograma y resumen de estimación) se agrupan en una sola, con tres subsecciones. Se agrega identificación del documento —con tipo(s) de proyecto, empresas o áreas afectadas, sistemas afectados, perfiles y proyecto Jira destino— y tres secciones para fuentes, aclaraciones y aprobación. En total son trece secciones. La estructura es la misma para todos los tipos de proyecto; el [catálogo de tipos](tipos-de-proyecto.md) y los [perfiles de sistema](perfiles/README.md) determinan qué se enfatiza y qué se pregunta.

| Sección | Contenido de la versión propuesta |
|---|---|
| Identificación | Iniciativa, ticket, tipo(s) de proyecto, empresas o áreas afectadas, sistemas afectados (con su rol y módulos), perfiles usados, proyecto Jira destino, versión, estado (único lugar donde se registra) y responsables. |
| 1. Objetivo | Necesidad, resultado observable y medida de éxito. |
| 2. Alcance | Incluido, excluido y frontera entre sistemas. |
| 3. Análisis funcional | Situación actual, resultado esperado, actores, permisos, requisitos, precedencias y datos. |
| 4. Flujo funcional | Inicio, secuencia, alternativas, errores y fin del proceso. |
| 5. Reglas de negocio | Condiciones, resultados y excepciones con identificadores. |
| 6. Consideraciones técnicas y de plataforma | Forma de cambio (configuración, extensión, código, proceso), restricciones e impacto preliminar, con revisión del responsable técnico. |
| 7. Planificación y estimación | 7.1 Tareas y esfuerzo (entregables con su fase y requisitos, roles, método y dependencias); 7.2 Cronograma (capacidad, fases con sus tareas, hitos y duración calendario); 7.3 Resumen (base, contingencia, total, plazo, supuestos y validación). |
| 8. Casos de prueba mínimos | Escenarios, precondiciones y resultados esperados propuestos para QA. |
| 9. Criterios de aceptación | Condiciones verificables por requisito y forma de comprobarlas. |
| 10. Dependencias y riesgos | Impacto, tratamiento y responsables. |
| 11. Fuentes y trazabilidad | Inventario y relación fuente → requisito → regla → criterio → caso. |
| 12. Preguntas supuestos y decisiones | Contradicciones, bloqueos, responsables y resolución respaldada. |
| 13. Revisión aprobación y control de cambios | Bloqueos, aprobaciones con evidencia, historial de versiones y comprobación de cierre. |

## Qué es obligatorio

La estructura completa se conserva. Cada sección debe contener información sustentada, un pendiente explícito o «No aplica» justificado; no se completa con texto genérico ni se elimina para ocultar carencias.

Para enviar a revisión deben existir objetivo, alcance, actores relevantes, requisitos y reglas coherentes hasta donde lo permitan las fuentes, criterios, trazabilidad y preguntas abiertas identificadas. Los hallazgos pendientes deben señalar qué requisitos y tareas afectan.

La matriz de transiciones, diagramas, carga inicial, auditoría, rendimiento, permisos e integraciones se desarrollan cuando el cambio lo requiere. No se exige una matriz de estados para una funcionalidad que no tiene transiciones, ni se agregan requisitos de modernización por usar esta plantilla.

La sección técnica no reemplaza la especificación técnica detallada exigida por el proyecto. La sección de planificación puede quedar como no estimadas o preliminares mientras falte revisión técnica o capacidad del equipo; no se inventan números para terminar el documento.

## Cómo debe llegar el agente al documento

1. **Recibir y procesar:** inventariar las fuentes y registrar cobertura y limitaciones.
2. **Construir el borrador:** elaborar objetivo, alcance, análisis, flujo, reglas y referencias.
3. **Aclarar:** presentar preguntas con evidencia y efecto; incorporar respuestas como nuevas fuentes o decisiones.
4. **Consolidar:** actualizar cada requisito, regla, criterio y tarea afectado por una respuesta. Mantener una definición vigente y conservar el historial.
5. **Preparar la revisión:** verificar consistencia, trazabilidad, cobertura de criterios y planificación disponible; enviar una versión identificada.
6. **Registrar la revisión:** acordar la lista de interesados requeridos, ampliar la tabla de aprobación de la sección 13 con las filas necesarias e incorporar las decisiones explícitas de todos para la misma versión. La tabla inicial de responsables funcional y técnico no limita la cantidad de interesados.
7. **Preparar Jira:** con todas las aprobaciones verificadas, generar el `.md` desde las fases y tareas del alcance, manteniendo trazabilidad. Los agentes de desarrollo reciben únicamente versiones que cumplan los controles del proyecto.

Estados documentales: `Borrador → En aclaración → En revisión → Aprobado`. La aclaración se omite cuando no hay dudas; los ajustes de revisión pueden devolver el documento a borrador o aclaración. `Sustituido` identifica una versión anterior. Estos estados no reemplazan los estados de ejecución del orquestador.

## Relación con el plan Jira

La planificación del alcance se transforma en la jerarquía de Jira así: la **iniciativa** es la **épica** (`EP`), cada **fase** es una **tarea** (`FA`) y cada **tarea estimable** (`TA`) es una **subtarea** de su fase. Lo que el alcance llama «tarea» es, en Jira, una subtarea. Para que el plan salga sin interpretación, la tabla 7.1 asigna cada `TA` a una fase y a sus requisitos, y el cronograma 7.2 lista las `TA` de cada fase. La comprobación de cierre (13.4) verifica que ambas secciones coincidan. Si falta ese vínculo, el agente completa la planificación con los interesados antes de generar el plan.

## Identificadores y relaciones

- `RF-001`: requisito funcional.
- `RN-001`: regla de negocio.
- `CA-001`: criterio de aceptación.
- `CP-001`: caso de prueba propuesto.
- `TA-001`: tarea estimable.
- `F-001`: fuente.
- `P-001`: pregunta o contradicción.
- `DE-001`: supuesto o decisión, con tipo explícito.
- `DR-001`: dependencia o riesgo, con tipo explícito.

Son identificadores estables dentro de cada solicitud. No se renumeran por reordenar filas. Los identificadores retirados quedan en el historial, no se reutilizan. Se permiten relaciones de muchos a muchos. Un requisito propuesto sin evidencia directa se declara como propuesta y necesita una decisión humana registrada antes de considerarlo aprobado.

## Lecciones concretas del ejemplo

- En las páginas 1 y 2, el alcance y T-06 contemplan crear un cliente desde CORE; la observación de la página 3 lo prohíbe y requiere creación/perfilamiento previos. El agente debe identificar esta diferencia y obtener confirmación de la definición vigente, actualizar tabla, alcance y pruebas, y registrar la resolución. El resaltado no demuestra por sí solo quién aprobó la corrección.
- Las observaciones de T-08/T-09 requieren definir una operación y su aprobación. Debe registrarse la pregunta y el posible efecto sobre las tareas y estimación, sin inventar ese flujo.
- Excluir el desarrollo de CRM no elimina la dependencia del cliente creado en CRM y su código SAP. La plantilla separa exclusiones de precondiciones y dependencias.
- La sección de rendimiento exige tiempos para el volumen real, pero no fija umbrales. El agente debe solicitar volumen y tiempo objetivo para formular un criterio medible.
- La referencia distingue 27 días hábiles de esfuerzo y 6 semanas calendario. La plantilla pide unidad, capacidad y supuestos para explicar esa relación; no replica esos valores ni el porcentaje de contingencia en otros casos.

## Verificación antes de habilitar desarrollo

La versión debe tener aprobación explícita de todos los interesados requeridos, incluyendo responsables funcional y técnico. No pueden permanecer preguntas que cambien alcance, reglas o criterios de los requisitos habilitados, ni supuestos críticos sin validar. Los pendientes técnicos restantes deben tener responsable y efecto delimitado; no habilitan las tareas que dependan de su resolución ni pueden convertirse en subtareas publicables sin resolverlos.

Comprobar referencias existentes, cobertura de todos los requisitos incluidos, concordancia entre reglas y pruebas, y ausencia de definiciones contradictorias. Cuando hay estimación, reconciliar sumas, unidades, contingencia y cronograma. La validación real del software se realiza después; el documento no declara pruebas ejecutadas.

## Presentación y archivos

El formato canónico editable queda en Markdown dentro del proyecto. La versión PDF permite revisar su presentación y compartir una versión fija. El contenido funcional y sus identificadores deberán ser equivalentes entre exportaciones. Una futura salida Word o integración con documentos corporativos puede usar la misma estructura sin cambiar este contrato.

Nombre propuesto para un alcance completado: `Alcance_Funcional_<ticket>_<proyecto-o-sistema>_v<version>`. La plantilla y su PDF se identifican expresamente como formato reutilizable; no son el alcance aprobado de GDR-260.

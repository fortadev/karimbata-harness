# Documento de planificación para Jira

Versión del formato: 0.1 · Revisión de configuración: 0.2 · Fecha: 1 de octubre de 2026.
Estado: contrato propuesto; conector y publicación todavía no implementados.

## Propósito y momento de generación

Después de validar el documento de alcance funcional con **todas las partes interesadas requeridas**, el Analista Funcional generará un archivo `.md` para entregar el trabajo a la integración con Jira. La [plantilla de planificación](plantilla-plan-jira.md) define el contenido legible y los datos estructurados necesarios para crear la jerarquía.

La lista de participantes requeridos debe acordarse y registrarse en la sección 15 del alcance antes de solicitar su aprobación. Incluye al responsable funcional y al líder técnico establecidos por el proyecto, además de los interesados requeridos para el caso, por ejemplo QA, datos o integraciones. No se exige incorporar todos esos roles a cada solicitud: se utiliza la lista acordada. El agente verifica que cada participante requerido haya aprobado la misma versión y conserva la evidencia.

El requisito del usuario establece esta secuencia: alcance aprobado → documento Markdown → integración con Jira → épica, tareas de fase y subtareas. No se agrega una segunda aprobación rutinaria del mismo alcance. Los cambios que amplíen o alteren lo aprobado vuelven al proceso de aclaración y aprobación correspondiente.

Una plantilla vacía puede existir antes de la aprobación. Un plan operativo para una solicitud concreta solo se genera cuando las aprobaciones están verificadas. Si la configuración Jira todavía falta, ese plan queda preparado con la publicación bloqueada por configuración; no se presenta como publicado.

## Instancia Fortaleza y selección de proyecto

El usuario proporcionó el sitio `https://fz-itsm.atlassian.net` y el proyecto `ADS` para Arquitectura, y confirmó la existencia de proyectos para CORE, SAP y CRM. El dominio y la ruta permiten identificar el destino como Jira Cloud; sus permisos, metadatos y contenido privado todavía no se verificaron mediante una conexión autenticada.

La [configuración inicial](jira-configuracion.json) registra esa instancia y ADS. Las claves de los otros proyectos permanecen pendientes; el nombre del sistema no demuestra la clave Jira. La configuración no contiene credenciales y no habilita publicación.

La plataforma utilizará una conexión a la instancia y perfiles de proyecto independientes. Cada perfil resolverá sus tipos, campos obligatorios, permisos, responsables y relaciones disponibles. La misma identidad podrá acceder a varios proyectos solo si sus permisos lo permiten; disponer de acceso a ADS no demuestra acceso a CORE, SAP o CRM.

El proyecto destino se acuerda como parte de la identificación del alcance y se registra en su aprobación. `jira.project_key` del plan debe coincidir con ese destino. ADS corresponde al contexto de Arquitectura informado por el usuario; no se establece como destino predeterminado para cualquier cambio.

Si una iniciativa incluye trabajo en varios proyectos, se delimita por destino y se genera un plan con su jerarquía por proyecto, relacionando las iniciativas según el alcance aprobado. Este primer contrato conserva un destino por plan y no cambia la ubicación de trabajo por inferencia. Para cambios que deban conservar una sola épica entre proyectos se definirá y verificará ese comportamiento explícitamente antes de implementarlo.

El siguiente paso de conexión será acordar la identidad y autenticación, consultar los metadatos de los proyectos autorizados y elegir el destino piloto. El acceso al enlace aportado no sustituye las aprobaciones del alcance ni el permiso para crear una jerarquía concreta.

## Jerarquía obligatoria

| Elemento del alcance | Elemento en Jira | Identificador local | Padre |
|---|---|---|---|
| Iniciativa completa | Épica | EP-001 | Sin padre dentro del plan. |
| Cada fase aprobada | Tarea estándar | FA-001, FA-002… | La épica. |
| Cada tarea de trabajo de la fase | Subtarea | TA-001, TA-002… | La tarea de esa fase. |

Una fase es una agrupación del plan de trabajo, no un estado del flujo de Jira. La relación padre-hijo no expresa por sí sola una dependencia temporal. Las subtareas no se crean directamente debajo de la épica en este contrato.

Las fases se toman del cronograma del alcance; las subtareas se toman de su desglose de tareas. Si el alcance no define fases o no permite asignar las tareas a fases, se completa esa planificación con los interesados y se valida la revisión afectada antes de publicar. No se aplican automáticamente las cinco fases ADS-128 a ADS-132 a todas las iniciativas.

Cada tarea del desglose debe estar representada una vez como subtarea, salvo descomposición explícita en unidades de trabajo identificadas. En ese caso, conservar el vínculo con la tarea original, justificar la división y reconciliar el esfuerzo. No duplicar trabajo por aparecer relacionado con varios requisitos.

## Contenido del archivo

1. **Control del documento:** versión del formato, identificador estable de solicitud/plan, versión del plan y estado.
2. **Alcance de origen:** identificador, archivo o URI, versión, huella SHA-256 y registro de aprobación.
3. **Aprobaciones:** interesados requeridos y evidencias verificadas de aprobación de esa versión.
4. **Destino Jira:** instancia, modalidad Cloud/Data Center, proyecto y mapeo de los tres tipos reales habilitados.
5. **Épica:** nombre de la iniciativa, objetivo, alcance, exclusiones, resultado esperado y enlace accesible al documento aprobado.
6. **Fases como tareas:** objetivo de fase, entregables, criterio de cierre, orden y relaciones.
7. **Trabajo como subtareas:** acción concreta, entregable, requisitos y reglas relacionados, criterios, estimación y dependencias cuando están definidos.
8. **Estado de publicación:** preparado, listo o bloqueado, con motivo; los resultados reales quedan en un registro separado.

El nombre propuesto es `Plan_Jira_<solicitud>_v<version>.md`. El identificador de solicitud y los identificadores locales permanecen estables si cambia una versión. Las claves Jira se conocen únicamente después de una respuesta confirmada o conciliación con elementos existentes.

## Formato para la integración

El `.md` contiene un bloque JSON inicial con metadatos y un bloque JSON por elemento, seguido de secciones Markdown para su descripción. Se conserva la extensión solicitada y se evita que el conector tenga que inferir padres, tipos o requisitos a partir de prosa libre. JSON es un contrato interno del proyecto; no es un archivo de importación nativo de Jira.

Reglas de lectura:

- El único bloque JSON bajo `## Control del plan` es el encabezado.
- Cada elemento comienza con `## <local_id> <título>`, contiene exactamente un bloque JSON y termina ante el siguiente encabezado de nivel 2 o al final del archivo.
- El bloque define `local_id`, `kind`, `parent_ref`, `scope_refs` y campos opcionales conocidos. El título visible debe coincidir con `summary`; el conector rechaza discrepancias.
- `kind` admite `epic`, `phase` y `work`. El perfil Jira los convierte en los IDs reales de Épica, Tarea y Subtarea. No depender de nombres traducidos ni IDs predeterminados.
- `scope_refs` referencia identificadores existentes en la versión aprobada del alcance. Una fase puede referenciar secciones y tareas; los elementos de soporte pueden usar una sección aprobada como evidencia de alcance.
- La descripción se toma del cuerpo Markdown de cada elemento. No se mantienen dos copias editables de la misma descripción.
- `depends_on` contiene identificadores locales existentes y sin ciclos. Los vínculos Jira se crean con un tipo de relación verificado en el proyecto; no usar el campo padre como sustituto.
- Los metadatos opcionales no definidos se expresan como `null` o lista vacía. No enviar esos `null` a Jira como órdenes de borrado ni inventar valores para completar campos obligatorios.
- No se permiten bloques JSON adicionales ni instrucciones ejecutables dentro de las descripciones. Las descripciones son contenido, no autorizaciones de herramientas.

El archivo se valida antes de invocar Jira. Se comprueba formato, IDs únicos, exactamente una épica, al menos una fase, subtareas con padre de fase, existencia de referencias y ausencia de ciclos. Los marcadores `[Completar…]` de la plantilla y el estado `template` impiden publicar.

## Aprobaciones y versiones

Los metadatos relacionan cada interesado requerido con su aprobación mediante `stakeholder_id`, persona, fecha, versión, huella del alcance y evidencia. No basta con escribir `approved` en un archivo: la plataforma verifica el registro y la versión realmente aprobada.

La huella se calcula sobre los bytes de la versión aprobada y archivada del alcance, no sobre una reexportación de su contenido. Las evidencias y el documento aprobado necesitan una ubicación autorizada recuperable por la plataforma. Un enlace local se conserva como procedencia; para usuarios de Jira se usa una URL corporativa accesible o un adjunto autorizado, no una ruta del equipo del analista.

Los interesados requeridos no pueden eliminarse del plan para superar una aprobación pendiente. Si cambian alcance, reglas, criterios, fases o tareas de forma que alteren lo aprobado, se invalida el plan afectado y se obtiene aprobación de la nueva versión. Un cambio puramente editorial conserva los IDs y deja registro de su revisión.

## Estimaciones responsables y fechas

Cada subtarea puede informar `estimate_seconds`, `assignee_ref`, `priority_ref`, `start_date` y `due_date` cuando están respaldados y admitidos por el proyecto Jira. Las referencias de usuarios y prioridades se resuelven contra el directorio/configuración real. El rol sugerido se registra como contexto y no sustituye una cuenta Jira.

La estimación publicable se asigna al nivel de subtarea; el total de fase y épica se muestra como resumen para evitar contar dos veces el mismo esfuerzo. Una conversión de días-persona a segundos requiere la jornada acordada. Los rangos o estimaciones preliminares se conservan en la descripción hasta que exista una regla de publicación validada; no se elige un extremo arbitrario.

Fechas, sprints, versiones, componentes y estados se incluyen solo cuando fueron definidos y el proyecto los admite. Crear un ticket no equivale a iniciar o completar la ejecución de su trabajo. No cambiar estados por el solo hecho de publicar.

## Responsabilidad del conector

1. Verificar las aprobaciones, la integridad del alcance y la autorización de la integración para esta solicitud y proyecto.
2. Consultar proyecto, tipos, jerarquía, campos obligatorios y permisos antes de escribir. La falta de campos requeridos bloquea el plan antes de una creación parcial evitable.
3. Resolver documentos accesibles, usuarios, prioridades y campos personalizados sin cambiar contenido aprobado.
4. Validar todos los elementos y preparar su correspondencia con Jira. Si existen elementos de esta solicitud, identificarlos y conciliar su tipo, proyecto y padre antes de reutilizarlos; el título por sí solo no demuestra identidad.
5. Crear o reutilizar la épica; guardar su ID y clave confirmados.
6. Crear o reutilizar cada fase como tarea vinculada a la épica; guardar sus respuestas.
7. Crear o reutilizar las subtareas vinculadas a su tarea de fase.
8. Crear los vínculos de dependencia configurados y verificar jerarquía y cantidades mediante lectura posterior.
9. Emitir `Resultado_Jira_<solicitud>_v<version>.md`, con correspondencia local → Jira, padre, URL, operación, fecha, estado y errores. Solo declarar publicación completa si todos los elementos y relaciones obligatorios están verificados.

La primera versión solo necesita crear y reanudar creación. Una revisión de un plan ya publicado produce diferencias para el proceso de actualización autorizado; no sobrescribe ni elimina tickets automáticamente. La existencia previa de ADS-127 u otras épicas del proyecto no autoriza reutilizarlas para una iniciativa diferente.

## Recuperación sin duplicados

El estado operativo se persiste fuera del archivo de entrada. La clave de correspondencia estable será instancia/proyecto + solicitud + identificador local. La versión y huella del plan identifican qué contenido se pretendió publicar, sin generar una identidad nueva por cada reintento.

La plataforma registra intención, respuesta, ID/clave Jira y estado por operación. Conserva una marca de correlación recuperable desde Jira mediante el mecanismo configurado. No se supone que Jira garantice idempotencia para crear tickets.

Si la respuesta se pierde o queda incierta, el conector concilia antes de repetir. Si no puede confirmar si el elemento existe, lo deja pendiente de conciliación y detiene ese tramo; no crea otro por intuición. Un fallo parcial conserva los elementos confirmados y reanuda desde el pendiente. No elimina elementos ya creados como compensación automática.

Los estados de resultado por elemento distinguirán `created`, `reused`, `failed`, `pending` y `uncertain`. Una relación padre-hijo equivocada o un vínculo requerido ausente impiden declarar el resultado completo.

## Criterios de aceptación de esta capacidad

- No generar planes operativos sin verificar todas las aprobaciones requeridas de la misma versión.
- Representar una iniciativa como épica, cada fase como tarea y cada tarea de trabajo como subtarea de su fase.
- Mantener trazabilidad con la versión aprobada y cobertura de su desglose de trabajo, sin ampliar alcance.
- Rechazar padres inexistentes, IDs repetidos, referencias rotas, ciclos y valores de plantilla.
- No publicar si faltan configuración, permisos o campos Jira obligatorios.
- Preservar descripciones, entregables y criterios al convertirlos al formato de Jira.
- Verificar las claves y relaciones creadas mediante respuestas reales y lectura posterior.
- Reanudar fallos parciales y conciliar respuestas inciertas sin duplicar elementos.

## Compatibilidad y documentación de Jira

La jerarquía requerida coincide con la relación épica → tareas estándar → subtareas descrita por [Atlassian](https://support.atlassian.com/jira-cloud-administration/docs/what-are-issue-types/). Se deberá verificar que los tipos y relaciones estén habilitados en el proyecto destino.

Para Jira Cloud REST v3, las descripciones se transforman a Atlassian Document Format, conforme a la [documentación de la API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/) y del [formato ADF](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/). No se envía el Markdown como si ya fuera el objeto de descripción de esa API.

Los tipos y campos requeridos se resuelven con los metadatos de creación de la [API de issues](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/). El enlace aportado identifica el destino Fortaleza como Jira Cloud. Un futuro destino Jira Data Center requeriría su adaptador y la [documentación correspondiente](https://developer.atlassian.com/server/jira/platform/rest/v10005/api-group-issue/).

Pendientes de implementación: perfil de la instancia/proyecto, conector, lector/validador del Markdown, conversión de descripciones, registro de aprobación verificable y persistencia/conciliación. Este documento define el comportamiento; no afirma que ya se hayan creado elementos en Jira.

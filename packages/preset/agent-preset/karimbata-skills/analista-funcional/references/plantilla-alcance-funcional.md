# Alcance y análisis funcional

## Identificación del documento

**Iniciativa:** [Nombre del cambio]
**Ticket:** [Identificador o pendiente]
**Tipo(s) de proyecto:** [Desarrollo a medida / Configuración de paquete o SaaS / App móvil / Integración / Migración de datos / Reportes y BI / Mejora de proceso / Infraestructura / Evaluación / Otro]
**Empresas o áreas afectadas:** [Empresa(s), unidad(es) o área(s) que usan o reciben el cambio, y quién aprueba por cada una]
**Sistemas afectados:** [Cada sistema con sus módulos y su rol en el cambio: se modifica / consume o entrega datos / dependencia. Indicar el sistema de registro de los datos clave]
**Perfiles usados:** [Id y versión del perfil de cada sistema, o «sin perfil»]
**Proyecto Jira destino:** [Clave acordada o pendiente]
**Versión y fecha:** [Versión] / [Fecha de emisión]
**Estado:** [Borrador / En aclaración / En revisión / Aprobado / Sustituido]
**Responsable funcional:** [Nombre o pendiente]
**Responsable técnico:** [Nombre o pendiente]

Este documento define el resultado funcional esperado, sus límites y cómo se verificará. Las tareas, estimaciones y fechas indican su condición de preliminares o validadas. Los campos entre corchetes se completan con evidencia; cuando corresponda, se reemplazan por «Pendiente de confirmar» o «No aplica» con justificación.

## 1. Objetivo

**Problema o necesidad:** [Situación que motiva la solicitud y personas afectadas]

**Resultado esperado:** [Cambio observable que debe lograr el sistema]

**Beneficio y medida de éxito:** [Cómo verificará negocio el resultado; magnitud y plazo solamente si están definidos]

## 2. Alcance

### 2.1 Incluido

- [Funcionalidad, proceso, población de datos o módulo que se modifica]
- [Condiciones y límites aplicables]

### 2.2 Fuera de alcance

- [Funcionalidad, sistema, integración o fase excluida expresamente]

### 2.3 Límites y condiciones del alcance

[Sistema responsable, frontera con otros sistemas, dependencias externas y condiciones necesarias. Una integración excluida puede seguir siendo una dependencia del proceso.]

<!-- salto-pagina -->

## 3. Análisis funcional

### 3.1 Situación actual y comportamiento esperado

**Actualmente:** [Descripción respaldada por fuentes; distinguir comportamiento observado de lo relatado]

**Con el cambio:** [Qué cambia para cada actor y qué comportamiento debe conservarse]

### 3.2 Actores y permisos

| Actor o rol | Participación | Acción permitida y restricción |
|---|---|---|
| [Rol] | [Intervención en el proceso] | [Permiso, límite o pendiente] |

### 3.3 Requisitos funcionales

| ID | Necesidad o evento | Comportamiento y resultado esperado | Reglas relacionadas |
|---|---|---|---|
| RF-001 | [Necesidad o disparador] | [Qué debe hacer el sistema y bajo qué condición] | [RN-001 o no aplica] |

Para cada requisito, detallar precondiciones, entradas, validaciones, resultados, errores y efectos sobre otros procesos cuando sean relevantes. La evidencia y los criterios relacionados se registran en la sección 11. Los requisitos de esta sección expresan la solución propuesta; su aprobación se registra para la versión completa del documento.

### 3.4 Prioridades y excepciones

[Orden de evaluación, reglas que prevalecen, condiciones simultáneas y excepciones. Si no se conoce la precedencia, registrar una pregunta bloqueante en la sección 12.]

### 3.5 Datos e información a controlar

| Dato o entidad | Uso y validación funcional | Origen y responsable |
|---|---|---|
| [Dato] | [Obligatoriedad, valores, actualización o historial] | [Fuente y responsable o pendiente] |

Describir necesidades de auditoría, historial, carga inicial y corrección de datos únicamente si corresponden. La definición física de tablas y campos requiere validación técnica.

<!-- salto-pagina -->

## 4. Flujo funcional

**Disparador y precondiciones:** [Evento, acción de usuario o proceso programado]

1. [Actor o sistema inicia la operación]
2. [Se validan datos, permisos y condiciones]
3. [Se aplican las reglas y excepciones]
4. [Se obtiene el resultado y se informa o registra]

**Alternativas y errores:** [Qué ocurre si falla una validación, falta un dato, se repite un evento o existe una condición excepcional]

**Fin del proceso:** [Resultado visible y datos que quedan registrados]

Agregar un diagrama cuando ayude a comprender el recorrido. Para cambios de estados, incluir estado de origen, evento, condición, destino y precedencia; no usar solamente una lista de nombres de estados.

## 5. Reglas de negocio

| ID | Regla | Condición y resultado | Excepción o precedencia |
|---|---|---|---|
| RN-001 | [Nombre breve] | [Regla verificable con condiciones explícitas] | [Excepción o no aplica] |

Cada regla debe tener una única definición vigente. Referenciarla desde requisitos, flujo y pruebas. Una corrección debe actualizar todos los elementos afectados; una nota al margen no sustituye la corrección de la regla.

## 6. Consideraciones técnicas y de plataforma

**Estado de revisión técnica:** [Pendiente / Revisado por responsable y fecha]
**Forma de cambio prevista:** [Configuración / Extensión / Código / Proceso / Combinación; propuesta o confirmada]

- [Restricciones de la plataforma o del perfil usado: versión, licencia, límites, compatibilidad]
- [Impacto previsto en datos, reportes, integraciones, permisos o ambientes]
- [Aspectos de concurrencia, auditoría, volumen, procesos automáticos o reversión que requieren diseño]

Presentar alternativas como propuestas hasta su validación técnica. Las consideraciones tomadas de un perfil se citan como `Perfil:<id>` y se confirman con una fuente del proyecto cuando afecten alcance o reglas. Si el proyecto no incluye código, esta sección trata configuración, límites de la plataforma y ambientes. Una especificación técnica detallada se referencia como entregable asociado si resulta necesaria.

<!-- salto-pagina -->

## 7. Planificación y estimación

Si el cambio no está estimado, marcar cada subsección como «No estimado» en vez de omitirla. Las fases y tareas de esta sección alimentan el plan para Jira: la iniciativa será la épica, cada fase una tarea y cada `TA` una subtarea de su fase. Por eso toda `TA` debe indicar su fase y los requisitos que cubre, y toda fase debe tener al menos una `TA`.

### 7.1 Tareas y esfuerzo estimado

**Condición de la estimación:** [No estimado / Preliminar / Validado por responsable y fecha]
**Unidad y base:** [Horas-persona o días-persona; jornada, método y supuestos]

| ID | Tarea (entregable) | Fase | Requisitos | Rol | Esfuerzo | Dependencia |
|---|---|---|---|---|---|---|
| TA-001 | [Entregable] | [Fase de 7.2] | [RF-001] | [Rol] | [Rango o no estimado] | [Tarea o condición previa] |

Cada `TA` aparece una vez y pertenece a una sola fase. Si una tarea debe dividirse, dividirla en `TA` distintas y reconciliar el esfuerzo. Una tarea transversal (por ejemplo, documentación) se asigna a una fase o se declara su propia fase.

Incluir análisis, desarrollo, documentación, QA, aceptación de usuarios y liberación solamente en la medida necesaria para el cambio. Diferenciar el trabajo del agente de las tareas humanas. No asignar personas sin confirmación.

### 7.2 Cronograma estimativo

**Disponibilidad del equipo:** [Capacidad confirmada o pendiente]
**Calendario:** [Inicio, días hábiles, feriados y condiciones confirmadas o pendientes]

| Fase o hito | Tareas (`TA`) | Duración o período | Dependencias y condición de inicio |
|---|---|---|---|
| [Fase] | [TA-001, TA-002] | [Rango, semana relativa o pendiente] | [Condición] |

Las tareas de cada fase deben coincidir con la columna Fase de 7.1.

**Solapamientos y validaciones:** [Qué puede ejecutarse en paralelo y quién debe validar cada hito]

El esfuerzo en días-persona no equivale al plazo calendario. Usar semanas relativas si no existe fecha de inicio confirmada. No convertir una estimación en fecha comprometida.

### 7.3 Resumen de estimación

**Esfuerzo base:** [Total o rango en la unidad de 7.1; no estimado si faltan datos]

**Contingencia:** [Valor o rango, motivo y base de cálculo; no agregar un porcentaje automático]

**Esfuerzo total:** [Base más contingencia, sin duplicar reservas incluidas en las tareas]

**Plazo calendario:** [Rango o pendiente; consistente con capacidad, dependencias y 7.2]

**Supuestos y exclusiones de la estimación:** [Qué se consideró y qué cambio obligaría a reestimar]

**Validación:** [Preliminar o validada; responsable, fecha y versión]

Los totales deben reconciliarse con las tareas. Las estimaciones del documento de referencia no se reutilizan como valores predeterminados.

## 8. Casos de prueba mínimos

| ID | Requisito | Escenario y precondición | Resultado esperado |
|---|---|---|---|
| CP-001 | RF-001 | [Datos y pasos del caso] | [Resultado observable y verificable] |

Incluir escenarios positivos, negativos, límites y regresión según el impacto. Incorporar permisos, excepciones, prioridades, duplicados o concurrencia cuando sean relevantes. Esta sección propone casos para QA; no afirma que fueron ejecutados ni aprobados.

<!-- salto-pagina -->

## 9. Criterios de aceptación

| ID | Requisito | Condición y resultado verificable | Forma de validación |
|---|---|---|---|
| CA-001 | RF-001 | Dado [contexto], cuando [acción], entonces [resultado]. | [CP-001, evidencia o revisión] |

Los criterios deben permitir decidir si el cambio cumple. Evitar expresiones como «correctamente» o «rápido» sin precisar el resultado, umbral y condiciones. Para rendimiento, definir volumen, tiempo y ambiente; si faltan, registrar la decisión pendiente.

**Responsable de aceptación del cambio:** [Rol o nombre confirmado]

La aprobación de este documento valida el alcance; la aceptación del software se realiza posteriormente con evidencia de ejecución.

## 10. Dependencias y riesgos

| ID | Tipo | Descripción | Efecto y tratamiento | Responsable |
|---|---|---|---|---|
| DR-001 | [Dependencia / Riesgo] | [Situación] | [Impacto y acción] | [Rol o pendiente] |

Considerar datos, autorizaciones, otros sistemas, ambientes, disponibilidad y consumidores afectados. Referenciar en la sección 12 las decisiones todavía necesarias para tratarlos.

## 11. Fuentes y trazabilidad

### 11.1 Inventario de fuentes

| ID | Fuente y versión o fecha | Ubicación relevante | Estado de lectura |
|---|---|---|---|
| F-001 | [Archivo, correo, reunión o decisión] | [Página, diapositiva, hoja/celda, mensaje o minuto] | [Completa / Parcial / Fallida] |

Indicar las limitaciones que afecten el análisis. Referenciar grabaciones y transcripciones sin insertar su contenido completo en el cuerpo. Si no existen fuentes directas para una propuesta, declararla y vincular su decisión posterior.

### 11.2 Matriz de trazabilidad

| Requisito | Fuente y evidencia | Regla | Criterio | Caso |
|---|---|---|---|---|
| RF-001 | [F-001, localizador y fragmento o síntesis fiel] | RN-001 | CA-001 | CP-001 |

Permitir múltiples fuentes, reglas y criterios por requisito. Cada requisito incluido debe tener evidencia o una decisión registrada, y al menos un criterio de aceptación.

## 12. Preguntas supuestos y decisiones

### 12.1 Preguntas y contradicciones abiertas

| ID | Pregunta y referencias | Impacto o bloqueo | Quién debe resolver |
|---|---|---|---|
| P-001 | [Pregunta; fuentes o requisitos afectados] | [Bloqueante para alcance / Para tarea técnica / No bloqueante, con motivo] | [Responsable o pendiente] |

### 12.2 Supuestos y decisiones

| ID | Tipo y definición | Estado y responsable | Evidencia y elementos afectados |
|---|---|---|---|
| DE-001 | [Supuesto por validar / Decisión confirmada] | [Pendiente o confirmada; persona y fecha] | [Fuente; RF, RN, CA y tareas] |

No resolver diferencias por intuición. Una decisión debe cerrar o mantener expresamente la pregunta, actualizar el contenido afectado y conservar su evidencia. Los supuestos críticos sin validar impiden presentar el alcance como aprobado.

<!-- salto-pagina -->

## 13. Revisión aprobación y control de cambios

### 13.1 Bloqueos y próxima acción

El estado vigente del documento se registra solamente en la identificación.

**Bloqueos:** [P-001 u otros; ninguno únicamente después de comprobarlo]
**Próxima acción:** [Aclaración o revisión necesaria]

### 13.2 Registro de aprobación

| Revisión | Responsable | Decisión | Fecha y versión | Evidencia |
|---|---|---|---|---|
| Funcional | [Persona] | [Pendiente / Aprobado / Ajustes requeridos] | [Fecha; versión] | [Referencia] |
| Técnica | [Persona] | [Pendiente / Aprobado / Ajustes requeridos] | [Fecha; versión] | [Referencia] |

El agente prepara y verifica el documento. La aprobación funcional corresponde al responsable de negocio y la técnica al líder técnico, según el proceso del proyecto. El agente no firma ni registra aprobaciones sin evidencia explícita.

### 13.3 Historial de versiones

| Versión | Fecha | Cambio | Elementos afectados |
|---|---|---|---|
| [Versión] | [Fecha] | [Creación o ajuste] | [RF, RN, CA y tareas] |

Si cambia una definición aprobada, generar una nueva versión, evaluar el impacto y renovar las aprobaciones afectadas. El documento anterior se conserva como sustituido.

### 13.4 Comprobación de cierre

- [Verificar] Objetivo y límites explícitos por sistema.
- [Verificar] Requisitos y reglas coherentes, con precedencias y excepciones definidas.
- [Verificar] Fuentes o decisiones trazadas y limitaciones de lectura visibles.
- [Verificar] Criterios verificables para todos los requisitos incluidos.
- [Verificar] Preguntas bloqueantes y supuestos críticos resueltos.
- [Verificar] Consideraciones técnicas y planificación revisadas, o pendientes claramente identificados que no alteran el alcance ni habilitan tareas afectadas.
- [Verificar] Totales y plazos reconciliados cuando existe estimación.
- [Verificar] Cada `TA` tiene una sola fase y al menos un `RF`; cada fase tiene al menos una `TA`; 7.1 y 7.2 coinciden en qué tareas pertenecen a cada fase.
- [Verificar] Aprobaciones funcional y técnica vinculadas a esta versión antes de habilitar desarrollo.

**Conclusión:** [Qué está definido y qué acción corresponde; sin declarar el software validado]

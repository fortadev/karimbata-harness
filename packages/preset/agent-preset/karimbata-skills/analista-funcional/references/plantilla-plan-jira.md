# Plan de publicación en Jira

Plantilla del formato 0.1. Reemplazar los campos con la información del alcance aprobado. Esta plantilla vacía no está habilitada para publicar. Repetir los bloques de fase y trabajo según la planificación aprobada y mantener sus identificadores estables.

## Control del plan

```json
{
  "schema_version": "jira-plan/0.1",
  "document_id": "[Completar identificador estable de solicitud]",
  "document_version": "0.1",
  "state": "template",
  "scope": {
    "id": "[Completar identificador del alcance]",
    "artifact_ref": "[Completar referencia autorizada de la versión aprobada]",
    "jira_accessible_ref": null,
    "version": "[Completar versión aprobada]",
    "sha256": "[Calcular sobre el archivo aprobado archivado]",
    "approval_registry_ref": "[Completar registro de aprobaciones]",
    "required_stakeholders": [
      "[Completar identificadores de todos los interesados requeridos]"
    ],
    "approvals": []
  },
  "jira": {
    "deployment": null,
    "instance_ref": null,
    "project_key": null,
    "profile_ref": null,
    "issue_type_ids": {
      "epic": null,
      "phase": null,
      "work": null
    },
    "dependency_link_type_ref": null
  },
  "publication_policy_ref": null,
  "blockers": []
}
```

En un plan operativo, `state` será `prepared`, `ready` o `blocked`, según los controles. La plataforma verifica la condición; el valor escrito no concede autorización. El perfil Jira resuelve los IDs de tipos y otros campos requeridos antes de publicar.

Cada entrada de `approvals` debe contener `stakeholder_id`, `person_ref`, `decision` con valor `approved`, `approved_at`, `scope_version`, `scope_sha256` y `evidence_ref`, obtenidos del registro real de aprobación. No completar aprobaciones ficticias para transformar la plantilla en un ejemplo publicable.

## EP-001 [Nombre de la iniciativa]

```json
{
  "local_id": "EP-001",
  "kind": "epic",
  "summary": "[Nombre de la iniciativa]",
  "parent_ref": null,
  "scope_refs": {
    "requirements": ["RF-001"],
    "rules": ["RN-001"],
    "acceptance_criteria": ["CA-001"],
    "tasks": ["TA-001", "TA-002"],
    "sections": ["1", "2"]
  },
  "depends_on": [],
  "assignee_ref": null,
  "priority_ref": null,
  "start_date": null,
  "due_date": null,
  "estimate_seconds": null
}
```

### Descripción

[Objetivo, problema que resuelve, sistema y módulos afectados. Referenciar el documento aprobado y su versión mediante una ubicación accesible en Jira.]

### Alcance y exclusiones

- Incluido: [Síntesis fiel del alcance aprobado].
- Fuera de alcance: [Exclusiones aprobadas].

### Entregables y cierre

[Resultado de la iniciativa y criterios globales de aceptación aprobados. El cierre de la épica no se ejecuta durante su creación.]

## FA-001 [Nombre de la fase]

```json
{
  "local_id": "FA-001",
  "kind": "phase",
  "summary": "[Nombre de la fase]",
  "parent_ref": "EP-001",
  "scope_refs": {
    "requirements": ["RF-001"],
    "rules": ["RN-001"],
    "acceptance_criteria": ["CA-001"],
    "tasks": ["TA-001", "TA-002"],
    "sections": ["7", "8"]
  },
  "depends_on": [],
  "assignee_ref": null,
  "priority_ref": null,
  "start_date": null,
  "due_date": null,
  "estimate_seconds": null
}
```

### Descripción

[Objetivo de la fase y condición de inicio según el cronograma aprobado.]

### Entregables

- [Salida de la fase].

### Criterios de cierre

- [Condición verificable para completar la fase].

### Planificación y dependencias

[Período, orden, dependencias y esfuerzo total como resumen de subtareas, cuando estén definidos. No cargar nuevamente el total como estimación propia de la tarea de fase.]

## TA-001 [Nombre de la tarea de trabajo]

```json
{
  "local_id": "TA-001",
  "kind": "work",
  "summary": "[Nombre de la tarea de trabajo]",
  "parent_ref": "FA-001",
  "scope_refs": {
    "requirements": ["RF-001"],
    "rules": ["RN-001"],
    "acceptance_criteria": ["CA-001"],
    "tasks": ["TA-001"],
    "sections": ["7"]
  },
  "depends_on": [],
  "assignee_ref": null,
  "priority_ref": null,
  "start_date": null,
  "due_date": null,
  "estimate_seconds": null
}
```

### Descripción

[Acción concreta, condiciones, entradas y límites de esta tarea. Referenciar RF, RN y decisiones aprobadas relevantes.]

### Entregables

- [Artefacto o resultado verificable].

### Criterios de cierre

- [Condición observable; referencia CA o condición de entrega técnica validada].

### Planificación y dependencias

[Rol, estimación y base de cálculo o no estimado; fechas únicamente si fueron definidas. Las referencias de usuario se resuelven antes de asignar.]

## TA-002 [Nombre de otra tarea de trabajo]

```json
{
  "local_id": "TA-002",
  "kind": "work",
  "summary": "[Nombre de otra tarea de trabajo]",
  "parent_ref": "FA-001",
  "scope_refs": {
    "requirements": ["RF-001"],
    "rules": ["RN-001"],
    "acceptance_criteria": ["CA-001"],
    "tasks": ["TA-002"],
    "sections": ["7"]
  },
  "depends_on": ["TA-001"],
  "assignee_ref": null,
  "priority_ref": null,
  "start_date": null,
  "due_date": null,
  "estimate_seconds": null
}
```

### Descripción

[Trabajo distinto del anterior, incluido en el desglose aprobado. Este segundo bloque es una guía para repetir subtareas; eliminarlo si el alcance no contiene TA-002.]

### Entregables

- [Resultado de la tarea].

### Criterios de cierre

- [Condición verificable y criterio relacionado].

### Planificación y dependencias

[La dependencia de TA-001 es ilustrativa del formato; conservarla solo si corresponde al trabajo aprobado.]

# Analista Funcional: uso compartido por PM

Versión: 0.2 · Fecha: 1 de octubre de 2026.
Estado: requisito de uso multiusuario y repositorio SharePoint confirmado por el usuario; organización y operación propuestas, pendientes de implementación.

## 1. Forma de uso

Cada PM podrá trabajar con el mismo Analista Funcional en las iniciativas que tenga asignadas. La definición común incluirá instrucciones, plantillas y su versión; cada iniciativa tendrá contexto y evidencia independientes. El agente no se copiará y modificará para cada PM.

SharePoint será el repositorio documental compartido previsto. El usuario plantea DeepSeek como modelo por costo y su Harness como entorno de ejecución. Se evaluará DeepSeek Harness oficial como candidato; su identificación exacta, versión y despliegue quedan pendientes. El acceso de los PM podrá ser mediante la interfaz del Harness o una interfaz corporativa, sujeto a verificar identidad y aislamiento por proyecto. Alojar instrucciones en SharePoint no crea ni ejecuta un agente; deben cargarse desde una habilidad distribuida o desde el servicio que lo ejecute.

Codex fue la primera alternativa de piloto y sigue siendo el entorno de trabajo actual para elaborar la definición. Ante la preferencia expresada, el piloto operativo se orientará a evaluar DeepSeek y su Harness. Las instrucciones y plantillas comunes se adaptarán al mecanismo de carga que admita ese entorno, sin obligar a los PM a utilizar Codex. La conexión SharePoint sugerida para Codex no se transfiere automáticamente al Harness: allí debe comprobarse o implementarse una integración propia. El empaquetado del agente y sus conexiones siguen pendientes.

Para el servicio compartido se propone inicio de sesión corporativo, selección de proyecto, conversación y seguimiento del relevamiento. La plataforma cargará una versión publicada de las instrucciones y conservará el estado de cada iniciativa para que una persona autorizada pueda continuarla sin depender del historial privado de otro chat.

## 2. Organización documental propuesta

Un sitio existente de PMO/Proyectos puede alojar estas bibliotecas; el sitio real y sus URLs están pendientes. Los nombres siguientes son ejemplos, no recursos creados.

```text
Sitio PMO / Proyectos
├── Plantillas publicadas
│   └── Analista Funcional
│       ├── Guía de uso
│       ├── Plantilla de alcance funcional
│       └── Plantilla de plan Jira
└── Expedientes de proyectos
    └── PRJ-0001 - Nombre de iniciativa
        ├── 00_Contexto
        ├── 01_Fuentes
        ├── 02_Reuniones_y_transcripciones
        ├── 03_Alcance_funcional
        ├── 04_Aprobaciones
        └── 05_Jira
```

Los identificadores internos de iniciativa no se confundirán con claves Jira. Se organizará por iniciativa y se registrará al PM como responsable, para conservar el expediente si cambia la asignación. Cuando se requiera una frontera de acceso distinta, se usará un sitio o biblioteca con los grupos correspondientes, según diseño de permisos; una carpeta o una vista no representa por sí sola una frontera de seguridad.

Además de las carpetas, se propone registrar: ID de iniciativa, nombre, sistema o sistemas, PM responsable, estado del relevamiento, clave Jira confirmada, interesados requeridos, versión del alcance y versión de la definición del agente. Las vistas podrán mostrar los proyectos de un PM o de un sistema, sin sustituir los permisos.

## 3. Acceso y responsabilidades

| Rol | Responsabilidad propuesta |
|---|---|
| PM asignado | Aportar fuentes, aclarar contexto, coordinar revisión y continuar el relevamiento de sus proyectos. |
| Interesado requerido | Revisar y registrar su decisión sobre la versión concreta del alcance; el rol PM no sustituye todas las aprobaciones. |
| Administrador del agente | Publicar instrucciones y plantillas comunes; gestionar versiones y configuración de operación. |
| Responsable de plataforma | Configurar conexiones, permisos, estado, recuperación y registro de operaciones. |

La ejecución verificará usuario, iniciativa y fuentes autorizadas antes de leer o escribir. El contenido y el contexto recuperado de un proyecto no se aplicarán a otro sin una autorización explícita y pertinente. Las cuentas y credenciales serán individuales o de servicio según la arquitectura; los secretos quedarán fuera de bibliotecas y documentos.

Para una integración propia, Microsoft Graph permite acceso delegado y permisos de aplicación acotados a recursos seleccionados. Si se usa una identidad de servicio, la plataforma debe comprobar también los permisos del PM solicitante; el acceso del servicio no demuestra que ese PM esté autorizado. Los permisos SharePoint y Jira se verificarán por separado.

## 4. Flujo de una iniciativa

1. El PM selecciona o registra la iniciativa y confirma sus fuentes, interesados y destino Jira.
2. El agente registra las referencias y versiones de las fuentes; produce extracciones, preguntas, minutas y un borrador de alcance.
3. Los interesados revisan la versión y registran las decisiones requeridas.
4. El agente genera el plan `.md` solo cuando todas las aprobaciones requeridas correspondan a la misma versión y huella del alcance.
5. La integración valida permisos y configuración Jira, publica la jerarquía aprobada y registra claves, URLs y operaciones confirmadas.
6. Las revisiones posteriores señalan qué requisitos y aprobaciones resultan afectados.

La evidencia de aprobación registrará identidad, rol, fecha, decisión, versión y huella del documento. Una columna con valor «Aprobado» o el historial de versiones no bastan para demostrar la aprobación de todas las partes. SharePoint conservará los artefactos y la evidencia documental; el mecanismo de aprobación y el registro operativo aún deben implementarse.

Para varias personas trabajando en la misma iniciativa, se implementará control de revisiones o coordinación de escritura para evitar sobrescribir cambios. La publicación Jira tendrá un registro compartido y control de concurrencia: dos ejecuciones sobre el mismo alcance no deben crear épicas o tareas duplicadas. El estado de ejecución y ese registro deben persistirse con las garantías del orquestador; no dependerán únicamente de carpetas sincronizadas.

## 5. Configuración del modelo

DeepSeek es el candidato preferido por el usuario, sujeto a evaluación con el relevamiento piloto. El nombre de modelo concreto, modalidad de consumo y herramientas de extracción/transcripción se definirán por separado. Se medirá calidad, tiempo y costo por alcance revisado, incluyendo reintentos y procesamiento de fuentes; no se concluye un ahorro total solo a partir del precio por token.

La documentación del Harness oficial describe una interfaz web y configuración en Settings → Models mediante una clave API de DeepSeek. También permite adaptar sus capacidades mediante plugins. El repositorio lo identifica como developer preview con cambios que pueden romper compatibilidad; se fijará una versión para evaluar el piloto. Esto no acredita todavía integración con SharePoint/Jira ni operación corporativa multiusuario.

En un piloto individual, las credenciales se configurarán en el mecanismo de secretos del entorno, sin incorporarlas al expediente. Para un servicio compartido, se propone administración central de credenciales y rutas de modelo, con identificación y registro de cada usuario y proyecto. La publicación compartida solo se habilitará después de comprobar autenticación, permisos, separación de sesiones y recuperación.

En el servicio futuro, el administrador configurará proveedor, modelo de análisis y herramientas de extracción/transcripción. Se registrarán las versiones utilizadas por ejecución. Los PM seleccionarán su proyecto y aportarán contexto; un cambio de proveedor deberá respetar los permisos y políticas del proyecto.

## 6. Pendientes para el primer piloto

- Confirmar el sitio SharePoint y sus bibliotecas existentes o designar quién las creará.
- Confirmar el Harness referido por el usuario y evaluar su versión, interfaz, identidad y operación para varios PM.
- Seleccionar dos PM y proyectos representativos, con permisos verificables.
- Evaluar la conexión SharePoint: formatos, referencias/versiones, lectura, escritura y límites reales.
- Publicar la definición reutilizable del agente y acordar el modelo del piloto.
- Configurar la evidencia de aprobación y la integración Jira; ambas siguen pendientes.
- Comprobar que los PM pueden continuar un expediente autorizado y que las revisiones/publicaciones simultáneas no sobrescriben resultados ni duplican tareas.

## Fuentes de diseño

- [Bibliotecas de SharePoint: carpetas, columnas y vistas](https://support.microsoft.com/en-us/sharepoint/libraries/introduction-to-libraries).
- [Permisos seleccionados en OneDrive y SharePoint mediante Microsoft Graph](https://learn.microsoft.com/en-us/graph/permissions-selected-overview).
- [Consulta de versiones de archivos mediante Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/driveitem-list-versions?view=graph-rest-1.0).
- [Repositorio oficial de DeepSeek Harness y estado developer preview](https://github.com/deepseek-ai/deepseek-harness).
- [Guía oficial de interfaz web y configuración del modelo](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/index.md).
- [Arquitectura oficial del Harness y sus plugins](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md).
- [Modelos y precios oficiales de DeepSeek](https://api-docs.deepseek.com/quick_start/pricing/).

Estas referencias describen capacidades de Microsoft y DeepSeek; la propuesta no acredita que estén configuradas en el entorno de Fortaleza ni que todas estén expuestas por los conectores disponibles.

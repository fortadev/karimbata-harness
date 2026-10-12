# Karimbata Harness

Español (Latinoamérica) | [中文](README.zh.md)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/desktop/resources/karimbata-logo-dark.svg">
  <img src="apps/desktop/resources/karimbata-logo.svg" alt="Logo del Grupo Karimbatá" width="120">
</picture>

**Karimbata Harness es el harness de agentes de inteligencia artificial del Grupo Karimbatá.** Permite conversar con modelos de IA y ejecutar tareas sobre proyectos y archivos locales desde una interfaz web o de escritorio.

Este repositorio es una adaptación de [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), desarrollado por [DeepSeek AI](https://deepseek.com). Mantiene su arquitectura de plugins basada en [Cordis](https://github.com/cordiverse/cordis) e incorpora la identidad visual del Grupo Karimbatá, español latinoamericano y controles separados para seleccionar el proveedor y el modelo de IA.

## Funcionalidades

- **Proveedor de IA y modelo de IA:** dos selectores independientes en el área donde escribes tus solicitudes. El selector de modelos muestra los modelos del proveedor elegido.
- **Modelos por API:** integración con DeepSeek y proveedores configurables como Kimi, OpenAI (modelos GPT) y Anthropic (modelos Claude), según las credenciales y los modelos disponibles.
- **Proyectos locales:** selección de una carpeta de trabajo para que el agente lea y edite archivos, ejecute comandos y ayude con las tareas del proyecto.
- **Conversaciones y tareas:** sesiones persistentes, planificación, delegación a otros agentes y seguimiento de la ejecución.
- **Interfaz adaptable:** modos claro y oscuro, identidad visual del Grupo Karimbatá y soporte para español latinoamericano, inglés y chino simplificado.
- **Extensiones mediante plugins:** herramientas y capacidades que se pueden combinar sin modificar el núcleo del agente.

## Cómo funciona

El harness ejecuta el agente y sus herramientas en el equipo donde se inicia. El proveedor de IA recibe las solicitudes por API y devuelve las respuestas; el harness utiliza esas respuestas para continuar la conversación o ejecutar las herramientas permitidas por la configuración de permisos.

Al seleccionar un proyecto, el agente trabaja con su carpeta local. Las solicitudes al proveedor pueden incluir instrucciones, mensajes y fragmentos de los archivos necesarios para la tarea. Consulta el [aviso de seguridad](SAFETY.md) antes de utilizarlo con información sensible o autorizar operaciones sobre tus archivos.

## Versión preliminar

Karimbata Harness está en desarrollo activo y puede recibir cambios que rompan la compatibilidad de sus funciones o de las API de plugins.

<a id="run"></a>

## Instalación y ejecución

Para compilar desde el código fuente necesitas Git, Node.js 22 desde la versión 22.19 o Node.js 24 o superior, y pnpm 11.28.5. Para ejecutar esta adaptación, utiliza el código de este repositorio.

<a id="run-from-source"></a>

### Instalador de Windows (prueba)

El instalador de escritorio permite ejecutar Karimbata Harness en Windows x64 y trabajar con las carpetas locales de cada equipo. Instala la aplicación para el usuario actual e incluye su entorno de ejecución; los usuarios que reciben el EXE no necesitan instalar Git, Node.js ni Python.

Para generar el instalador desde una copia preparada del repositorio, ejecuta en Windows:

```sh
pnpm run package:desktop:win:x64:unsigned --check
pnpm run package:desktop:win:x64:unsigned
```

El EXE se guarda en `apps/desktop/.desktop-build/targets/win-x64/unsigned-artifacts/`. Esta versión de prueba no requiere un servidor de actualizaciones y se actualiza instalando manualmente el siguiente EXE. El instalador admite español y utiliza la marca Karimbata Harness. Las claves API se configuran después de instalar; no se distribuyen dentro del EXE. El inicio de sesión con Active Directory o Entra ID y el intermediario corporativo de API todavía no están integrados. Consulta los requisitos de compilación y verificación en la [guía del instalador de Windows](apps/desktop/README.md#unsigned-windows-test-installer).

### Ejecutar desde el código fuente

```sh
git clone https://github.com/fortadev/karimbata-harness.git
cd karimbata-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` genera los archivos necesarios para ejecutar la aplicación. `pnpm dsh web` inicia la interfaz web con esos archivos, sin volver a compilar.

En un inicio local, la aplicación abre el navegador y utiliza `http://127.0.0.1:3080` de forma predeterminada. La terminal muestra la dirección de acceso. Usa `--no-open` para iniciar sin abrir el navegador; mediante SSH se imprime la dirección para que el cliente gestione el acceso. Consulta la [guía de la interfaz web](docs/user/guide/index.md) para más detalles.

Para utilizar la aplicación de escritorio, consulta la [guía de escritorio](apps/desktop/README.md).

## Configurar el proveedor y el modelo de IA

1. Abre **Configuración → Modelos** y configura el proveedor con una clave API válida. Puedes agregar otros proveedores desde esa misma sección.
2. Selecciona o agrega la carpeta de tu proyecto como espacio de trabajo.
3. En el área de escritura, abre el selector **Proveedor de IA** y elige un proveedor disponible.
4. Abre el selector de modelos y elige uno de los modelos de ese proveedor. Si el modelo admite niveles de razonamiento, puedes ajustarlos en su menú.
5. Escribe una solicitud y envíala para comenzar la tarea.

Al cambiar a otro proveedor, el harness selecciona su primer modelo disponible y su nivel de razonamiento predeterminado. Puedes cambiar el modelo después. La selección se aplica a la siguiente solicitud; una ejecución en curso conserva la selección con la que comenzó.

Los proveedores visibles y los modelos disponibles dependen de la configuración de cada instalación. Las claves API se configuran fuera del repositorio y no se incluyen en el código ni en los recursos de la aplicación. El consumo y la facturación corresponden a la cuenta del proveedor utilizado. Consulta la [guía de configuración de proveedores](docs/user/guide/providers.md) para las opciones disponibles.

## Idioma de la interfaz

Abre **Configuración → General → Idioma** y selecciona **Español (Latinoamérica)**. La aplicación también puede seleccionar este idioma automáticamente según el idioma del sistema o del navegador.

## Desarrollo y contribuciones

La [guía de desarrollo](docs/development.md) explica el entorno y los comandos de trabajo. La [documentación de arquitectura](docs/architecture.md) describe la composición del harness y sus plugins. Estas guías mantienen la documentación técnica del proyecto de origen en inglés y chino.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para contribuir y [AGENTS.md](AGENTS.md) para las instrucciones dirigidas a agentes de desarrollo.

## Soporte

Consulta el [repositorio de Karimbata Harness](https://github.com/fortadev/karimbata-harness) para el código y las actualizaciones de esta adaptación. Para consultas sobre el proyecto original, puedes utilizar las [discusiones de DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/discussions). Al compartir un problema, incluye los pasos para reproducirlo y evita publicar claves API o información confidencial.

## Créditos

El proyecto original DeepSeek Harness es desarrollado por DeepSeek AI. La arquitectura de Cordis se describe en el artículo [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

Referencia bibliográfica del proyecto original:

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## Licencia

Este repositorio conserva la [licencia MIT](LICENSE) del proyecto original. Las dependencias de terceros y sus licencias se detallan en [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

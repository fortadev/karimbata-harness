# Perfil: Aplicación móvil

Id: `app-movil` · Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: borrador de conocimiento general. No describe ninguna app concreta de Fortaleza. Para una app existente (por ejemplo, Fortaleza App, mencionada en [DocumentacionCore.md](../contexto-documentacion-core.md)), crear un perfil derivado con su stack y sus fuentes.

## 1. Identidad

- **Qué es:** aplicación para dispositivos móviles, nativa (iOS, Android) o multiplataforma.
- **Tipo de plataforma:** desarrollo a medida con dependencia de tiendas de aplicaciones y de servicios de respaldo (API).
- **Fuentes, dueños y entornos:** pendientes. Debe indicarse stack, repositorio y backend que consume.

## 2. Vocabulario

Build, release, canal de distribución, notificación push, deep link, permiso del dispositivo, modo sin conexión, sincronización, versión mínima soportada, revisión de tienda.

## 3. Preguntas de relevamiento

**Producto y usuarios**
- [ ] ¿Quiénes son los usuarios, en qué contexto usan la app y con qué conectividad?
- [ ] ¿Es una app nueva o una evolución? ¿Qué debe conservarse de la versión actual?

**Plataforma**
- [ ] ¿iOS, Android o ambos? ¿Qué versiones mínimas y qué tipos de dispositivo?
- [ ] ¿Nativa o multiplataforma, y por qué?
- [ ] ¿Cómo se distribuye: tiendas públicas, distribución interna o gestión de dispositivos?

**Funcionalidad**
- [ ] ¿Qué funciones deben operar sin conexión y cómo se resuelven conflictos al sincronizar?
- [ ] ¿Qué permisos del dispositivo se usan (cámara, ubicación, notificaciones, almacenamiento)?
- [ ] ¿Hay notificaciones push, con qué eventos y con qué consentimiento?

**Backend y seguridad**
- [ ] ¿Qué API consume? ¿Existe, o debe crearse? ¿Quién la mantiene?
- [ ] ¿Cómo se autentica el usuario? ¿Hay datos sensibles almacenados en el dispositivo?
- [ ] ¿Qué ocurre cuando un usuario tiene una versión antigua de la app?

**Entrega**
- [ ] ¿Qué plazos impone la revisión de las tiendas y quién administra las cuentas de desarrollador?
- [ ] ¿Cómo se mide el uso y los fallos (analítica, reportes de errores)?
- [ ] ¿Se requiere accesibilidad, idiomas o normativa de privacidad específica?

## 4. Consideraciones técnicas típicas

- Las versiones antiguas conviven con el backend: los cambios de API necesitan compatibilidad hacia atrás o actualización forzada.
- La publicación en tiendas depende de revisiones externas y de sus políticas.
- Probar en dispositivos y versiones representativas, no solo en emulador.
- Los datos almacenados en el dispositivo requieren protección.

## 5. Riesgos y deuda conocida

| Riesgo | Efecto en un proyecto |
|---|---|
| Rechazo o demora en la revisión de tiendas | Afecta fechas de entrega |
| Fragmentación de dispositivos y versiones | Amplía el plan de pruebas |
| Usuarios con versiones antiguas | Obliga a compatibilidad de API o actualización forzada |

## 6. Pruebas y validación

Pruebas en dispositivos reales y emuladores, distribución interna de builds (por ejemplo, canales de prueba), pruebas de conectividad deficiente y de sincronización, aceptación con usuarios piloto.

## 7. Convenciones de planificación

Tareas habituales: diseño de experiencia, construcción por plataforma, API de respaldo, pruebas en dispositivos, preparación de publicación, monitoreo posterior. Destino Jira: pendiente de acordar.

## 8. Estado de validación

Sin validar. Debe especializarse al incorporar una app concreta.

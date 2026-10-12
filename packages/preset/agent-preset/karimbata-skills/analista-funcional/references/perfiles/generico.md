# Perfil: Genérico (sistema sin perfil propio)

Id: `generico` · Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: borrador.

## 1. Identidad

Se usa cuando el proyecto involucra una plataforma que todavía no tiene perfil, o cuando el sistema aún no está definido. No aporta conocimiento de ninguna plataforma. Solo asegura que el relevamiento cubra las preguntas que aplican a cualquier proyecto de sistemas.

Al usarlo, el analista registra en la sección 14 del alcance una decisión pendiente: **crear el perfil específico** o confirmar que no se necesita.

## 2. Preguntas de relevamiento

Aplican a cualquier proyecto. Una respuesta ausente se registra como pregunta abierta, no se completa por suposición.

**Sistemas y propiedad**
- [ ] ¿Qué sistemas intervienen y cuál es el sistema de registro de cada dato?
- [ ] ¿Quién es el dueño funcional y el técnico de cada sistema?
- [ ] ¿Hay integraciones existentes que el cambio pueda afectar? ¿Quiénes son sus consumidores?

**Usuarios y permisos**
- [ ] ¿Qué roles participan y qué puede hacer cada uno?
- [ ] ¿Hay segregación de funciones o aprobaciones requeridas?

**Datos**
- [ ] ¿Qué datos se crean, modifican o consultan? ¿Hay datos personales o financieros?
- [ ] ¿Se necesita carga inicial, migración o corrección de datos existentes?
- [ ] ¿Se requiere historial o auditoría de cambios?
- [ ] ¿Cuál es el volumen real (registros, transacciones por día) y el tiempo objetivo aceptable?

**Proceso**
- [ ] ¿Cómo se hace hoy, de punta a punta, y quién lo hace?
- [ ] ¿Qué casos excepcionales, errores y reintentos existen?
- [ ] ¿Qué reglas de negocio aplican y cuál prevalece si dos chocan?

**Entrega**
- [ ] ¿Qué ambientes existen para probar? ¿Con qué datos?
- [ ] ¿Quién acepta el resultado y con qué criterio?
- [ ] ¿Hay fecha límite externa (normativa, cierre contable, campaña)? ¿Cuál es su origen?
- [ ] ¿Se requiere capacitación, manual o comunicación a usuarios?
- [ ] ¿Qué pasa si el cambio debe revertirse?

**Cumplimiento**
- [ ] ¿Hay normativa, política interna o requisito de seguridad que condicione la solución?

## 3. Consideraciones técnicas típicas

Sin información de la plataforma, la sección 6 del alcance se marca **preliminar** y se limita a las restricciones declaradas por las fuentes. No se proponen tecnologías ni patrones.

## 4. Convenciones de planificación

Tareas habituales: relevamiento, diseño, construcción o configuración, pruebas, migración de datos, capacitación, puesta en producción. Se incluyen solo las que el proyecto necesita. Roles y estimaciones se dejan como no estimados si no hay base.

## 5. Estado de validación

Sin validar. Debe revisarse con el primer proyecto real.

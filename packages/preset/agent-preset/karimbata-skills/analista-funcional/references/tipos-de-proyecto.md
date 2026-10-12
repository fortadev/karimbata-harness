# Tipos de proyecto

Versión: 0.1 · Fecha: 12 de octubre de 2026.
Estado: propuesta para revisión.

El Analista Funcional no asume que un proyecto es «desarrollo de software». Al iniciar, clasifica el proyecto en uno o más tipos. La clasificación **no cambia la estructura de 13 secciones del alcance**: cambia qué preguntas se hacen, qué se enfatiza y qué tareas son habituales. Un proyecto puede combinar tipos.

Los tipos son orientativos. Si ninguno encaja, se usa el que más se aproxime y se registra la diferencia.

| Tipo | Ejemplos | Qué se enfatiza en el análisis | Tareas habituales |
|---|---|---|---|
| **Desarrollo a medida** | Funcionalidad nueva o cambio en CORE, backend, web | Requisitos y reglas, contratos de API, datos, regresión, compatibilidad | Diseño, construcción, pruebas, documentación, liberación |
| **Configuración de paquete o SaaS** | Parametrizar SAP B1, campos y flujos en Zoho CRM | Proceso objetivo, brecha con lo estándar, límites de la plataforma, permisos, ambiente de pruebas | Parametrización, pruebas con usuarios, capacitación, paso a producción |
| **Aplicación móvil** | App nueva, nueva versión | Usuarios y contexto de uso, plataformas, conectividad, publicación en tiendas | Diseño, construcción por plataforma, API de respaldo, pruebas en dispositivos, publicación |
| **Integración entre sistemas** | CORE ↔ SAP, CRM ↔ ERP | Sistema de registro de cada dato, contrato de mensajes, volumen, errores y reintentos, idempotencia | Diseño del contrato, desarrollo o configuración de ambos extremos, pruebas extremo a extremo, monitoreo |
| **Migración o carga de datos** | Migrar clientes a un CRM nuevo, depurar maestros | Origen y destino, mapeo, calidad de datos, conciliación, plan de reversa, ventana de corte | Perfilado de datos, mapeo, pruebas de carga, ensayo general, corte |
| **Reportes, BI y analítica** | Tablero de cartera, reporte regulatorio | Preguntas de negocio, definiciones de indicadores, fuentes, frecuencia, permisos de acceso | Definición de métricas, modelado, construcción, validación con negocio |
| **Mejora de proceso o implantación** | Rediseñar un proceso con apoyo de un sistema | Proceso actual y futuro, responsables, cambios organizacionales, indicadores | Mapeo, diseño, cambios en sistemas, capacitación, comunicación |
| **Infraestructura o plataforma** | Servidores, accesos, seguridad, respaldos | Disponibilidad, seguridad, capacidad, ventanas de cambio, reversión | Diseño, aprovisionamiento, pruebas, traspaso a operación |
| **Evaluación o selección de solución** | Comparar proveedores, prueba de concepto | Criterios de decisión, alternativas, costos, riesgos | Relevamiento de requisitos, comparación, prueba, recomendación |

## Cómo se aplica

1. **Clasificar:** el analista propone el tipo o tipos y los registra en la identificación del documento. Si no está claro, lo pregunta; no lo adivina.
2. **Ajustar el relevamiento:** usa las preguntas del perfil de cada sistema involucrado, más las del tipo.
3. **Ajustar el cuerpo:**
   - En un proyecto sin código, la sección 6 trata de configuración, límites de la plataforma, licencias y ambientes, no de arquitectura de software.
   - En una migración, la sección 3.5 (datos) y la 9 (pruebas) ganan peso: mapeo, conciliación y reversa.
   - En una integración, la sección 4 describe ambos extremos y los errores entre ellos.
4. **No forzar secciones:** las que no apliquen se marcan «No aplica» con justificación, nunca se eliminan.
5. **Plan Jira:** las fases y subtareas salen del cronograma aprobado, no de este catálogo. La columna de tareas habituales solo ayuda a detectar omisiones durante el análisis.

## Evaluación o selección: una salvedad

En un proyecto de evaluación, el entregable puede ser una recomendación y no un cambio de sistema. El alcance describe qué se evalúa, con qué criterios y quién decide. No se asumen requisitos de implementación que el proyecto no incluye.

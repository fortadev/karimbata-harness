# Contexto del grupo Karimbatá

Versión: 0.2 · Fecha: 12 de octubre de 2026.
Fuente: descripción del usuario (PM del proyecto) en conversación del 12/10/2026. No fue contrastada con documentación corporativa ni con el código de CORE. Lo marcado «Pendiente» no fue informado.

Este documento da al Analista Funcional (y a futuros agentes) el contexto de negocio y de sistemas que comparten todos los proyectos. Se cita como `Contexto:grupo-karimbata`. No sustituye las fuentes de cada proyecto.

## 1. El grupo

**Karimbatá** es un grupo de empresas. **Fortaleza** es el eje principal; las demás empresas complementan los productos de Fortaleza.

| Empresa | Qué hace | CRM |
|---|---|---|
| **Fortaleza** | Inversión en ladrillos: los inversores aportan capital mensual y Fortaleza construye edificios | Dynamics 365 (migra a Zoho) |
| **Fortezza** | Equipamiento de las unidades (amoblamiento, cocina, sala, dormitorio, etc.) | Zoho CRM |
| **Fiscrea** | Fiscalización de obras | Zoho CRM |
| **Amterra** | Administración de edificios (consorcios) mientras no todas sus unidades estén en posesión o transferidas. Después, el consorcio puede quedarse con Amterra o elegir otra administradora | Zoho CRM |
| **Arenda** | Gestión de alquileres de las unidades: el inversor con posesión que prefiere alquilar en lugar de vivir recibe los ingresos y Arenda gestiona todo | Zoho CRM |

«Fortaleza» y «Fortezza» son empresas distintas; no confundirlas. El CRM de las cuatro empresas distintas de Fortaleza es Zoho (implementado hace unos meses); si cada una tiene cuenta propia o comparten una, es pendiente.

## 2. Modelo de negocio de Fortaleza

### Contrato de inversión

- El inversor firma un **contrato de 20 años**. Aporta capital cada mes y Fortaleza construye edificios con ese dinero y se compromete a **adjudicarle un departamento**.
- El ciclo de vida del contrato incluye venta, aportes mensuales (cuotas y cobranza), cambios del contrato y adjudicación.

### Estados del contrato y tipos de aporte

| Estado del contrato | Qué ocurre | Aporte que paga el inversor |
|---|---|---|
| **Activo** | Contrato vigente, sin departamento adjudicado | **Aporte de espera** |
| **Adjudicado** | Se le asignó un departamento, que aún no está terminado. **No hay posesión** y el monto del aporte **no cambia** | Aporte de espera |
| **Posesión** | El inversor recibe el inmueble. Se estima que ocurre **1 a 2 años después** de la adjudicación | **Aporte de posesión**, mucho más elevado. Deja de pagar el de espera y paga el de posesión hasta cumplir los 20 años |

Esos son los estados informados por el usuario. **Existen más estados de contrato**, pero hay un **proyecto en curso para reorganizarlos**, por lo que la lista definitiva aún no puede darse. Todo proyecto que dependa de estados de contrato debe verificar si ese proyecto de reorganización ya cambió, renombró o eliminó estados, y no asumir la lista actual como estable.

**Cómo se maneja el aporte (informado por el usuario):** los aportes son **tipos de aporte distintos dentro de un mismo cuotero**. Cuando el contrato pasa a Posesión, **solo se cambia el tipo de aporte del cuotero** y con eso el sistema ya sabe cuánto cobrar. Cómo se implementa ese cambio (procedimiento, operación con aprobación, proceso automático) no fue informado.

### Adjudicación

La adjudicación puede ser:
- **Al cabo del plazo**: al cumplirse el contrato.
- **Anticipada**, para recibir un departamento antes. Dos vías:
  - **Sorteo.**
  - **Licitación**: el inversor hace una **inyección extra de capital** para adjudicarse más rápido.

Esto es consistente con los módulos de licitaciones, sorteos y suplentes documentados en [DocumentacionCore.md](contexto-documentacion-core.md). Reglas de cálculo del punto licitatorio, frecuencia de eventos, cupos y suplentes: pendientes (ver sección 6).

### Cadena de valor del inmueble

```text
Aportes ──► Construcción (Fiscrea fiscaliza) ──► Adjudicación ──► Posesión
                                                                   │
                  Equipamiento (Fortezza) ◄────────────────────────┤
                  Administración del consorcio (Amterra) ◄─────────┤
                  Alquiler del inversor (Arenda) ◄─────────────────┘
```

El diagrama es una síntesis del texto del usuario. Los momentos exactos en que cada empresa interviene (por ejemplo, desde cuándo Amterra administra o cuándo se ofrece el equipamiento) son pendientes.

### Implicancias para el análisis

- Los contratos duran 20 años. Un cambio de regla puede afectar contratos vigentes. Preguntar siempre si aplica a contratos nuevos, a vigentes o a ambos, y **en qué estado** (Activo, Adjudicado, Posesión).
- El paso de **Adjudicado a Posesión cambia el tipo y monto del aporte**: toca cuotas, comprobantes, facturación y proyecciones de cobranza.
- La adjudicación **no** cambia el aporte ni transfiere posesión. No mezclar ambos hitos en requisitos ni reportes.
- Una licitación implica una entrada extra de capital: impacto en cobranza, contabilidad y en el cálculo de la adjudicación.
- La posesión es el hito que habilita a las empresas complementarias (administración, equipamiento, alquiler). Un cambio de estado puede ser disparador de procesos en otros sistemas.
- Un proyecto de cualquier empresa del grupo sobre un inversor o unidad depende de datos que nacen en CORE.

### Lo que muestra el DDL de CORE

El DDL de CORE (12/10/2026) detalla el modelo: tipos de aporte como productos de plan, estados de contrato, adjudicación por sorteo y licitación con oferta, operaciones con aprobación. Ver [Contexto:fortaleza-logica-core](contexto-logica-core-fortaleza.md). Lo informado por el PM es consistente con el DDL; el DDL agrega más estados (`GESTION`, `BAJA`, `FINALIZADO`, `INACTIVO`, `PENDIENTE.COBRANZAS`) y más tipos de aporte (extraordinarios, posesión pura, planes PP1 y posesión flexible).

## 3. Mapa de sistemas del grupo

| Sistema | Rol | Empresas que lo usan | Estado |
|---|---|---|---|
| **CORE** | Contratos, cobranzas, adjudicaciones y ciclo de vida del contrato | Solo Fortaleza (por ahora) | Operativo (legado); CORE 2.0 en planificación |
| **Dynamics 365** | CRM de Fortaleza | Fortaleza | Se retira; **sin fecha de baja definida** |
| **Zoho CRM** | CRM oficial del grupo | Fortezza, Fiscrea, Amterra, Arenda; Fortaleza al migrar | Implementado hace unos meses; se sigue implementando |
| **SAP Business One** | ERP oficial: administración y contabilidad | Todas las empresas del grupo | Operativo |

### Integraciones

| Integración | Estado |
|---|---|
| CORE ↔ SAP B1 | **Existe.** Envío de facturas, notas de crédito, recibos, clientes y asientos |
| CORE ↔ Dynamics 365 | **Existe.** Contactos, cuentas, oportunidades, productos y precios |
| CORE ↔ Zoho CRM | Pendiente de construir (ver coexistencia) |
| Dynamics 365 ↔ Zoho CRM | Pendiente de definir (ver coexistencia) |
| Zoho CRM ↔ SAP B1 | **No existe.** Ningún CRM se integra hoy directamente con SAP |
| Dynamics 365 ↔ SAP B1 | **No existe** |

Las integraciones de CORE provienen de [DocumentacionCore.md](contexto-documentacion-core.md) y se confirman con el usuario.

### Coexistencia de CRM y transición

No hay fecha de baja de Dynamics. La estrategia es que **ambos CRM coexistan** mientras se implementa Zoho en Fortaleza.

```text
Hoy:             CORE ◄──► Dynamics 365          (Zoho solo en las otras empresas)
                   │
Transición:      CORE ◄──► Dynamics 365
                   ◄─────► Zoho CRM               (integraciones CORE–Dynamics–Zoho)
                   │
Estado final:    CORE ◄──► Zoho CRM               (Dynamics apagado)
```

Esto implica que cualquier proyecto de CRM debe indicar **en qué fase de la transición** opera, y que los cambios en CORE que toquen clientes u oportunidades deben considerar los dos destinos mientras coexistan. Cómo se sincronizan los datos entre CRMs durante la coexistencia (dirección, sistema de registro, conflictos) es pendiente.

## 4. Proyectos probables derivados de este contexto

Sirven para anticipar relevamientos. No son proyectos aprobados.

- **Implementación de Zoho en Fortaleza y migración desde Dynamics 365.** Combina configuración de paquete, migración de datos e integración.
- **Integraciones CORE ↔ Zoho CRM** y reglas de coexistencia con Dynamics.
- **Integración Zoho CRM ↔ SAP B1** (hoy inexistente) y su relación con las integraciones CORE↔SAP.
- **Proyectos de Fortezza, Fiscrea, Amterra y Arenda** sobre Zoho y SAP, dependientes de datos de CORE (inversores, unidades, estados de contrato).
- **CORE 2.0.**
- **Cambios en CORE sobre estados, adjudicación, licitación y aportes.**

## 5. Plazos conocidos

- Dynamics 365: sin fecha de baja. La fecha de corte final dependerá de que Zoho cubra a Fortaleza.
- Entrega de inmueble tras la adjudicación: estimada en 1 a 2 años (sin fecha comprometida).

## 6. Pendientes de este contexto

**Negocio**
- Lista completa de estados y subestados del contrato y sus transiciones. Depende del proyecto de reorganización de estados en curso; sin información concreta por ahora.
- Cómo se ejecuta el cambio del tipo de aporte al pasar a Posesión y qué lo dispara.
- Reglas de la licitación: cálculo del punto licitatorio, monto mínimo de la inyección, frecuencia de eventos, cupos, suplentes.
- Reglas del sorteo: frecuencia, quiénes participan, cupos.
- Qué ocurre con la inyección de capital de la licitación en el cuotero y en la contabilidad.
- Cómo se define el monto de cada tipo de aporte (el sistema «ya sabe cuánto cobrar» al cambiar el tipo, pero no se informó de dónde sale el monto).
- Momento en que Amterra, Fortezza y Arenda intervienen y qué datos necesitan de CORE.
- Si el inversor es cliente de las empresas complementarias y cómo se identifica entre empresas (documento, ID único).

**Sistemas**
- Cuentas de Zoho: una compartida o una por empresa.
- Bases de SAP B1: una compartida o una por empresa; operaciones intercompañía.
- Estrategia de sincronización entre CRMs durante la coexistencia.
- Cuál será el sistema de registro de clientes e inversores al terminar la migración.
- Si algún otro sistema del grupo debe considerarse.

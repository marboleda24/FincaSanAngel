# Contexto y Objetivos del Proyecto: Finca San Angel

## Objetivo Principal
Desarrollar una aplicación web altamente profesional, totalmente responsive y con un diseño premium visualmente atractivo para centralizar la gestión de una finca lechera. La aplicación debe abarcar módulos administrativos, productivos y financieros.

## Pila Tecnológica (Stack)
- **Frontend y Backend (Fullstack):** Next.js (React).
- **Base de Datos:** PostgreSQL.
- **ORM:** Prisma ORM.
- **Estilos y UI:** CSS Vanilla / Módulos CSS enfocado en diseño profesional, tipografías limpias y microinteracciones (Diseño "Premium").
- **Entorno e Infraestructura:** Docker y Docker Compose para garantizar portabilidad en modo desarrollo y futura producción.
- **Versionamiento:** Git (Github).

## Modelo de Base de Datos Normalizado

*Aviso general:* Todas las entidades cuentan con un campo **Comentarios** (opcional) para anotar justificaciones, salvedades o notas al margen de la línea de negocio agrícola.

1. **Bovino ("Res")**
   - Id (UUID), Identificador, Fecha de nacimiento, Género, Raza, Estado, Id_madre, Id_padre, Comentarios.

2. **ProduccionLeche**
   - Id, Id_bovino, Fecha de ordeño, Turno, Litros, Comentarios.

3. **EventoVeterinario**
   - Id, Id_bovino, Tipo, Fecha programada, Fecha de ejecución, Diagnóstico/Descripción, Veterinario a cargo, Comentarios.

4. **TransaccionFinanciera**
   - Id, Tipo, Categoría, Monto, Fecha, Descripción, Comentarios.

5. **Tarea**
   - Id, Título, Descripción, Fecha límite, Estado, Responsable, Comentarios.

6. **Inventario**
   - Id, Nombre del ítem, Cantidad disponible, Unidad de medida, Comentarios.

7. **MovimientoInventario** (Nuevo)
   - Id, Id_inventario, Tipo (Entrada, Salida, Ajuste), Cantidad, Fecha, Justificación, Comentarios.

*Nota: La "Hoja de Vida de cada Res" será una vista consolidada en la UI que cruzará información del bovino con su producción, historial médico y genealogía, sin redundancia de datos.*

## Reglas Globales
- Componentes, elementos y objetos deben nombrarse en **Español**.
- El código será ampliamente documentado en **Español**.
- Los gastos de inventario impactarán automáticamente el módulo de inventario apoyándose en la tabla **MovimientoInventario** para dejar historial validado.
- Decisiones arquitectónicas siempre referenciadas a este documento.

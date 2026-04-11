# NovaTech Design System

## Product Intent
- Usuario: operador interno de retail tecnologico.
- Objetivo: gestionar catalogo, inventario y ventas sin errores operativos.
- Sensacion objetivo: claridad, control y velocidad de uso.

## Signature
- Firma visual oficial: **Operational Ledger**.
- Superficies solidas, estados claros por item/celda y feedback inmediato antes de confirmar acciones.

## Color Strategy
- Mantener la base azul de `themes.md`.
- Semanticos con uso estricto:
  - success: estado sano/operacion exitosa.
  - warning: atencion/riesgo medio.
  - danger: bloqueo/error/stock critico.
- Evitar colores de acento extra que no aporten significado.

## Surfaces and Depth
- Datos en superficies solidas siempre.
- Glass y blur solo decorativo (navbar/fondo ambiental).
- Modales siempre solidos.
- Estrategia de profundidad: **borde + sombra sutil**, sin sombras dramaticas.

## Typography
- Jerarquia obligatoria: titulo, subtitulo, label, meta y dato destacado.
- Numeros de moneda y cantidades con formato y alineacion consistente.

## Spacing
- Base de 4px.
- Escala permitida: 4, 8, 12, 16, 20, 24, 32.
- Evitar valores arbitrarios fuera de escala.

## Component Rules
- Cards: solidas, borde suave, radio consistente.
- Tablas: densidad media, hover sutil, scroll horizontal en mobile.
- Formularios: errores inline + estados de loading/disabled coherentes.
- Toasts: mensajes cortos y accionables.

## Motion Rules
- Solo usar Framer Motion en:
  - transicion de pagina (0.2s).
  - modal (0.15s).
  - toast (0.2s).
- No animar tablas ni listas largas.

## Inventory and Sales Domain Rules
- Stock levels:
  - high >= 10
  - medium 5-9
  - critical < 5
- En ventas, confirmar debe bloquearse con stock insuficiente.

## Background Images Policy
- Prohibidas en tablas, formularios y modales.
- Permitidas solo en capas decorativas de bajo contraste.

## Anti-Generic Guardrails
- Cada vista debe expresar el dominio (operacion retail), no plantilla neutra.
- Todo color y bloque debe tener proposito funcional.
- Si una decision no tiene un "por que", no entra.

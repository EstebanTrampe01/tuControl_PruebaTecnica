### Sidebar
- Fondo: #FFFFFF con border-right sutil
- Logo + nombre app en la parte superior con subtítulo pequeño
- Sección label en mayúsculas, tracking amplio, texto muted
- Items de navegación: ícono + label, padding generoso
- Item activo: fondo redondeado suave, texto más oscuro, sin
  colores fuertes — solo el contraste del fondo
- Sin gradientes en el sidebar

### Header del content area
- Fondo oscuro: #0F172A o navy profundo
- Blur decorativo de fondo (imagen o patrón difuminado)
- Título de sección grande y bold a la izquierda
- Breadcrumb o categoría encima del título en mayúsculas
  con color acento
- Info del operador / usuario a la derecha
- Altura generosa: ~80px mínimo

---

## Colores

### Base
background-page:    #F0F7FF   ← fondo general azul helado
background-sidebar: #FFFFFF
background-header:  #0F172A   ← navy oscuro para headers de sección
background-card:    #FFFFFF   ← siempre sólido para datos

### Primary (azul)
primary-50:  #EFF6FF
primary-100: #DBEAFE
primary-200: #BFDBFE
primary-400: #60A5FA
primary-500: #3B82F6
primary-600: #2563EB   ← acciones principales
primary-700: #1D4ED8   ← hover

### Acento dorado (para highlights, badges especiales, CTAs)
accent-400: #FBBF24
accent-500: #F59E0B   ← botón CTA principal estilo "Nuevo Cliente"
accent-600: #D97706   ← hover del CTA

### Texto
text-heading:    #0F172A   ← títulos grandes, bold
text-primary:    #1E293B   ← cuerpo principal
text-secondary:  #64748B   ← labels, subtítulos
text-muted:      #94A3B8   ← hints, placeholders
text-on-dark:    #F1F5F9   ← texto sobre fondos oscuros

### Semánticos
success:  #16A34A   ← activo, stock alto, confirmado
warning:  #D97706   ← advertencia, stock medio
danger:   #DC2626   ← error, stock crítico, bloqueado
info:     #2563EB   ← informativo

### Bordes
border-default: #E2E8F0
border-soft:    #F1F5F9
border-dark:    #334155   ← en superficies oscuras

---

## Tipografía

### Jerarquía
- Categoría / breadcrumb: 11px uppercase tracking-widest
  font-weight 600, color acento (primary o dorado)
- Título de página: 28-32px font-weight 700, text-heading
- Subtítulo / descripción: 14px text-secondary, font-weight 400
- Label de sección: 11px uppercase tracking-wider text-muted
- Body: 14px text-primary font-weight 400
- Dato numérico destacado: 28-36px font-weight 700 text-heading
- Tabla header: 11px uppercase tracking-wider text-muted
- Tabla body: 13-14px text-primary

### Fuente
font-family: Inter, system-ui, sans-serif

---

## Cards

### Card de resumen (KPI)
- Fondo blanco sólido
- Border: 1px border-default
- Border-radius: 12px
- Padding: 24px
- Label pequeño arriba (uppercase, muted)
- Número grande en el centro (bold, heading)
- Descripción corta abajo (muted, small)
- Sin sombra fuerte — sombra muy sutil si acaso
- Opcionalmente un ícono pequeño a la izquierda del número

### Card de contenido (tablas, formularios)
- Fondo blanco sólido
- Border: 1px border-default
- Border-radius: 12px
- Header interno con título + acción (ej: botón "Nuevo")
- Sin sombra o sombra mínima

### Card de alerta / advertencia
- Border-left: 3px con color semántico (danger, warning)
- Fondo muy claro del mismo color (10% opacity)
- Título bold, descripción regular
- Badge con número de alertas en esquina superior derecha

---

## Botones

### CTA principal (acción importante como "Nuevo Cliente")
- Fondo: accent-500 (#F59E0B) ← dorado/ámbar
- Texto: blanco, font-weight 600
- Border-radius: 8px
- Padding: 10px 20px
- Hover: accent-600

### Botón primary estándar
- Fondo: primary-600
- Texto: blanco
- Border-radius: 8px
- Hover: primary-700

### Botón secundario
- Fondo: transparente
- Border: 1px border-default
- Texto: text-primary
- Hover: background-page

### Botón destructivo (Desactivar, Eliminar)
- Fondo: transparente
- Border: 1px danger
- Texto: danger
- Hover: fondo danger muy claro

### Botón de acción inline en tabla (Editar, Certificar)
- Pequeño, padding reducido
- Estilo outlined o filled según importancia

---

## Tablas

### Header de tabla
- Fondo: #0F172A (navy) o primary-800
- Texto: blanco o text-on-dark
- Uppercase, tracking wider, 11-12px
- Sin border-radius en el header, solo en el contenedor

### Filas
- Altura: ~52px
- Separador: border-bottom border-soft
- Hover: background muy sutil (primary-50)
- Alternado opcional pero no obligatorio

### Celdas
- Texto: 13-14px text-primary
- Alineación: texto a la izquierda, números a la derecha
- Badges de estado inline dentro de las celdas

---

## Badges y estados

### Formato
- Border-radius: 999px (pill)
- Padding: 2px 10px
- Font-size: 11-12px, font-weight 500
- Uppercase o capitalize

### Variantes
- Activo / Success:   bg-green-100  text-green-700
- Advertencia:        bg-yellow-100 text-yellow-700
- Error / Crítico:    bg-red-100    text-red-700
- Info / Vigente:     bg-blue-100   text-blue-700
- Neutral / Expirado: bg-gray-100   text-gray-600
- Rol / Categoría:    bg-primary-100 text-primary-700

---

## Navegación sidebar — items

### Estado normal
- Ícono: 18px, color text-muted
- Label: 14px, text-secondary, font-weight 400
- Padding: 10px 16px
- Border-radius: 8px

### Estado activo
- Fondo: #F1F5F9 o primary-50
- Ícono: primary-600
- Label: text-primary, font-weight 500
- Sin border ni underline

### Badge de notificación
- Círculo rojo con número, 18px, esquina derecha del item
- Solo cuando hay alertas reales

---

## Glassmorphism — reglas estrictas

Usar SOLO en:
- Fondo decorativo del header de sección (imagen blur detrás
  del título de página)
- Navbar superior si existe

NUNCA en:
- Cards con datos
- Tablas
- Modales
- Formularios

Implementación correcta del blur decorativo en header:
  background-image: url(...) con filter blur + overlay oscuro
  El texto siempre sobre el overlay, nunca directamente sobre blur

---

## Formularios y modales

### Inputs
- Altura: 40px
- Border: 1px border-default
- Border-radius: 8px
- Focus: border primary-500, ring primary-100
- Placeholder: text-muted
- Label encima: 12px, font-weight 500, text-primary

### Modal
- Fondo overlay: rgba(0,0,0,0.4)
- Card modal: bg-white, border-radius 16px, padding 32px
- Título: 20px bold
- Siempre sólido, nunca blur
- Ancho: 480-560px para formularios estándar

---

## Indicadores de progreso (pasos)

### Step indicator (como Proceso de Carga)
- Círculo con ícono o número
- Línea conectora entre pasos
- Completado: fondo success, ícono check
- Activo: fondo primary, número
- Pendiente: fondo muted, número

---

## Modo oscuro

background:      #0C1A2E
sidebar:         #0F2035
card:            #162032   ← sólido siempre
header-section:  #051020
border:          #1E3A5F
text-heading:    #F1F5F9
text-primary:    #CBD5E1
text-muted:      #7FA8CC
input-bg:        #1E293B

---

## Tailwind — clases de referencia rápida

Layout:
  Sidebar: w-[260px] h-screen fixed left-0 top-0 bg-white
           border-r border-slate-200 flex flex-col
  Content: ml-[260px] min-h-screen bg-[#F0F7FF]

Header de sección:
  relative bg-[#0F172A] px-8 py-6 overflow-hidden
  [&::before]:absolute [&::before]:inset-0
  [&::before]:bg-cover [&::before]:blur-sm [&::before]:opacity-20

Card KPI:
  bg-white rounded-xl border border-slate-200 p-6

Tabla header:
  bg-[#0F172A] text-white text-[11px] uppercase tracking-wider

Nav item activo:
  bg-slate-100 text-slate-900 font-medium rounded-lg

Botón CTA dorado:
  bg-amber-500 hover:bg-amber-600 text-white
  font-semibold px-5 py-2.5 rounded-lg transition-colors

Badge success:
  bg-green-100 text-green-700 text-xs font-medium
  px-2.5 py-0.5 rounded-full

Badge danger:
  bg-red-100 text-red-700 text-xs font-medium
  px-2.5 py-0.5 rounded-full
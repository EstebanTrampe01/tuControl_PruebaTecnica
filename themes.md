# Tema visual — NovaTech Store

## Filosofía
Glassmorphism accesible. El blur y la transparencia se usan solo en
capas decorativas (navbar, fondos). Todo el contenido importante
(tablas, formularios, modales) siempre sobre superficie sólida.

Regla de oro:
- ¿Hay texto o datos encima? → superficie sólida obligatorio
- ¿Es decorativo? → glass + blur está bien

---

## Paleta de colores

### Primary (azul)
primary-50:  #EFF6FF
primary-100: #DBEAFE
primary-200: #BFDBFE
primary-400: #60A5FA
primary-500: #3B82F6
primary-600: #2563EB  ← botón primary
primary-700: #1D4ED8  ← botón hover

### Superficies
surface-page:  #F0F7FF              ← fondo general, azul helado
surface-card:  #FFFFFF              ← cards con datos, siempre sólido
surface-glass: rgba(255,255,255,0.6) ← solo decorativo, nunca bajo texto

### Semánticos
success: #16A34A  ← stock alto, operación exitosa
warning: #D97706  ← stock medio
danger:  #DC2626  ← stock crítico, error

### Texto
text-primary:   #0F172A
text-secondary: #64748B

### Bordes
border-soft:  #DBEAFE  ← separadores normales
border-glass: rgba(191, 219, 254, 0.5) ← bordes en elementos glass

---

## Modo oscuro

background:   #0C1A2E
navbar-glass: rgba(12, 26, 46, 0.7)
surface-card: #162032   ← sólido siempre
border:       #1E3A5F
text:         #E2F0FF
text-muted:   #7FA8CC

---

## Uso por componente

| Componente         | Modo claro                        | Modo oscuro                        |
|--------------------|-----------------------------------|------------------------------------|
| Body / fondo       | bg #F0F7FF                        | bg #0C1A2E                         |
| Navbar             | bg white/60 + backdrop-blur-md    | bg #0C1A2E/70 + backdrop-blur-md   |
| Cards con datos    | bg white, border primary-100      | bg #162032, border #1E3A5F         |
| Modales            | bg white sólido                   | bg #162032 sólido                  |
| Botón primary      | bg primary-600, hover primary-700 | igual                              |
| Badges / pills     | bg primary-100, text primary-700  | bg #1E3A5F, text #7FA8CC           |
| Stock alto         | text/bg success #16A34A           | igual                              |
| Stock medio        | text/bg warning #D97706           | igual                              |
| Stock crítico      | text/bg danger  #DC2626           | igual                              |

---

## Tailwind config

colors: {
  primary: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  surface: {
    page:  '#F0F7FF',
    card:  '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.6)',
  },
  success: '#16A34A',
  warning: '#D97706',
  danger:  '#DC2626',
}

darkMode: 'class'

---

## Clases Tailwind de referencia rápida

Navbar:
  bg-white/60 dark:bg-[#0C1A2E]/70
  backdrop-blur-md
  border-b border-primary-200/50 dark:border-[#1E3A5F]
  sticky top-0 z-50

Card con datos:
  bg-white dark:bg-[#162032]
  border border-primary-100 dark:border-[#1E3A5F]
  rounded-2xl shadow-sm shadow-primary-100

Botón primary:
  bg-primary-600 hover:bg-primary-700
  text-white rounded-lg px-4 py-2
  transition-colors duration-200

Badge stock alto:
  bg-green-100 text-green-700
  dark:bg-green-900/30 dark:text-green-400

Badge stock medio:
  bg-yellow-100 text-yellow-700
  dark:bg-yellow-900/30 dark:text-yellow-400

Badge stock crítico:
  bg-red-100 text-red-700
  dark:bg-red-900/30 dark:text-red-400
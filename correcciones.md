Listo, ya dejé la integración aterrizada para que shadcn no te vuelva a desordenar rutas y para que el tema quede consistente con themes.md.
Qué cambié
- Ajusté alias global para que @ apunte a src en frontend/tsconfig.json:22; con esto, @/components/ui ahora resuelve a frontend/src/components/ui.
- Moví el botón de shadcn a frontend/src/components/ui/button.tsx y eliminé el duplicado raíz frontend/components/ui/button.tsx.
- Convertí tu atom Button en wrapper de shadcn (frontend/src/components/atoms/Button.tsx:1) para mantener Atomic Design sin duplicar estilos base.
- Unifiqué imports de utilidades a @/lib/utils en atoms/organisms (frontend/src/components/atoms/Input.tsx:2, frontend/src/components/atoms/Badge.tsx:2, frontend/src/components/atoms/Spinner.tsx:2, frontend/src/components/organisms/Navbar.tsx:8).
- Eliminé la duplicidad de cn() borrando frontend/lib/utils.ts y dejando la fuente de verdad en frontend/src/lib/utils.ts:17.
- Sincronicé tokens semánticos shadcn con tu paleta Nova (claro/oscuro) en frontend/src/app/globals.css:88 para que --primary, --background, --card, etc. respeten themes.md.
- Limpié tipografía global para usar una sola base (Geist) en frontend/src/app/layout.tsx:3.
- Reemplacé la home template de Next por una base visual coherente con tu sistema en frontend/src/app/page.tsx:1.
- Ajusté Navbar para usar tokens semánticos y quitar hex sueltos en clases de componentes (frontend/src/components/organisms/Navbar.tsx:34).
Por qué ya no se rompe con shadcn add
- Antes @/* iba a raíz; ahora va a src.  
- Como components.json ya tiene ui: "@/components/ui", cualquier pnpm dlx shadcn@latest add ... cae en frontend/src/components/ui (correcto), no en la carpeta vieja raíz.
Validación
- Corrí pnpm lint y quedó OK.
- Corrí pnpm build y compiló OK.
- Solo quedó un warning de Next sobre root de workspace/lockfiles (no rompe build), relacionado a configuración de monorepo.
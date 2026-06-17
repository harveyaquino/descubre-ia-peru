# CLAUDE.md - Documentación del Proyecto

## Descripción General

Plataforma de lead generation para taller de IA dirigido a empresas peruanas. La web replica la estructura de descubre.ia-aldia.com con estilo local y captura de datos via Supabase.

## Stack Tecnológico

- **Frontend**: Next.js 14 + React 18 (CSS-in-JS con styled-jsx)
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel (git push → deploy automático)
- **Versionado**: GitHub

## Requisitos de Configuración

### Antes de que el proyecto funcione:

1. **Supabase Setup**:
   - Crear proyecto en supabase.com
   - Ejecutar SQL schema (ver README.md)
   - Obtener URL y anon key

2. **Variables de entorno** (.env.local):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **GitHub**:
   - Crear repo vacío en tu cuenta
   - Push código: `git push -u origin main`

4. **Vercel**:
   - Conectar repo de GitHub
   - Añadir env vars
   - Deploy automático en cada push

## Estructura de Componentes

### Header.jsx
- Logo + navegación sticky
- Links a #inicio, #proceso, #registro

### Hero.jsx
- Propuesta de valor principal
- CTA "Comienza ahora" que scrollea a formulario
- Colores: rojo peruano (#d4145a) + oro (#f7b801)

### Process.jsx
- 3 pasos: Perfil → Análisis → Plan
- Grid responsive, cards con hover effect

### SignupForm.jsx
- Campos: nombre, email, teléfono, empresa, industria, desafío
- Valida e inserta directamente en Supabase tabla `leads`
- Manejo de errores y mensajes de éxito

### Footer.jsx
- Links de navegación
- Contacto
- Créditos a tech stack

## Personalización Frecuente

- **Textos**: Editar directamente en componentes (sin archivo de configs separado)
- **Colores**: `:root` en styles/globals.css
- **Formulario**: Cambiar campos en SignupForm.jsx
- **Proceso**: Actualizar array `steps` en Process.jsx

## Despliegue

```bash
# Dev
npm run dev

# Build
npm run build
npm start

# Desplegar (GitHub → Vercel automático)
git push origin main
```

## Datos de Leads

- Tabla: `leads` en Supabase
- Exportar: Dashboard > Table Editor > Export
- Campos: id, name, email, company, industry, challenge, phone, created_at

## Notas

- Minimalista a propósito (sin imágenes pesadas)
- Responsive mobile-first
- Sin librerías CSS (styled-jsx nativo de Next.js)
- Colores pensados para identidad peruana

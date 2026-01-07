# Guía de Despliegue en Vercel 🚀

Sigue estos pasos para poner tu aplicación **MenuPe** en línea gratis usando Vercel.

## 1. Preparación del Proyecto
Asegúrate de que tienes todo listo:
- El archivo `vercel.json` ya ha sido creado en tu proyecto.
- `package.json` tiene el script de build correcto (ya verificado).

## 2. Variables de Entorno (IMPORTANTE)
Necesitarás tus credenciales de Supabase. Tenlas a la mano:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Puedes encontrarlas en tu archivo `.env.local` actual.

## 3. Despliegue
Tienes dos opciones para desplegar:

### Opción A: Usando GitHub (Recomendado)
Es la forma más fácil y automática.

1.  Sube tu carpeta de proyecto a un repositorio en **GitHub**.
2.  Ve a [Vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub).
3.  Haz clic en **"Add New..."** -> **"Project"**.
4.  Selecciona tu repositorio de la lista e importa.
5.  **Configuración del Proyecto**:
    - **Framework Preset**: Debería detectar `Vite` automáticamente. Si no, selecciónalo.
    - **Root Directory**: `./` (déjalo como está).
6.  **Environment Variables** (Aquí es donde ocurre la magia):
    - Haz clic en desplegar la sección "Environment Variables".
    - Agrega los nombres y valores tal cual están en tu `.env.local`:
      - NAME: `VITE_SUPABASE_URL` | VALUE: `tu_url_de_supabase`
      - NAME: `VITE_SUPABASE_ANON_KEY` | VALUE: `tu_key_anonima`
7.  Haz clic en **"Deploy"**.

### Opción B: Usando Vercel CLI (Desde tu computadora)
Si prefieres hacerlo por consola.
1.  Instala Vercel CLI: `npm i -g vercel`
2.  En la terminal, dentro de la carpeta del proyecto, ejecuta: `vercel`
3.  Sigue las instrucciones en pantalla (Login, confirmar proyecto, etc).
4.  Cuando te pregunte por configuración, acepta los defaults (Vite, ./dist, etc).
5.  Cuando termine, ve al panel de Vercel en la web para agregar las **Variables de Entorno** (paso 6 de arriba) y redepliega.

## 4. Verificar
Una vez desplegado:
1.  Vercel te dará una URL (ej: `menupe.vercel.app`).
2.  Entra y **prueba iniciar sesión** como Super Admin.
3.  Si ves un error de conexión, revisa que las variables de entorno estén bien copiadas en el panel de Vercel y que hayas hecho un redeploy después de agregarlas.

¡Listo! Tu aplicación estará visible para todo el mundo. 🌍

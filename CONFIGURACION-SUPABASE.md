# 🚀 Configuración de Supabase para MenuPe

Este proyecto ahora usa **Supabase** como base de datos principal. Sigue estos pasos para configurarlo.

## 📋 Paso 1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita (si no tienes una)
3. Crea un nuevo proyecto
4. Espera a que el proyecto esté listo (toma ~2 minutos)

## 🗄️ Paso 2: Configurar la Base de Datos

1. En tu proyecto de Supabase, ve a **SQL Editor** (en el menú lateral)
2. Crea una nueva query
3. Copia **TODO** el contenido del archivo `supabase-setup.sql`
4. Pégalo en el editor
5. Haz clic en **"Run"** o presiona `Ctrl/Cmd + Enter`
6. Deberías ver un mensaje de éxito ✅

Esto creará:
- ✅ 3 tablas: `restaurants`, `categories`, `products`
- ✅ Políticas RLS (permisos de acceso)
- ✅ Un restaurante de ejemplo: "Pollería El Sabor Peruano"
- ✅ 5 categorías
- ✅ 12 productos de ejemplo

## 🔑 Paso 3: Obtener las Credenciales

1. En Supabase, ve a **Settings** → **API**
2. Busca estas dos variables:
   - **Project URL** (ej: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (una clave larga que empieza con `eyJ...`)

## ⚙️ Paso 4: Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Agrega o actualiza estas líneas:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...(tu-clave-completa)
```

3. **IMPORTANTE**: Reemplaza con TUS valores reales de Supabase

## 🎯 Paso 5: Iniciar la Aplicación

```bash
npm install
npm run dev
```

## ✅ Verificar que Funciona

1. Abre el navegador en `http://localhost:5173` (o el puerto que use tu app)
2. Abre la consola del navegador (F12)
3. Deberías ver:
   ```
   🔍 Verificando conexión a Supabase:
   Supabase URL: ✅ Configurado
   Supabase Key: ✅ Configurado
   ✅ Cliente Supabase inicializado correctamente
   ```

4. Prueba acceder al menú de ejemplo: `/#/menu/sabor`
5. Deberías ver el menú de "Pollería El Sabor Peruano" con todos los productos

## 🔐 Credenciales de Ejemplo

Para el panel de administración, puedes usar:
- **Usuario**: `sabor`
- **Contraseña**: `demo123`

## 🎨 Crear tu Propio Restaurante

1. Ve a `/#/super-admin`
2. Inicia sesión como super admin
3. Crea tu propio restaurante con tu información
4. Personaliza categorías y productos

## ⚠️ Notas Importantes

- **Seguridad**: Las políticas RLS actuales son permisivas (permiten todo). En producción, deberías implementar autenticación adecuada.
- **Gratis**: El plan gratuito de Supabase incluye:
  - 500 MB de base de datos
  - 1 GB de almacenamiento de archivos
  - 2 GB de transferencia mensual
  - Perfecto para proyectos pequeños/medianos

## 🆘 Problemas Comunes

### "Error: Supabase no conectado"
- Verifica que las variables de entorno en `.env.local` estén correctas
- Reinicia el servidor de desarrollo (`npm run dev`)

### "Error al crear restaurante: new row violates row-level security"
- Ejecuta el archivo `supabase-setup.sql` nuevamente
- Las políticas RLS deben estar configuradas correctamente

### La app no carga datos
- Abre la consola del navegador (F12) y busca errores
- Verifica que Supabase esté funcionando en [https://status.supabase.com](https://status.supabase.com)

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**¿Todo listo?** 🎉 Ahora tu MenuPe está completamente funcional con Supabase!

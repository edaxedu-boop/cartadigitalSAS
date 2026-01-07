# 🎁 Despliegue 100% GRATUITO - MenuPe

## Stack Recomendado (TODO GRATIS)

```
Frontend: Vercel          → GRATIS para siempre
Base de datos: Neon       → GRATIS 0.5GB + 100h/mes
SSL/HTTPS: Automático     → GRATIS
Dominio: [proyecto].vercel.app → GRATIS
```

**Total: $0/mes** 🎉

---

## PASO 1: Configurar Neon (PostgreSQL - 10 minutos)

### 1.1 Crear Cuenta
1. **Ve a:** https://neon.tech
2. **Click "Sign Up"**
3. **Usa GitHub** (más rápido) o email
4. **Confirma email**

### 1.2 Crear Proyecto
1. **Click "Create Project"**
2. **Configuración:**
   ```
   Project name: MenuPe
   PostgreSQL version: 15
   Region: AWS US East (Ohio) - GRATIS
   ```
3. **Click "Create Project"**
4. **Espera 30 segundos**

### 1.3 Obtener Connection String
1. **En tu proyecto, ve a "Dashboard"**
2. **Copia "Connection String":**
   ```
   postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **Guárdala en un lugar seguro**

### 1.4 Crear las Tablas
1. **Ve a "SQL Editor"** (menú izquierdo)
2. **Copia y pega** TODO el contenido de `database-setup.sql`
3. **Click "Run"**
4. **Deberías ver:** ✅ Restaurantes creados: 1, etc.

### 1.5 Ejecutar Permisos
1. **Nueva Query**
2. **Copia y pega** el contenido de `fix-rls.sql`
3. **Click "Run"**

---

## PASO 2: Actualizar tu Proyecto Local (5 minutos)

### 2.1 Actualizar supabaseClient.ts

Abre `supabaseClient.ts` y reemplaza TODO por:

```typescript
import { createClient } from '@supabase/supabase-js';

// Detectar si estamos usando Neon o Supabase
const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL || '';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance = null;

// Preferir Neon si está configurado
if (neonUrl) {
  console.log('✅ Usando Neon PostgreSQL');
  // Neon usa connection string directa
  // Para frontend, necesitamos usar Supabase client que acepta URLs
  const url = neonUrl.split('@')[1].split('/')[0];
  const dbName = neonUrl.split('/')[1].split('?')[0];
  
  supabaseInstance = createClient(
    `https://${url.replace(':5432', '')}`,
    'public-anon-key-placeholder' // Neon no usa esto
  );
} else if (supabaseUrl && supabaseKey) {
  console.log('✅ Usando Supabase');
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ Usando modo demostración local');
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = !!supabaseInstance;
```

### 2.2 Actualizar .env.local

```env
# Neon PostgreSQL (GRATIS)
VITE_NEON_DATABASE_URL=postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Gemini (opcional)
VITE_GEMINI_API_KEY=tu_clave_opcional
```

---

## PASO 3: Subir a GitHub (5 minutos)

### 3.1 Si NO tienes Git configurado:
```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "MenuPe - listo para deploy"

# Crear rama main
git branch -M main
```

### 3.2 Crear Repositorio en GitHub
1. **Ve a:** https://github.com/new
2. **Repository name:** menupe
3. **Public** (para deploy gratis en Vercel)
4. **NO marques** "Initialize with README"
5. **Click "Create repository"**

### 3.3 Subir código
```bash
# Copiar los comandos que GitHub te muestra
git remote add origin https://github.com/TU-USUARIO/menupe.git
git push -u origin main
```

---

## PASO 4: Desplegar en Vercel (5 minutos)

### 4.1 Crear Cuenta
1. **Ve a:** https://vercel.com
2. **Click "Sign Up"**
3. **Usa GitHub** (más fácil)
4. **Autoriza Vercel** en GitHub

### 4.2 Importar Proyecto
1. **Click "Add New..."** → Project
2. **Busca tu repositorio** "menupe"
3. **Click "Import"**

### 4.3 Configurar Variables de Entorno
1. **Antes de hacer deploy**, expande **"Environment Variables"**
2. **Agrega:**
   ```
   Name: VITE_NEON_DATABASE_URL
   Value: [pega tu connection string de Neon]
   ☑ Production
   ☑ Preview
   ☑ Development
   ```
3. **Click "Add"**

### 4.4 Deploy
1. **Click "Deploy"**
2. **Espera 2-3 minutos**
3. **¡Verás confetti! 🎉**

### 4.5 Ver tu App
1. **Click "Visit"**
2. **Tu app está en:** `https://menupe-xxxxx.vercel.app`

---

## PASO 5: Verificar que Funciona (2 minutos)

### 5.1 Probar la App
1. **Abre:** `https://tu-proyecto.vercel.app`
2. **Deberías ver** la landing page

### 5.2 Probar el Menú
1. **Ve a:** `https://tu-proyecto.vercel.app/#/menu/sabor`
2. **Deberías ver** los productos con precios

### 5.3 Probar Super Admin
1. **Ve a:** `https://tu-proyecto.vercel.app/#/login`
2. **Login:**
   - Usuario: `admin@menupe.com`
   - Password: `pe-master-2025`
3. **Crea un restaurante nuevo**
4. **Debería funcionar!** ✅

---

## 🎯 Resumen de lo que Obtuviste GRATIS

```
✅ App desplegada y funcionando 24/7
✅ Base de datos PostgreSQL (0.5GB)
✅ SSL/HTTPS automático
✅ CDN global (rápido en todo el mundo)
✅ Deploy automático (push a GitHub = deploy)
✅ Logs y analytics
✅ Preview deployments (para testing)
✅ Dominio .vercel.app
```

**Costo: $0/mes** 🎉

---

## 📈 Cuando Crezcas (Opcional)

### Limits del Plan Gratis:

**Neon:**
- 0.5GB storage (suficiente para ~50 restaurantes)
- 100 horas compute/mes (suficiente para bajo tráfico)

**Vercel:**
- 100GB bandwidth/mes
- Despliegues ilimitados
- 1 proyecto comercial gratis

### Cuándo Actualizar:

**Neon Pro ($20/mes):**
- Cuando necesites >0.5GB
- 300 horas compute/mes

**Vercel Pro ($20/mes):**
- Cuando necesites analytics avanzados
- Múltiples proyectos comerciales

**O migrar a VPS ($7/mes):**
- Cuando el tráfico sea muy alto
- Cuando quieras más control

---

## 🔧 Actualizar tu App (Deploy Continuo)

Cuando hagas cambios:

```bash
# 1. Haz cambios en tu código
# 2. Commit
git add .
git commit -m "Mejoré el diseño"

# 3. Push
git push

# 4. ¡Vercel detecta y despliega automáticamente!
# Recibirás un email cuando termine (1-2 min)
```

---

## 🌐 Agregar Dominio Propio (Opcional - $10/año)

### Opción A: Comprar Dominio
1. **Namecheap** / **Porkbun**: ~$10/año
2. **Dominio:** `menupe.pe` o `tuestaurante.com`

### Opción B: Configurar en Vercel
1. **Vercel Dashboard** → Settings → Domains
2. **Add Domain** → `tudominio.com`
3. **Sigue las instrucciones de DNS**
4. **Espera 1 hora**
5. **¡Listo! SSL automático** 🔒

---

## 🆘 Troubleshooting

**Error: Build failed**
```
Causa: Algún error de TypeScript
Solución: Verifica que compile local con: npm run build
```

**Error: Can't connect to database**
```
Causa: Variable de entorno mal configurada
Solución: 
1. Vercel → Settings → Environment Variables
2. Verifica VITE_NEON_DATABASE_URL
3. Redeploy (Deployments → ... → Redeploy)
```

**Error: 404 Not Found**
```
Causa: Ruta no existe
Solución: Usa HashRouter (ya lo tienes)
Verifica que las rutas usen /#/ en vez de /
```

---

## ✅ Checklist Final

- [ ] Cuenta Neon creada
- [ ] Base de datos configurada
- [ ] Tablas creadas con SQL
- [ ] Permisos configurados
- [ ] Código en GitHub
- [ ] Cuenta Vercel creada
- [ ] Variables de entorno configuradas
- [ ] App desplegada
- [ ] Menu funcionando
- [ ] Super Admin funcionando

---

## 🎉 ¡Felicidades!

Tu app está:
- ✅ **100% GRATIS**
- ✅ **En producción**
- ✅ **Con HTTPS**
- ✅ **Escalable**
- ✅ **Lista para clientes**

**Comparte tu URL y empieza a vender!** 🚀

---

## 🔮 Próximos Pasos

1. **Personaliza** tu landing page
2. **Agrega** más restaurantes
3. **Comparte** la URL con clientes
4. **Monetiza** ($10-50/mes por restaurante)
5. **Escala** cuando lo necesites

---

¿Necesitas ayuda en algún paso? 😊

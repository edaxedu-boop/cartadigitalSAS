# ⚡ Guía Rápida de Despliegue

## 📋 Checklist Previo

Antes de desplegar, asegúrate de tener:
- [ ] Cuenta en [Supabase](https://supabase.com) (gratis)
- [ ] Cuenta en [Vercel](https://vercel.com) (gratis)
- [ ] Cuenta en [GitHub](https://github.com) (gratis)
- [ ] [Git](https://git-scm.com) instalado en tu PC

---

## 🚀 Pasos Rápidos (30 minutos)

### 1️⃣ Configurar Supabase (10 min)

```bash
# 1. Ve a https://supabase.com y crea una cuenta
# 2. Crea un nuevo proyecto (guarda la contraseña)
# 3. Espera 2-3 minutos a que esté listo
# 4. Ve a SQL Editor y ejecuta el archivo database-setup.sql
# 5. Ve a Settings → API y copia:
#    - Project URL
#    - anon public key
```

### 2️⃣ Configurar Local (5 min)

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales de Supabase
# (usa cualquier editor de texto)

# Prueba que funcione
npm run dev
# Abre: http://localhost:3000/#/menu/sabor
```

### 3️⃣ Subir a GitHub (5 min)

```bash
# Inicializa git si no lo has hecho
git init
git add .
git commit -m "🎉 MenuPe listo para producción"

# Crea un repositorio en GitHub (https://github.com/new)
# Llámalo: menupe-app

# Conecta y sube
git branch -M main
git remote add origin https://github.com/TU-USUARIO/menupe-app.git
git push -u origin main
```

### 4️⃣ Desplegar en Vercel (10 min)

```bash
# Ve a https://vercel.com
# 1. Inicia sesión con GitHub
# 2. Click "Add New Project"
# 3. Importa tu repositorio "menupe-app"
# 4. ANTES de hacer deploy, configura las variables:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
# 5. Click "Deploy"
# 6. Espera 2 minutos
# 7. ¡Listo! 🎉
```

---

## 🌐 URLs Resultantes

Después de desplegar tendrás:

- **Tu app en producción**: `https://tu-proyecto.vercel.app`
- **Menú público**: `https://tu-proyecto.vercel.app/#/menu/sabor`
- **Login admin**: `https://tu-proyecto.vercel.app/#/login`
- **Dashboard Vercel**: `https://vercel.com/dashboard`
- **Dashboard Supabase**: `https://app.supabase.com`

---

## ✅ Verificación Post-Despliegue

1. [ ] La app carga sin errores
2. [ ] El menú `/menu/sabor` muestra productos
3. [ ] Puedes agregar productos al carrito
4. [ ] El botón de WhatsApp funciona
5. [ ] Las imágenes se ven correctamente

---

## 🐛 Problemas Comunes

**❌ "No se muestran productos"**
```bash
# Solución: Verifica que ejecutaste database-setup.sql en Supabase
# Ve a SQL Editor y ejecútalo de nuevo
```

**❌ "CORS error" o "Failed to fetch"**
```bash
# Solución: Verifica las variables de entorno en Vercel
# Settings → Environment Variables
# Redeploy después de agregar las variables
```

**❌ "Build failed en Vercel"**
```bash
# Solución: Prueba el build local primero
npm run build
# Si hay errores, corrígelos y vuelve a subir a GitHub
```

---

## 📞 Soporte

Si tienes problemas, revisa:
1. **Logs de Vercel**: Deployments → (tu deployment) → View Function Logs
2. **Consola del navegador**: F12 → Console
3. **Documentación completa**: Lee `DEPLOY.md`

---

## 🎯 Próximos Pasos

Una vez desplegado:

1. **Personaliza tu restaurante**:
   - Edita los datos directamente en Supabase
   - Ve a Table Editor y modifica `restaurants`, `categories`, `products`

2. **Agrega más restaurantes**:
   - Crea nuevas filas en la tabla `restaurants`
   - Cada restaurante tendrá su propio slug

3. **Configura dominio propio** (opcional):
   - Vercel → Settings → Domains
   - Agrega tu dominio y configura DNS

4. **Monetiza** 💰:
   - Cobra a restaurantes por usar tu plataforma
   - Ofrece planes premium con más funcionalidades

---

¿Listo para desplegar? 🚀 **¡Vamos!**

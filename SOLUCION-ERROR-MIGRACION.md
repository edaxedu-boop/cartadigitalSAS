# 🔧 Solución: Migrar Base de Datos Existente

## ❌ El Problema

Obtuviste este error:
```
ERROR: 42703: column "user_id" does not exist
```

**Razón**: Tu base de datos ya tiene las tablas creadas (`restaurants`, `categories`, `products`) pero **sin** la columna `user_id` necesaria para autenticación.

---

## ✅ La Solución

Usar el script de **migración** en lugar del script de setup completo.

---

## 🚀 Pasos a Seguir

### **Paso 1: Ejecutar Script de Migración**

1. Ve a tu proyecto en Supabase
2. Abre **SQL Editor**
3. **BORRA** todo el contenido actual
4. **Copia y pega** TODO el contenido del archivo: **`migracion-auth-supabase.sql`**
5. Haz clic en **Run** (o `Ctrl/Cmd + Enter`)

✅ **Deberías ver**:
```
✅ Columna user_id agregada a restaurants
✅ MIGRACIÓN COMPLETADA EXITOSAMENTE
```

---

### **Paso 2: Crear Usuarios en Supabase**

1. Ve a **Authentication** → **Users**
2. Haz clic en **"Add user"** → **"Create new user"**

#### Usuario 1: Super Admin
```
Email:     admin@menupe.com
Password:  TuPasswordSeguro123
✅ Auto Confirm User (activar)
```

#### Usuario 2: Restaurant Admin (Ejemplo)
```
Email:     sabor@restaurant.com
Password:  demo123
✅ Auto Confirm User (activar)
```

3. Haz clic en **"Create user"** para cada uno

---

### **Paso 3: Asignar Roles y Crear Restaurante**

1. Ve a **SQL Editor** (otra vez)
2. Abre el archivo **`crear-usuarios-prueba.sql`**
3. Copia todo su contenido
4. Pégalo en SQL Editor
5. **Run**

✅ **Deberías ver**:
```
✅ Restaurante creado: [UUID]
✅ Usuario sabor@restaurant.com es ahora Restaurant Admin
```

---

### **Paso 4: Verificar Variables de Entorno**

Asegúrate que `.env.local` tenga:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...tu-key-completa
```

**Consigue estos valores en**:
- Supabase Dashboard → Settings → API

---

### **Paso 5: Reiniciar App**

```bash
# Detén el servidor si está corriendo (Ctrl+C)
npm run dev
```

---

### **Paso 6: Probar Login**

1. Ve a: `http://localhost:5173/#/login`

2. **Prueba Super Admin**:
   - Email: `admin@menupe.com`
   - Password: (la que configuraste)
   - Debería redirigir a → `/super-admin`

3. **Prueba Restaurant Admin**:
   - Email: `sabor@restaurant.com`
   - Password: `demo123`
   - Debería redirigir a → `/dashboard`

---

## 📋 Resumen de Archivos

| Archivo | Cuándo Usarlo |
|---------|---------------|
| ~~`supabase-auth-setup.sql`~~ | ❌ NO usar (para BD nueva) |
| **`migracion-auth-supabase.sql`** | ✅ **USAR ESTE** (para BD existente) |
| `crear-usuarios-prueba.sql` | ✅ Después de crear usuarios |

---

## 🔍 Qué Hace la Migración

```
✅ Agrega columna user_id a tabla restaurants
✅ Elimina columnas username y password (ya no se usan)
✅ Crea tabla user_roles
✅ Actualiza políticas RLS para autenticación
✅ Crea índices para mejor performance
```

---

## ⚠️ Importante

- ✅ La migración es **segura** - no borra datos existentes
- ✅ Solo agrega lo necesario para autenticación
- ✅ Tus restaurantes, categorías y productos actuales se mantienen
- ⚠️ Pero necesitarás asociar los restaurantes existentes a usuarios

---

## 🆘 Si Sigues Teniendo Problemas

### Error: "user not found"
→ Crea los usuarios primero en Authentication → Users

### Error: "new row violates row-level security"
→ Ejecuta `migracion-auth-supabase.sql` de nuevo para actualizar políticas

### No redirige después de login
→ Ejecuta `crear-usuarios-prueba.sql` para asignar roles

### Datos no cargan
→ Verifica variables de entorno en `.env.local`
→ Reinicia servidor: `npm run dev`

---

## ✅ Checklist

- [ ] Ejecutar `migracion-auth-supabase.sql`
- [ ] Crear usuario `admin@menupe.com` en Authentication
- [ ] Crear usuario `sabor@restaurant.com` en Authentication  
- [ ] Ejecutar `crear-usuarios-prueba.sql`
- [ ] Verificar `.env.local`
- [ ] Reiniciar servidor
- [ ] Probar login con ambos usuarios

---

🎉 **¡Listo!** Ahora deberías poder hacer login con autenticación de Supabase.

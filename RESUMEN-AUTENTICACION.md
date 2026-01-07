# 📋 Resumen: Sistema de Autenticación MenuPe

## ✅ Lo que se ha configurado:

### 1. 🗄️ Base de Datos (Supabase)
```
✅ Tabla: restaurants (con campo user_id)
✅ Tabla: categories
✅ Tabla: products
✅ Tabla: user_roles (nueva - gestiona roles)
✅ Row Level Security (RLS) configurado
✅ Políticas diferenciadas por rol
```

### 2. 🔐 Sistema de Autenticación
```
✅ Supabase Auth integrado
✅ Login con email/password
✅ Detección automática de roles
✅ Redirección según tipo de usuario
✅ Sesiones persistentes
```

### 3. 👥 Tipos de Usuario

#### Super Admin 🔑
- **Puede**: Crear, editar y eliminar TODOS los restaurantes
- **Acceso**: Panel `/super-admin`
- **Permisos**: Sin restricciones (RLS lo permite todo)

#### Restaurant Admin 🏪
- **Puede**: Gestionar SOLO su restaurante
- **Acceso**: Panel `/dashboard`
- **Permisos**: Limitado a su restaurant_id (RLS lo protege)

### 4. 📁 Archivos Creados/Modificados

#### Nuevos:
```
✅ supabase-auth-setup.sql      → Schema completo con autenticación
✅ crear-usuarios-prueba.sql    → Script rápido para testing
✅ GUIA-AUTENTICACION.md        → Guía paso a paso
✅ hooks/useAuth.ts             → Hook de autenticación (opcional)
✅ vite-env.d.ts                → Tipos TypeScript para variables de entorno
```

#### Modificados:
```
✅ views/Login.tsx              → Migrado a Supabase Auth
✅ App.tsx                      → Removido prop 'state' de Login
✅ supabaseClient.ts            → Simplificado (solo Supabase)
```

---

## 🚀 Pasos para Poner en Marcha

### Paso 1: Configurar Base de Datos
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Abre **SQL Editor** en tu proyecto
3. Ejecuta `supabase-auth-setup.sql` completo

### Paso 2: Crear Usuarios
1. Ve a **Authentication → Users**
2. Crea estos 2 usuarios:

```
Usuario 1 (Super Admin):
  Email: admin@menupe.com
  Password: tu-password-seguro
  ✅ Auto Confirm User

Usuario 2 (Restaurant Admin - Ejemplo):
  Email: sabor@restaurant.com  
  Password: tu-password
  ✅ Auto Confirm User
```

### Paso 3: Asignar Roles
1. En **SQL Editor**, ejecuta `crear-usuarios-prueba.sql`
2. Esto asignará roles y creará el restaurante de ejemplo

### Paso 4: Configurar Variables de Entorno
Edita `.env.local`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...tu-key
```

### Paso 5: Iniciar Aplicación
```bash
npm install
npm run dev
```

### Paso 6: Probar Login
1. Ve a `http://localhost:5173/#/login`
2. Prueba con ambos usuarios
3. Verifica redirecciones correctas

---

## 🎯 Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────┐
│  Usuario ingresa email/password en /login              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase Auth verifica credenciales                   │
└────────────┬────────────────────────────┬───────────────┘
             │                            │
      ❌ Error                      ✅ Éxito
             │                            │
             ▼                            ▼
    ┌─────────────────┐    ┌──────────────────────────────┐
    │ Mostrar error   │    │ Buscar rol en 'user_roles'   │
    └─────────────────┘    └──────────┬───────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
           role = 'super_admin'              role = 'restaurant_admin'
                    │                                   │
                    ▼                                   ▼
         ┌────────────────────┐              ┌──────────────────────┐
         │ login(null, true)  │              │ login(restaurant_id) │
         │ → /super-admin     │              │ → /dashboard         │
         └────────────────────┘              └──────────────────────┘
```

---

## 🔒 Seguridad (Row Level Security)

### Tabla: restaurants
```sql
✅ Lectura pública       → Todos pueden ver
✅ Super Admin          → CRUD completo
✅ Restaurant Admin     → Solo SU restaurante (user_id = auth.uid())
```

### Tabla: categories
```sql
✅ Lectura pública       → Todos pueden ver
✅ Super Admin          → CRUD completo  
✅ Restaurant Admin     → Solo categorías de SU restaurante
```

### Tabla: products
```sql
✅ Lectura pública       → Todos pueden ver
✅ Super Admin          → CRUD completo
✅ Restaurant Admin     → Solo productos de SU restaurante
```

### Tabla: user_roles
```sql
✅ Usuarios autenticados → Solo pueden leer SU propio rol
```

---

## 📝 Credenciales de Prueba

### Super Admin
```
Email:    admin@menupe.com
Password: (la que configuraste)
Panel:    /#/super-admin
Puede:    Gestionar TODOS los restaurantes
```

### Restaurant Admin (Ejemplo)
```
Email:      sabor@restaurant.com
Password:   (la que configuraste)
Panel:      /#/dashboard
Puede:      Solo gestionar "Pollería El Sabor Peruano"
Menú URL:   /#/menu/sabor
```

---

## 🆘 Troubleshooting

### ❌ "Email o contraseña incorrectos"
→ Usuario no existe o password incorrecto
→ Verifica en Authentication → Users

### ❌ "No se pudo determinar tu rol de usuario"
→ Usuario existe pero sin rol en `user_roles`
→ Ejecuta `crear-usuarios-prueba.sql`

### ❌ "Usuario sin permisos asignados"
→ Registro en `user_roles` existe pero rol inválido
→ Verifica: `SELECT * FROM user_roles;`

### ❌ No carga datos después del login
→ Problema con RLS
→ Verifica políticas en Supabase Dashboard → Authentication → Policies

---

## 📚 Archivos de Referencia

| Archivo | Propósito |
|---------|-----------|
| `supabase-auth-setup.sql` | Schema completo con autenticación |
| `crear-usuarios-prueba.sql` | Crear usuarios de prueba rápidamente |
| `GUIA-AUTENTICACION.md` | Guía detallada paso a paso |
| `CONFIGURACION-SUPABASE.md` | Setup inicial de Supabase |
| `.env.local.example` | Template de variables de entorno |

---

## 🎉 Estado Actual

```
✅ Base de datos configurada con autenticación
✅ Roles definidos (super_admin, restaurant_admin)
✅ RLS protegiendo datos
✅ Login con Supabase Auth
✅ Redirecciones automáticas
✅ Scripts SQL listos
✅ Documentación completa
```

---

**¿Siguiente paso?** Sigue la **GUIA-AUTENTICACION.md** para configurar todo paso a paso! 🚀

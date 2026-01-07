# 🎯 Crear Restaurantes desde el Panel de Super Admin

## ✅ ¿Qué se Configuró?

Ahora puedes **crear restaurantes con sus usuarios automáticamente** desde el panel de Super Admin, sin necesidad de ir a Supabase manualmente.

---

## 🚀 Cómo Usar

### **1. Iniciar Sesión como Super Admin**

1. Ve a `http://localhost:5173/#/login`
2. Ingresa:
   - **Email**: `admin@menupe.com` (el que creaste)
   - **Password**: tu contraseña
3. Serás redirigido a `/super-admin`

---

### **2. Crear Nuevo Restaurante**

1. En el panel de Super Admin, haz clic en **"+ Nuevo Restaurante"**

2. Completa el formulario:

```
📝 Nombre Comercial:    Pollería Don Lucho
📧 Email de Acceso:     lucho@restaurant.com
🔒 Contraseña:          lucho123
🔗 Slug URL:            don-lucho
📱 WhatsApp:            51987654321
```

3. Haz clic en **"Crear Acceso"**

---

### **3. ¿Qué Pasa Automáticamente?**

El sistema hace TODO esto por ti:

1. ✅ **Crea el usuario** en Supabase Auth con el email
2. ✅ **Crea el restaurante** en la base de datos
3. ✅ **Asocia** el restaurante al usuario
4. ✅ **Asigna** el rol `restaurant_admin`
5. ✅ **Muestra** las credenciales creadas

---

### **4. El Nuevo Administrador Puede Iniciar Sesión**

1. El administrador del restaurante va a `/login`
2. Ingresa:
   - **Email**: `lucho@restaurant.com`
   - **Password**: `lucho123`
3. Es redirigido automáticamente a `/dashboard`
4. Solo puede ver y editar **su restaurante**

---

## 📋 Datos que se Solicitan

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Nombre Comercial** | Nombre del restaurante | Pollería Don Lucho |
| **Email de Acceso** | Email para login (único) | lucho@restaurant.com |
| **Contraseña** | Password temporal | lucho123 |
| **Slug URL** | URL del menú (opcional) | don-lucho |
| **WhatsApp** | Número de contacto | 51987654321 |

---

## 🔐 Seguridad

- ✅ **Emails únicos**: No puedes usar el mismo email dos veces
- ✅ **Password mínimo**: 6 caracteres requeridos
- ✅ **Aislamiento**: Cada restaurante solo ve sus datos (RLS)
- ✅ **Auto-login**: El usuario se crea con confirmación automática

---

## 💡 Consejos

### Formato de Email
```
✅ Correcto:  admin@restaurant.com
✅ Correcto:  dueno@negocio.pe
❌ Incorrecto: sin-arroba.com
❌ Incorrecto: usuario
```

### Slug URL
```
✅ Recomendado: todo-en-minúsculas-con-guiones
✅ Ejemplo:     polleria-don-lucho
✅ Ejemplo:     cevicheria-el-muelle
```

Si dejas el slug vacío, se genera automáticamente desde el nombre.

### WhatsApp
```
✅ Formato: 51987654321 (código país + número)
✅ Perú:    51
✅ Chile:   56
✅ Colombia: 57
```

---

## 📱 URL del Menú

Después de crear el restaurante, el menú estará disponible en:

```
https://tu-app.com/#/menu/[slug]

Ejemplo: https://tu-app.com/#/menu/don-lucho
```

---

## ⚡ Flujo Completo

```
┌─────────────────────────────────────────────────┐
│  Super Admin crea restaurante desde el panel  │
│  Completa: nombre, email, password, etc.       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Sistema automáticamente:                      │
│  1. Crea usuario en Supabase Auth             │
│  2. Crea restaurante en BD                     │
│  3. Asocia restaurant → user                   │
│  4. Asigna rol 'restaurant_admin'              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  ✅ Listo!                                      │
│  El administrador puede iniciar sesión con:    │
│  - Email: lucho@restaurant.com                 │
│  - Password: lucho123                          │
└─────────────────────────────────────────────────┘
```

---

## 🆘 Mensajes de Error

### "Este email ya está registrado"
→ El email ya se usó para otro restaurante  
→ Usa un email diferente

### "Error: Email y contraseña son requeridos"
→ Completa ambos campos antes de crear

### "Error al crear restaurante"
→ Puede ser un problema de conexión  
→ Verifica que Supabase esté funcionando  
→ Revisa la consola del navegador (F12)

---

## 🎉 Ventajas de Este Sistema

- ✅ **Rápido**: Crear un restaurante toma 30 segundos
- ✅ **Automático**: No necesitas tocar Supabase manualmente
- ✅ **Seguro**: RLS protege los datos automáticamente
- ✅ **Profesional**: Experiencia tipo SaaS
- ✅ **Escalable**: Puedes crear ilimitados restaurantes

---

## 📊 Ver Restaurantes Creados

En el panel de Super Admin verás tarjetas con:

```
┌─────────────────────────────────┐
│  P  Pollería Don Lucho         │
│     ID: res-abc123             │
│                                 │
│  Email:    lucho@restaurant.com│
│  Password: lucho123            │
│  WhatsApp: 51987654321         │
│                                 │
│  [Ver Carta] [Activo]          │
│  [🗑️ Eliminar]                 │
└─────────────────────────────────┘
```

Puedes:
- ✅ Ver las credenciales de acceso
- ✅ Abrir el menú público
- ✅ Eliminar el restaurante (si es necesario)

---

## 🔄 Actualización de Credenciales

Los administradores de restaurante **NO pueden** cambiar su email/password desde el dashboard actual. Para agregar esta funcionalidad, se necesitaría:

1. Un componente de "Mi Perfil"
2. Integración con `supabase.auth.updateUser()`
3. Validación de password actual

Por ahora, el Super Admin puede crear nuevos usuarios según se necesite.

---

**¿Listo para probarlo?** Inicia sesión como Super Admin y crea tu primer restaurante! 🚀

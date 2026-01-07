# 🎨 Panel de Configuración de Restaurante - Guía Completa

## ✨ Funcionalidades Implementadas

He creado un **sistema completo de configuración** para que los administradores de restaurantes puedan personalizar completamente su menú público.

---

## 📋 ¿Qué Puede Configurar el Restaurante?

### 1. **Información Básica** 📝
- Nombre del restaurante
- Descripción del negocio
- Número de WhatsApp
- Dirección completa

### 2. **Color de Marca** 🎨
- Selector de color visual
- El color se aplica automáticamente en:
  - Botones del menú público
  - Categorías activas
  - Iconos de agregar productos
  - Botón de "Ver mi pedido"
  - Botón de "Añadir al pedido"

### 3. **Imágenes** 🖼️
- **Logo**: Imagen cuadrada para el perfil
- **Banner/Portada**: Imagen panorámica para el header
- Vista previa en tiempo real
- Compatible con URLs de servicios de alojamiento de imágenes

### 4. **Redes Sociales** 📱
- Instagram
- Facebook
- TikTok
- Los enlaces se muestran en el menú público con iconos personalizados

### 5. **Horario de Atención** 🕐
- Configuración día por día (Lunes a Domingo)
- Hora de apertura y cierre
- Opción de marcar días cerrados
- Se muestra automáticamente en el menú público

---

## 🚀 Cómo Usar el Panel

### Acceso al Panel de Configuración

1. Inicia sesión como administrador del restaurante
2. Serás redirigido a `/dashboard`
3. Haz clic en la pestaña **"PERFIL"**

### Completar la Información

#### **Paso 1: Información Básica**
```
Nombre del Restaurante: El Padrino
Descripción: La mejor comida italiana de Lima...
WhatsApp: 51987654321
Dirección: Av. Larco 123, Miraflores
```

#### **Paso 2: Seleccionar Color**
- Haz clic en el cuadro de color
- Selecciona tu color de marca
- Vista previa instantánea

#### **Paso 3: Agregar Imágenes**

**Para el Logo:**
1. Sube tu imagen a un servicio como:
   - [Imgur](https://imgur.com)
   - [PostImages](https://postimages.org)
   - [Cloudinary](https://cloudinary.com)
2. Copia la URL directa de la imagen
3. Pégala en el campo "Logo (URL)"

**Para el Banner:**
- Misma proceso que el logo
- Recomendado: Imagen horizontal (1200x400px)

#### **Paso 4: Redes Sociales**
```
Instagram: @elpadrino_oficial
Facebook: El Padrino Restaurant
TikTok: @elpadrino
```

#### **Paso 5: Horarios**
- Marca "Abierto" para cada día activo
- Configura hora de apertura y cierre
- Desmarca "Abierto" para días cerrados

#### **Paso 6: Guardar**
- Haz clic en **"💾 Guardar Cambios"**
- Verás un mensaje de confirmación

---

## 📱 Cómo se Ve en el Menú Público

### Header
- Banner de portada (imagen grande arriba)
- Logo circular centrado sobre el banner
- Nombre del restaurante
- Descripción
- Dirección con icono de ubicación

### Información Adicional
Dos tarjetas debajo de la descripción:

**1. Horario de Atención** 🕐
```
Lunes    09:00 - 22:00
Martes   09:00 - 22:00
...
Domingo  Cerrado
```

**2. Síguenos** 📱
- Iconos de redes sociales con enlaces
- Colores característicos de cada red
- Hover interactivo

### Color de Marca
Aplicado en:
- ✅ Botones de categorías activas
- ✅ Botón de agregar producto (+)
- ✅ Icono de categoría activa
- ✅ Botón del carrito
- ✅ Botón de confirmar pedido

---

## 🗄️ Estructura de Base de Datos

### Campos Nuevos Agregados

```sql
-- Tabla: restaurants

primary_color    VARCHAR(7)      -- #ef4444
logo_url         TEXT            -- https://...
banner_url       TEXT            -- https://...
business_hours   JSONB           -- Estructura JSON
instagram        VARCHAR(100)    -- @usuario
facebook         VARCHAR(100)    -- Nombre Página
tiktok           VARCHAR(100)    -- @usuario
```

### Estructura de business_hours
```json
{
  "monday": {
    "open": "09:00",
    "close": "22:00",
    "closed": false
  },
  "tuesday": {
    "open": "09:00",
    "close": "22:00",
    "closed": false
  },
  // ... resto de días
}
```

---

## ⚙️ Configuración Inicial

### 1. Ejecutar Script SQL
Ejecuta en Supabase SQL Editor:
```bash
agregar-horarios-schema.sql
```

Esto agrega:
- Columna `business_hours` con valores por defecto
- Horarios predeterminados para restaurantes existentes

### 2. Actualizar Restaurante Existente
Si ya tienes un restaurante creado:
1. Entra al Dashboard
2. Ve a Perfil
3. Completa toda la información
4. Guarda

---

## 🎨 Ejemplos de Uso

### Restaurante Italiano
```
Color: #C41E3A (Rojo italiano)
Banner: Foto de pasta fresca
Logo: Escudo o logo del restaurant
Instagram: @tratoria_roma
```

### Pollería
```
Color: #FFA500 (Naranja)
Banner: Pollo a la brasa
Logo: Logo circular del negocio
Facebook: Pollería El Sabor Peruano
```

### Cevichería
```
Color: #0066CC (Azul marino)
Banner: Plato de ceviche
Logo: Pescado o logo marino
Horario: Cerrado los Lunes
```

---

## 💡 Mejores Prácticas

### Imágenes
- ✅ Logo: 500x500px (cuadrado)
- ✅ Banner: 1200x400px (horizontal)
- ✅ Formato: JPG o PNG
- ✅ Peso máximo recomendado: 500KB

### Color
- ✅ Elige colores que representen tu marca
- ✅ Asegúrate de que el texto blanco sea legible sobre tu color
- ✅ Evita colores muy claros (#FFFFFF, #FFFF00)

### Horarios
- ✅ Actualiza inmediatamente si cambias horarios
- ✅ Marca correctamente los días cerrados
- ✅ Usa formato 24 horas (ej: 14:00, no 2:00 PM)

### Redes Sociales
- ✅ Incluye @ al inicio (@usuario)
- ✅ No incluyas URLs completas, solo el usuario
- ✅ Verifica que los enlaces funcionen

---

## 🔧 Troubleshooting

### "Mi logo no se ve"
1. Verifica que la URL sea directa a la imagen
2. Debe terminar en .jpg, .png, .jpeg
3. Prueba abriendo la URL en una pestaña nueva

### "El color no cambia"
1. Asegúrate de hacer clic en "Guardar Cambios"
2. Recarga la página del menú público
3. Limpia caché del navegador (Ctrl+F5)

### "Los horarios no aparecen"
1. Verifica que ejecutaste el script SQL
2. Asegura que al menos un día esté marcado como abierto
3. Guarda los cambios en el formulario

---

## 📊 Resumen de Archivos Modificados

```
✅ types.ts                 - Tipos BusinessHours
✅ Dashboard.tsx            - Formulario de configuración
✅ App.tsx                  - Carga y guardado de datos
✅ PublicMenu.tsx           - Visualización pública
✅ agregar-horarios-schema.sql - Script de BD
```

---

## 🎉 ¡Todo Listo!

Tu panel de configuración está completamente funcional. Los restaurantes ahora pueden:

- 🎨 Personalizar su color de marca
- 🖼️ Subir logo y banner
- 📱 Agregar redes sociales
- 🕐 Configurar horarios de atención
- 📝 Actualizar información básica

¡Todo esto se refleja AUTOMÁTICAMENTE en el menú público! 🚀

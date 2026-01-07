# 🔧 Solución Final: Email y Borrado

Has reportado que:
1. El email sale "No configurado".
2. No puedes cerrar sesión.
3. No puedes borrar restaurantes.

Todo esto está **ARREGLADO** en el código. Solo falta **un paso en la base de datos**.

---

## 🚀 PASO ÚNICO REQUERIDO

Necesitamos agregar la columna `email` a la tabla de restaurantes para que puedas verla.

1. Ve a Supabase → **SQL Editor**.
2. Abre el archivo **`fix-email-column.sql`** (está en tu carpeta).
3. **Copia todo** el contenido.
4. Pégalo en el editor de Supabase.
5. Dale a **Run**.

✅ **Resultado**: Verás `Success`.

---

## 📋 ¿Qué Arreglé en el Código?

He actualizado tu archivo `App.tsx` con estas mejoras:

### 1. **Logout Real**
Antes: Solo borraba datos del navegador (localStorage).
Ahora: Llama a `supabase.auth.signOut()` para desconectarte de verdad.

### 2. **Borrar Restaurantes**
Antes: Posiblemente fallaba silenciosamente.
Ahora:
- Pide confirmación ("¿Estás seguro...?").
- Borra el restaurante de la base de datos.
- Actualiza la lista automáticamente.

### 3. **Ver Emails**
Antes: No existía donde guardar el email para verlo rápido.
Ahora:
- Al crear un restaurante, el email se guarda en dos lugares:
  1. **Supabase Auth** (para el login real).
  2. **Tabla Restaurants** (para que tú lo veas en el panel).

---

## 💡 Nota sobre Datos Antiguos

Los restaurantes que creaste ANTES de este arreglo (como "pollo rojo") seguirán diciendo "No configurado" o tendrán un valor por defecto, porque no guardamos el email en ese momento.

**Recomendación**:
1. Borra los restaurantes de prueba antiguos ("pollo rojo").
2. Crea uno nuevo con el botón "+ Nuevo Restaurante".
3. Verás que el nuevo SÍ muestra el email y contraseña.

---

## ✅ Prueba Final

1. Ejecuta el SQL (`fix-email-column.sql`).
2. Recarga tu página (`F5`).
3. **Prueba Logout**: Debería sacarte al login.
4. **Entra como Admin** (`admin@menupe.com`).
5. **Borra** el restaurante viejo.
6. **Crea** uno nuevo.

¡Debería funcionar todo perfecto ahora! 🚀

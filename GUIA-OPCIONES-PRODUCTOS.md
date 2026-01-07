# 🎛️ Guía de Opciones y Extras en Productos

## ¿Qué son los Grupos de Opciones?

Los **Grupos de Opciones** te permiten ofrecer variaciones o extras en tus productos. Por ejemplo:

- **Tamaño**: Personal, Familiar, XL
- **Extras**: Queso extra, Tocino, Aguacate
- **Tipo de cocción**: Término medio, Bien cocido
- **Bebida**: Coca Cola, Inca Kola, Sprite

---

## 📋 Cómo Configurar Opciones

### Paso 1: Crear un Producto
1. Ve a Dashboard → Platos
2. Haz clic en "+ Nuevo Plato"
3. Completa la información básica (nombre, categoría, precio, etc.)

### Paso 2: Agregar Grupos de Opciones
1. Desplázate hacia abajo hasta la sección **"Opciones/Extras"**
2. Haz clic en **"+ Agregar Grupo"**

### Paso 3: Configurar el Grupo
Cada grupo tiene:

#### **Nombre del Grupo**
Describe qué tipo de opción es. Ejemplos:
- "Tamaño"
- "Extras"
- "Tipo de bebida"
- "Agregados"

#### **Tipo de Selección**
Marca el checkbox **"Permitir selección múltiple"** según lo necesites:

- ✅ **MARCADO (Multi-selección)**: El cliente puede elegir **varias opciones**
  - Ejemplo: "Extras" → puede elegir queso + tocino + aguacate
  
- ⬜ **SIN MARCAR (Selección única)**: El cliente **solo puede elegir UNA opción**
  - Ejemplo: "Tamaño" → solo puede elegir Personal O Familiar O XL

---

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Hamburguesa Clásica

**Producto Base**: Hamburguesa Clásica - S/ 15.00

**Grupo 1: Tamaño** (Selección única ⬜)
- Simple: +S/ 0.00
- Doble: +S/ 5.00
- Triple: +S/ 8.00

**Grupo 2: Extras** (Multi-selección ✅)
- Queso cheddar: +S/ 2.00
- Tocino: +S/ 3.00
- Huevo frito: +S/ 2.50
- Aguacate: +S/ 3.50

**Resultado**: 
- Cliente pide: Hamburguesa Triple con Queso y Tocino
- Total: S/ 15 + S/ 8 + S/ 2 + S/ 3 = **S/ 28.00**

---

### Ejemplo 2: Pollo a la Brasa

**Producto Base**: Pollo a la Brasa - S/ 0.00

**Grupo 1: Tamaño** (Selección única ⬜) *OBLIGATORIO*
- 1/4 de pollo: +S/ 18.00
- 1/2 pollo: +S/ 32.00
- Pollo entero: +S/ 60.00

**Grupo 2: Acompañamiento** (Selección única ⬜) *OBLIGATORIO*
- Papas fritas: +S/ 0.00
- Ensalada: +S/ 0.00
- Yuca frita: +S/ 2.00

**Grupo 3: Extras** (Multi-selección ✅) *OPCIONAL*
- Cremas adicionales: +S/ 2.00
- Porción extra de papas: +S/ 8.00
- Gaseosa 1.5L: +S/ 6.00

---

### Ejemplo 3: Café

**Producto Base**: Café Americano - S/ 5.00

**Grupo 1: Tamaño** (Selección única ⬜)
- Pequeño: +S/ 0.00
- Mediano: +S/ 2.00
- Grande: +S/ 3.00

**Grupo 2: Leche** (Selección única ⬜)
- Sin leche: +S/ 0.00
- Leche entera: +S/ 1.00
- Leche descremada: +S/ 1.00
- Leche de almendras: +S/ 3.00

**Grupo 3: Extras** (Multi-selección ✅)
- Shot extra de café: +S/ 2.00
- Crema batida: +S/ 2.50
- Caramelo: +S/ 1.50
- Chocolate: +S/ 1.50

---

## 💡 Consejos y Mejores Prácticas

### ✅ Hacer
- **Nombres claros**: Usa nombres descriptivos para grupos y opciones
- **Precios realistas**: Asigna precios justos a cada extra
- **Organiza lógicamente**: Primero tamaños obligatorios, luego extras opcionales
- **Opciones sin cargo**: Si algo no tiene costo extra, pon S/ 0.00

### ❌ Evitar
- Nombres ambiguos como "Opción 1", "Extra 2"
- Demasiados grupos (máximo 3-4 para no confundir al cliente)
- Precios muy altos en extras
- Duplicar opciones entre diferentes grupos

---

## 🛠️ Cómo se Muestra al Cliente

Cuando el cliente hace clic en un producto con opciones:

1. **Modal de Personalización** se abre automáticamente
2. Ve cada grupo de opciones con su nombre
3. Puede seleccionar según la configuración:
   - Radio buttons (○) si es selección única
   - Checkboxes (☐) si es multi-selección
4. Ve el precio de cada opción
5. **Precio total** se actualiza en tiempo real
6. Hace clic en "Añadir al pedido"

---

## 📊 Visualización de Grupos

### Selección Única (⬜)
```
○ Opción 1 ... +S/ 2.00
○ Opción 2 ... +S/ 3.00
○ Opción 3 ... +S/ 5.00
```
Solo un círculo puede estar marcado.

### Multi-Selección (✅)
```
☐ Extra 1 ... +S/ 2.00
☐ Extra 2 ... +S/ 3.00
☐ Extra 3 ... +S/ 5.00
```
Pueden marcar varios o ninguno.

---

## 🎨 Interfaz del Dashboard

### Agregar un Grupo
1. Clic en **"+ Agregar Grupo"**
2. Escribe el nombre del grupo
3. Marca o desmarca **"Permitir selección múltiple"**
4. Agrega opciones con **"+ Agregar opción"**

### Agregar Opciones al Grupo
Cada opción tiene:
- **Nombre**: Ej: "Queso extra"
- **Precio**: Ej: 2.00
- **Botón ✕**: Para eliminar la opción

### Eliminar
- **✕ rojo junto al grupo**: Elimina TODO el grupo
- **✕ pequeño junto a opción**: Elimina solo esa opción

---

## ⚠️ Importante

1. **Guardar cambios**: No olvides hacer clic en "Guardar" al terminar
2. **Editar productos**: Puedes editar las opciones en cualquier momento
3. **Productos sin opciones**: Si un producto no tiene opciones, el cliente puede agregarlo directo al carrito
4. **Validación**: El sistema calcula automáticamente el precio total con las opciones seleccionadas

---

## 🚀 Casos de Uso Avanzados

### Obligatorio vs Opcional

**¿Cómo hacer una opción obligatoria?**
El sistema considera un grupo "obligatorio" automáticamente si:
- Es selección **única** (⬜)
- El cliente debe elegir para continuar

**Ejemplo**:
- "Tamaño" → El cliente DEBE elegir un tamaño
- "Extras" (multi) → El cliente PUEDE o NO agregar extras

### Opciones Gratuitas

Puedes tener opciones sin costo adicional poniendo precio **0.00**:
```
Grupo: Acompañamiento (única)
- Papas fritas: +S/ 0.00
- Ensalada: +S/ 0.00
- Arroz: +S/ 0.00
```

---

¡Con esto puedes crear menús súper personalizables para tus clientes! 🎉

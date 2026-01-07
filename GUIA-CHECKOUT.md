# 🛵 Guía del Nuevo Checkout y Pedidos

## ✨ Novedades Implementadas

He agregado un sistema de **Checkout Completo** que permite al cliente especificar todos los detalles de su pedido antes de enviarlo por WhatsApp.

---

## 🛍️ Flujo de Compra

1. **Cliente agrega productos**: Selecciona productos y opciones (tamaños, extras).
2. **Revisar Pedido**: Abre el carrito y ve todos sus items.
3. **Continuar**: Al hacer clic en "Continuar", se abre el formulario de checkout.

---

## 📝 Formulario de Checkout

El cliente puede elegir entre 3 tipos de pedido:

### 1. 🛵 Delivery
Pide información completa:
- Nombre
- Teléfono
- Dirección
- Referencia (opcional)
- **Zona de Delivery**: Selecciona de una lista configurada (con precio adicional)

### 2. 🥡 Para Llevar
Pide información básica:
- Nombre
- Se asume que el cliente pasará a recogerlo.

### 3. 🍽️ En Mesa
Ideal para pedidos dentro del local:
- Nombre
- **Número de Mesa**: Obligatorio para ubicar al cliente.

---

## 💰 Métodos de Pago
El cliente selecciona cómo va a pagar:
- Yape
- Plin
- Efectivo
- Otro

---

## 📱 Mensaje de WhatsApp

El mensaje que llega al restaurante es súper detallado y ordenado:

```text
*Pedido Nuevo - El Padrino*
--------------------------
*Tipo:* 🛵 DELIVERY

*Cliente:* Juan Pérez
*Teléfono:* 999888777
*Dirección:* Av. Larco 123
*Zona:* Centro (+S/ 5.00)

--------------------------

2x Hamburguesa Clásica
   _Tamaño: Doble, Extras: Queso_
   *S/ 44.00*

--------------------------
*Subtotal:* S/ 44.00
*Delivery:* S/ 5.00
*Total: S/ 49.00*
--------------------------

*Pago:* Yape
*Observaciones:* Sin mayonesa por favor.

_Pedido enviado desde MenuPe_
```

---

## ⚙️ Configuración (Próximamente en Panel)

Por ahora, los valores por defecto son:

**Zonas de Delivery:**
- Centro (S/ 5.00)
- Norte (S/ 8.00)
- Sur (S/ 10.00)

**Métodos de Pago:**
- Yape
- Plin
- Efectivo

⚠️ **Nota**: Ya he creado la estructura en la base de datos para que esto sea editable desde el panel de administrador en el futuro.

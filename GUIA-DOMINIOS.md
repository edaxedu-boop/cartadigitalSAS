# Guía de Configuración de Dominios y Subdominios 🌐

Para lograr que tu app responda tanto a `cartadigital.site` (Página Principal) como a `pollorojo.cartadigital.site` (Menú del Restaurante), necesitas configurar los DNS y Vercel.

## 1. Configuración en Hostinger (DNS)

Entra a tu panel de Hostinger, ve a la sección **DNS Zone Editor** de tu dominio `cartadigital.site` y asegúrate de tener estos registros.

### Registro A (Raíz)
Si Vercel te dio una IP (ej: `76.76.21.21`):
- **Type**: A
- **Name**: @
- **Points to**: `76.76.21.21` (O la IP que Vercel te indique en Settings > Domains)
- **TTL**: 14400

### Registro CNAME (WWW)
- **Type**: CNAME
- **Name**: www
- **Points to**: `cname.vercel-dns.com.`
- **TTL**: 14400

### Registro CNAME (Wildcard / Comodín) ⭐ IMPORTANTE
Este es el que permite los subdominios infinitos.
- **Type**: CNAME
- **Name**: *
- **Points to**: `cname.vercel-dns.com.`
- **TTL**: 14400

*(Si Hostinger no te deja poner CNAME en Wildcard, intenta ponerlo como registro A apuntando a la misma IP que la raíz, pero CNAME es preferible).*

---

## 2. Configuración en Vercel

1.  Ve a tu proyecto en Vercel -> **Settings** -> **Domains**.
2.  Agrega tu dominio principal: `cartadigital.site`. Vercel te pedirá agregar `www.cartadigital.site` también (acepta).
3.  **Agrega el Wildcard**: Escribe `*.cartadigital.site` en el campo de agregar dominio y presiona Add.
4.  Vercel verificará los registros DNS. Si hiciste bien el paso 1, todo debería ponerse en verde (puede tardar unos minutos o hasta 24h en propagarse, pero usualmente es rápido).

## 3. ¿Cómo funciona?

Una vez configurado:
1.  Si alguien entra a `cartadigital.site` -> Vercel carga tu app. El código detecta que NO hay subdominio y muestra la Portada y el Login.
2.  Si alguien entra a `pollorojo.cartadigital.site` -> Vercel carga la MISMA app.
3.  **Pero...** nuestro código en `App.tsx` detecta que el dominio empieza con `pollorojo`.
4.  Automáticamente, ignora la portada y muestra **directamente** el menú correspondiente al slug `pollorojo`.

### Requisito:
Para que esto funcione, cuando crees el restaurante en el Super Admin, el campo **Slug URL** debe coincidir con el subdominio que quieras usar. Si le pones `pollo-rojo` (con guion), el subdominio deberá ser `pollo-rojo.cartadigital.site`.

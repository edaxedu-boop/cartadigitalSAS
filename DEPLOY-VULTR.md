# 🚀 Guía Completa: Desplegar MenuPe en Vultr

## 📋 Requisitos Previos
- [ ] Tarjeta de crédito/débito o PayPal
- [ ] Email
- [ ] 30-45 minutos de tiempo

---

## PASO 1: Crear Cuenta en Vultr (5 minutos)

### 1.1 Registro
1. **Ve a**: https://www.vultr.com
2. **Click en "Sign Up"**
3. **Completa el formulario:**
   - Email
   - Contraseña
   - Verificación email

### 1.2 Agregar Método de Pago
1. **Ve a Billing** → Payment Methods
2. **Agrega tarjeta** o PayPal
3. **Agrega $10 iniciales** (te durarán 2 meses)

### 1.3 Obtener Crédito Gratis (Opcional)
- Busca cupones de Vultr en Google
- Algunos dan $100-$300 gratis
- Ejemplo: código "VULTR300" (verifica vigencia)

---

## PASO 2: Crear Servidor VPS (3 minutos)

### 2.1 Deploy New Server
1. **Click en "Deploy +"** → Deploy New Server
2. **Elige "Cloud Compute"**

### 2.2 Configuración del Servidor

**Server Location:**
```
Choose Server
├── São Paulo, Brazil (mejor opción LATAM)
└── Miami, USA (alternativa)
```
⚠️ IMPORTANTE: Vultr removió Lima temporalmente, usa São Paulo

**Server Type:**
```
Operating System: Ubuntu 22.04 LTS
```

**Server Size:**
```
⭐ RECOMENDADO:
$6/month
- 1 vCPU
- 1GB RAM
- 25GB SSD
- 2TB Bandwidth

O si tienes presupuesto:
$12/month
- 1 vCPU
- 2GB RAM
- 55GB SSD
- 3TB Bandwidth
```

**Additional Features:**
```
☑ Enable IPv6
☑ Enable Auto Backups (+$1.20/mes) - RECOMENDADO
☐ DDoS Protection (no necesario por ahora)
```

**Server Hostname:**
```
menupe-prod
```

3. **Click "Deploy Now"**
4. **Espera 60 segundos** (el servidor se está creando)

---

## PASO 3: Acceder al Servidor (5 minutos)

### 3.1 Obtener Credenciales
1. **Click en tu servidor** (menupe-prod)
2. **Copia estos datos:**
   ```
   IP Address: XXX.XXX.XXX.XXX
   Username: root
   Password: [click en el ícono del ojo para ver]
   ```

### 3.2 Conectar vía SSH

**Opción A: Windows (PowerShell)**
```powershell
# Abre PowerShell
ssh root@XXX.XXX.XXX.XXX

# Pega la contraseña cuando te la pida
# Tip: Click derecho para pegar en PowerShell
```

**Opción B: PuTTY (Windows)**
1. Descarga PuTTY: https://www.putty.org
2. Host Name: tu IP
3. Port: 22
4. Click Open
5. Login: root
6. Password: [pega la contraseña]

### 3.3 Primera Conexión
Cuando te conectes por primera vez:
```bash
# Te preguntará: Are you sure you want to continue connecting?
# Escribe: yes
# Presiona Enter
```

---

## PASO 4: Configurar el Servidor (15 minutos)

### 4.1 Actualizar Sistema
```bash
# Actualizar lista de paquetes
apt update

# Actualizar todo el sistema
apt upgrade -y

# Esto puede tardar 2-3 minutos
```

### 4.2 Instalar PostgreSQL 15
```bash
# Instalar PostgreSQL
apt install postgresql postgresql-contrib -y

# Verificar que esté corriendo
systemctl status postgresql

# Presiona 'q' para salir
```

### 4.3 Configurar PostgreSQL
```bash
# Cambiar a usuario postgres
sudo -u postgres psql

# Dentro de PostgreSQL, ejecuta:
CREATE DATABASE menupe;
CREATE USER menupe_user WITH ENCRYPTED PASSWORD 'TuPasswordSegura123!';
GRANT ALL PRIVILEGES ON DATABASE menupe TO menupe_user;

# Salir
\q
```

### 4.4 Instalar Node.js 20
```bash
# Descargar script de instalación
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Instalar Node.js
apt install nodejs -y

# Verificar
node --version  # Debe mostrar v20.x.x
npm --version   # Debe mostrar 10.x.x
```

### 4.5 Instalar PM2 (Process Manager)
```bash
# PM2 mantiene tu app corriendo 24/7
npm install -g pm2

# Verificar
pm2 --version
```

### 4.6 Instalar Nginx
```bash
# Nginx será el servidor web
apt install nginx -y

# Iniciar Nginx
systemctl start nginx
systemctl enable nginx

# Verificar
systemctl status nginx
```

### 4.7 Configurar Firewall
```bash
# Permitir SSH
ufw allow 22/tcp

# Permitir HTTP y HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Permitir PostgreSQL solo local
# (no expongas PostgreSQL al mundo)

# Activar firewall
ufw enable

# Verifica que diga: Command may disrupt existing ssh connections
# Escribe: y
```

---

## PASO 5: Subir tu Proyecto (10 minutos)

### 5.1 Crear Estructura de Directorios
```bash
# Crear carpeta para la app
mkdir -p /var/www/menupe
cd /var/www/menupe
```

### 5.2 Subir Código (Opción Git - RECOMENDADA)

**En tu PC local:**
```bash
# 1. Inicializa git si no lo has hecho
git init
git add .
git commit -m "Initial commit"

# 2. Crea un repo en GitHub
# Ve a github.com → New Repository → menupe

# 3. Sube el código
git remote add origin https://github.com/TU-USUARIO/menupe.git
git branch -M main
git push -u origin main
```

**En el VPS:**
```bash
# Clonar el repositorio
cd /var/www/menupe
git clone https://github.com/TU-USUARIO/menupe.git .

# Instalar dependencias
npm install

# Crear .env.local
nano .env.local
```

**Pega esto en .env.local:**
```env
VITE_SUPABASE_URL=postgresql://menupe_user:TuPasswordSegura123!@localhost/menupe
```

**Guardar y salir:**
```
Ctrl + O  (guardar)
Enter
Ctrl + X  (salir)
```

### 5.3 Compilar el Proyecto
```bash
# Build del frontend
npm run build

# Esto crea la carpeta 'dist' con archivos optimizados
```

---

## PASO 6: Configurar Nginx (5 minutos)

### 6.1 Crear Configuración
```bash
nano /etc/nginx/sites-available/menupe
```

**Pega esto:**
```nginx
server {
    listen 80;
    server_name TU_IP_AQUI;  # Cambia por tu IP de Vultr
    
    root /var/www/menupe/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Comprimir archivos
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Guardar:** Ctrl+O, Enter, Ctrl+X

### 6.2 Activar Configuración
```bash
# Crear link simbólico
ln -s /etc/nginx/sites-available/menupe /etc/nginx/sites-enabled/

# Probar configuración
nginx -t

# Si dice "syntax is ok", reinicia Nginx
systemctl restart nginx
```

---

## PASO 7: Migrar Base de Datos (5 minutos)

### 7.1 Ejecutar SQL de Setup
```bash
# Conectar a PostgreSQL
sudo -u postgres psql -d menupe

# Copiar y pegar TODO el contenido de database-setup.sql
# (el archivo que creamos antes)

# Salir
\q
```

---

## PASO 8: Verificar Todo Funciona (2 minutos)

### 8.1 Probar la App
1. **Abre tu navegador**
2. **Ve a:** `http://TU_IP_VULTR`
3. **Deberías ver tu app funcionando! 🎉**

### 8.2 Probar el Menú
4. **Ve a:** `http://TU_IP_VULTR/#/menu/sabor`
5. **Deberías ver el menú con productos**

---

## PASO 9: Configurar Dominio (OPCIONAL - 10 minutos)

### 9.1 Comprar Dominio
- **Namecheap**: ~$10/año (.com)
- **Porkbun**: ~$8/año (.com)
- **GoDaddy**: ~$12/año (.com)

### 9.2 Configurar DNS

En tu proveedor de dominios:
```
Tipo: A
Host: @
Value: TU_IP_VULTR
TTL: 300

Tipo: A
Host: www
Value: TU_IP_VULTR
TTL: 300
```

### 9.3 Esperar Propagación
- Tarda 5 minutos a 24 horas
- Generalmente ~1 hora

---

## PASO 10: Configurar SSL (GRATIS - 5 minutos)

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d tudominio.com -d www.tudominio.com

# Seguir las instrucciones:
# 1. Email: tu@email.com
# 2. Terms: A (Agree)
# 3. Share email: N (No)
# 4. Redirect HTTP to HTTPS: 2 (Sí, redirigir)

# ¡Listo! Ahora tienes HTTPS 🔒
```

---

## 🎯 Resumen de Costos

```
VPS Vultr $6/mes:
├── Servidor (1GB RAM)          $6.00
├── Backups automáticos         $1.20
└── Total mensual              $7.20

Dominio (opcional):
└── .com por año               ~$10

SSL:
└── Let's Encrypt              GRATIS

TOTAL: $7.20/mes + $10/año dominio
```

---

## 🔧 Comandos Útiles de Mantenimiento

```bash
# Ver logs de Nginx
tail -f /var/log/nginx/error.log

# Reiniciar Nginx
systemctl restart nginx

# Ver base de datos
sudo -u postgres psql -d menupe

# Actualizar código (después de push a GitHub)
cd /var/www/menupe
git pull
npm run build
systemctl restart nginx

# Ver uso de recursos
htop  # (instalar con: apt install htop)

# Backups manuales de BD
pg_dump -U menupe_user menupe > backup_$(date +%Y%m%d).sql
```

---

## 🆘 Troubleshooting

**Problema: No carga la página**
```bash
# Verificar que Nginx esté corriendo
systemctl status nginx

# Ver logs
tail -f /var/log/nginx/error.log
```

**Problema: No conecta a base de datos**
```bash
# Verificar PostgreSQL
systemctl status postgresql

# Ver logs
tail -f /var/log/postgresql/postgresql-15-main.log
```

**Problema: Cambios no se ven**
```bash
# Limpiar caché de navegador
# O visita: http://tu-ip/?v=2

# En el servidor:
cd /var/www/menupe
git pull
npm run build
systemctl restart nginx
```

---

## ✅ Checklist Final

- [ ] Servidor Vultr creado
- [ ] SSH funcionando
- [ ] PostgreSQL instalado y configurado
- [ ] Node.js 20 instalado
- [ ] Nginx instalado y configurado
- [ ] Código subido y compilado
- [ ] Base de datos migrada
- [ ] App accesible desde navegador
- [ ] Dominio configurado (opcional)
- [ ] SSL configurado (opcional)

---

## 🚀 ¡Listo para Producción!

Tu app ahora está:
- ✅ Corriendo 24/7
- ✅ Con base de datos PostgreSQL
- ✅ Con backups automáticos
- ✅ Optimizada y rápida
- ✅ Lista para recibir tráfico

**Próximos pasos:**
1. Comparte la URL con tus clientes
2. Agrega más restaurantes desde Super Admin
3. Monitorea el rendimiento
4. ¡Escala cuando lo necesites!

---

¿Necesitas ayuda en algún paso específico? 🤔

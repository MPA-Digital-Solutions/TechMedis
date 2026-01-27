#!/bin/bash
# ============================================
# TechMedis - VPS Setup Script
# ============================================
# Ejecutar como root en un VPS Ubuntu 22.04/24.04 limpio
# Uso: bash vps-setup.sh
# ============================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  TechMedis - VPS Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Ejecutar como root (sudo bash vps-setup.sh)${NC}"
    exit 1
fi

# ==================== 1. Actualizar sistema ====================
echo -e "${YELLOW}[1/8] Actualizando sistema...${NC}"
apt update && apt upgrade -y

# ==================== 2. Instalar paquetes esenciales ====================
echo -e "${YELLOW}[2/8] Instalando paquetes esenciales...${NC}"
apt install -y \
    git \
    curl \
    wget \
    htop \
    ufw \
    fail2ban \
    nginx \
    certbot \
    python3-certbot-nginx

# ==================== 3. Instalar Docker ====================
echo -e "${YELLOW}[3/8] Instalando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "Docker ya está instalado"
fi

# ==================== 4. Configurar Firewall (UFW) ====================
echo -e "${YELLOW}[4/8] Configurando firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
echo "y" | ufw enable

# ==================== 5. Configurar Fail2Ban ====================
echo -e "${YELLOW}[5/8] Configurando Fail2Ban...${NC}"
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 24h
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# ==================== 6. Crear directorio de la aplicación ====================
echo -e "${YELLOW}[6/8] Creando directorio de la aplicación...${NC}"
mkdir -p /var/www/techmedis
cd /var/www/techmedis

# ==================== 7. Configurar Nginx ====================
echo -e "${YELLOW}[7/8] Configurando Nginx...${NC}"

# Copiar configuración si existe en el repo
if [ -f "/var/www/techmedis/scripts/nginx-techmedis.conf" ]; then
    cp /var/www/techmedis/scripts/nginx-techmedis.conf /etc/nginx/sites-available/techmedis
else
    # Crear configuración básica
    cat > /etc/nginx/sites-available/techmedis << 'EOF'
limit_req_zone $binary_remote_addr zone=techmedis_limit:10m rate=10r/s;

server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    access_log /var/log/nginx/techmedis_access.log;
    error_log /var/log/nginx/techmedis_error.log;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    server_tokens off;
    client_max_body_size 10M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    location / {
        limit_req zone=techmedis_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location ~ /\. {
        deny all;
    }
}
EOF
fi

# Activar sitio
ln -sf /etc/nginx/sites-available/techmedis /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar y reiniciar Nginx
nginx -t && systemctl reload nginx

# ==================== 8. Mostrar resumen ====================
echo -e "${YELLOW}[8/8] Configuración de seguridad SSH...${NC}"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup completado!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo ""
echo "1. Clonar el repositorio:"
echo "   cd /var/www/techmedis"
echo "   git clone git@github.com:MPA-Digital-Solutions/TechMedis.git ."
echo ""
echo "2. Configurar variables de entorno:"
echo "   cp .env.example .env"
echo "   nano .env  # Cambiar credenciales"
echo ""
echo "3. Levantar la aplicación:"
echo "   docker-compose --profile prod up -d --build"
echo ""
echo "4. (Opcional) Configurar SSL cuando tengas dominio:"
echo "   certbot --nginx -d tudominio.com"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Estado actual:${NC}"
echo "- Firewall: $(ufw status | head -1)"
echo "- Docker: $(docker --version)"
echo "- Nginx: $(nginx -v 2>&1)"
echo "- Fail2Ban: $(fail2ban-client status | head -1)"
echo -e "${GREEN}========================================${NC}"

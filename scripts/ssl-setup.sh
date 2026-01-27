#!/bin/bash
# ============================================
# TechMedis - SSL Setup Script (Docker)
# ============================================
# Ejecutar cuando el dominio apunte al VPS
# Uso: bash scripts/ssl-setup.sh tudominio.com
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}Error: Especifica el dominio${NC}"
    echo "Uso: bash scripts/ssl-setup.sh tudominio.com"
    exit 1
fi

DOMAIN=$1

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Configurando SSL para: $DOMAIN${NC}"
echo -e "${GREEN}========================================${NC}"

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Ejecutar como root${NC}"
    exit 1
fi

# Instalar certbot si no existe
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Instalando certbot...${NC}"
    apt update && apt install -y certbot
fi

# Parar nginx temporalmente para obtener certificado
echo -e "${YELLOW}[1/4] Parando Nginx temporalmente...${NC}"
docker-compose --profile prod stop nginx

# Obtener certificado (standalone mode)
echo -e "${YELLOW}[2/4] Obteniendo certificado SSL...${NC}"
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Copiar certificados al directorio de nginx
echo -e "${YELLOW}[3/4] Configurando certificados...${NC}"
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/

# Crear configuración nginx con SSL
cat > nginx/nginx.conf << EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=techmedis_limit:10m rate=10r/s;

upstream nextjs {
    server app:3000;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL certificates
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL settings
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    server_tokens off;
    client_max_body_size 10M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss image/svg+xml;
    gzip_comp_level 6;

    location / {
        limit_req zone=techmedis_limit burst=20 nodelay;
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /_next/static/ {
        proxy_pass http://nextjs;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    location ~ /\. {
        deny all;
    }

    location /health {
        access_log off;
        return 200 "OK";
    }
}
EOF

# Reiniciar nginx
echo -e "${YELLOW}[4/4] Reiniciando Nginx...${NC}"
docker-compose --profile prod up -d nginx

# Configurar renovación automática
echo -e "${YELLOW}Configurando renovación automática...${NC}"
cat > /etc/cron.d/certbot-renew << CRON
0 3 * * * root certbot renew --quiet --deploy-hook "cd /var/www/techmedis && cp /etc/letsencrypt/live/$DOMAIN/*.pem nginx/ssl/ && docker-compose --profile prod restart nginx"
CRON

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL configurado correctamente!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Tu sitio ahora está disponible en:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
echo "El certificado se renovará automáticamente cada 3 meses."

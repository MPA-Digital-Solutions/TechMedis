#!/bin/bash
# ============================================
# TechMedis - SSL Setup Script
# ============================================
# Ejecutar cuando el dominio apunte al VPS
# Uso: bash ssl-setup.sh tudominio.com
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar argumentos
if [ -z "$1" ]; then
    echo -e "${RED}Error: Especifica el dominio${NC}"
    echo "Uso: bash ssl-setup.sh tudominio.com"
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

# Actualizar server_name en Nginx
echo -e "${YELLOW}[1/3] Actualizando configuración Nginx...${NC}"
sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/techmedis
nginx -t && systemctl reload nginx

# Obtener certificado SSL
echo -e "${YELLOW}[2/3] Obteniendo certificado SSL...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Verificar renovación automática
echo -e "${YELLOW}[3/3] Verificando renovación automática...${NC}"
certbot renew --dry-run

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SSL configurado correctamente!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Tu sitio ahora está disponible en:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
echo "El certificado se renovará automáticamente."

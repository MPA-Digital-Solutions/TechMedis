#!/bin/bash
# ============================================
# TechMedis - Deploy Script
# ============================================
# Uso: ./scripts/deploy.sh
# ============================================

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  TechMedis - Deploy Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml no encontrado${NC}"
    echo "Ejecuta este script desde /var/www/techmedis"
    exit 1
fi

# Verificar que .env existe
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env no encontrado${NC}"
    echo "Copia .env.example a .env y configura las variables"
    exit 1
fi

echo -e "${YELLOW}[1/5] Pulling latest changes from git...${NC}"
git pull origin main

echo -e "${YELLOW}[2/5] Building Docker images...${NC}"
docker-compose --profile prod build

echo -e "${YELLOW}[3/5] Stopping old containers...${NC}"
docker-compose --profile prod down

echo -e "${YELLOW}[4/5] Starting new containers...${NC}"
docker-compose --profile prod up -d

echo -e "${YELLOW}[5/5] Cleaning up old images...${NC}"
docker system prune -f

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploy completado!${NC}"
echo -e "${GREEN}========================================${NC}"

# Mostrar estado
echo ""
echo -e "${YELLOW}Estado de los contenedores:${NC}"
docker-compose --profile prod ps

echo ""
echo -e "${YELLOW}Para ver logs:${NC}"
echo "  docker-compose --profile prod logs -f app"

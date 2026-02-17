#!/bin/bash

# Renkler
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}QNOWA Deployment Başlatılıyor...${NC}"

# 1. Kodları güncelle
echo "Git pull yapılıyor..."
git pull

# 2. Docker imajını yeniden build et ve container'ları yeniden başlat
echo "Docker build ve restart..."
docker compose -f docker-compose.prod.yml up -d --build

# 3. Eski imajları temizle (opsiyonel)
echo "Temizlik yapılıyor..."
docker image prune -f

echo -e "${GREEN}Deployment Tamamlandı! 🚀${NC}"

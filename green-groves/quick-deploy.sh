#!/bin/bash

# Quick deployment script for AWS EC2
# Usage: ./quick-deploy.sh

echo "🚀 Quick deployment to AWS EC2..."

# Check if running on EC2
if [ ! -f /sys/hypervisor/uuid ] || [ `head -c 3 /sys/hypervisor/uuid` != "ec2" ]; then
    echo "❌ This script should be run on AWS EC2 instance"
    exit 1
fi

# Update system
echo "📦 Updating system..."
sudo apt update

# Install required packages
echo "🔧 Installing packages..."
sudo apt install -y nginx php8.1-fpm php8.1-cli php8.1-sqlite3 nodejs npm git

# Install Composer
if ! command -v composer &> /dev/null; then
    echo "📦 Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
fi

# Create directory
echo "📁 Setting up directory..."
sudo mkdir -p /var/www/green-groves
sudo chown -R $USER:$USER /var/www/green-groves

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/green-groves
if [ ! -d ".git" ]; then
    git clone https://github.com/havindev/eProject.git .
fi

# Backend setup
echo "🔧 Setting up backend..."
cd backend
cp production.env .env
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force

# Frontend setup
echo "🔧 Setting up frontend..."
cd ../frontend
cp production.env .env
npm install
npm run build

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo cp ../nginx.conf /etc/nginx/sites-available/green-groves
sudo ln -sf /etc/nginx/sites-available/green-groves /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t && sudo systemctl restart nginx

# Start Laravel backend
echo "🚀 Starting backend..."
cd ../backend
nohup php artisan serve --host=0.0.0.0 --port=8000 > /var/log/green-groves.log 2>&1 &

# Set permissions
sudo chown -R www-data:www-data /var/www/green-groves
sudo chmod -R 755 /var/www/green-groves

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://13.211.146.7"
echo "🔧 Backend: http://13.211.146.7:8000/api"
echo "📊 Admin: http://13.211.146.7/admin"

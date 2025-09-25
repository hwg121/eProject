#!/bin/bash

# Green Groves AWS EC2 Deployment Script
# IP: 13.211.146.7

echo "🚀 Starting Green Groves deployment to AWS EC2..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y nginx php8.1-fpm php8.1-cli php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-zip php8.1-bcmath php8.1-sqlite3 nodejs npm git unzip

# Install Composer
echo "📦 Installing Composer..."
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Install Node.js (latest LTS)
echo "📦 Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/green-groves
sudo chown -R $USER:$USER /var/www/green-groves

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/green-groves
git clone https://github.com/havindev/eProject.git .

# Backend setup
echo "🔧 Setting up backend..."
cd /var/www/green-groves/backend

# Copy production environment
cp production.env .env

# Generate application key
php artisan key:generate

# Install dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Set permissions
sudo chown -R www-data:www-data /var/www/green-groves/backend
sudo chmod -R 755 /var/www/green-groves/backend

# Frontend setup
echo "🔧 Setting up frontend..."
cd /var/www/green-groves/frontend

# Copy production environment
cp production.env .env

# Install dependencies
npm install

# Build for production
npm run build

# Set permissions
sudo chown -R www-data:www-data /var/www/green-groves/frontend
sudo chmod -R 755 /var/www/green-groves/frontend

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/green-groves << EOF
server {
    listen 80;
    server_name 13.211.146.7;
    root /var/www/green-groves/frontend/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API routes
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/green-groves /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start Laravel backend
echo "🚀 Starting Laravel backend..."
cd /var/www/green-groves/backend
nohup php artisan serve --host=0.0.0.0 --port=8000 > /var/log/green-groves-backend.log 2>&1 &

# Create systemd service for Laravel
sudo tee /etc/systemd/system/green-groves-backend.service << EOF
[Unit]
Description=Green Groves Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/green-groves/backend
ExecStart=/usr/bin/php artisan serve --host=0.0.0.0 --port=8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable green-groves-backend
sudo systemctl start green-groves-backend

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://13.211.146.7"
echo "🔧 Backend API: http://13.211.146.7:8000/api"
echo "📊 Admin Dashboard: http://13.211.146.7/admin"
echo "🔑 Login: admin@greengroves.com / admin123"

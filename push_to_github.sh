#!/bin/bash

# Script để đẩy project lên GitHub
# Chạy: bash push_to_github.sh

echo "🚀 Bắt đầu đẩy project lên GitHub..."

# 1. Khởi tạo git repository
git init
echo "✅ Đã khởi tạo Git repository"

# 2. Thêm tất cả file vào staging
git add .
echo "✅ Đã thêm tất cả file"

# 3. Commit đầu tiên
git commit -m "Initial commit: Setup eProject structure"
echo "✅ Đã tạo commit đầu tiên"

# 4. Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO_NAME)
echo ""
echo "⚠️  QUAN TRỌNG: Thay thế thông tin GitHub của bạn:"
echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo ""
read -p "Nhập URL repository GitHub của bạn: " repo_url
git remote add origin $repo_url
echo "✅ Đã thêm remote repository"

# 5. Đẩy lên GitHub
git branch -M main
git push -u origin main
echo "✅ Đã đẩy code lên GitHub thành công!"

echo ""
echo "🎉 Hoàn thành! Project đã được đẩy lên GitHub."
echo "📌 Chia sẻ link repository cho team members của bạn."

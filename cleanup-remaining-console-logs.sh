#!/bin/bash
# Green Groves - Cleanup Remaining Console Logs
# This script removes console.log and alert statements from frontend files
# while preserving console.error and console.warn for production debugging

echo "🧹 Starting frontend console cleanup..."
echo ""

# Count before cleanup
before=$(grep -r "console\.log\|alert(" frontend/src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
echo "📊 Found $before console.log/alert statements"
echo ""

# Files to clean (excluding already clean files)
files_to_clean=(
  "frontend/src/pages/AboutUs.tsx"
  "frontend/src/pages/admin/AdminStaffManagement.tsx"
  "frontend/src/pages/admin/AdminHeroSection.tsx"
  "frontend/src/pages/admin/AdminMapSettings.tsx"
  "frontend/src/pages/admin/AdminContactSettings.tsx"
  "frontend/src/pages/admin/AdminContactMessages.tsx"
  "frontend/src/pages/Videos.tsx"
  "frontend/src/pages/Tools.tsx"
  "frontend/src/pages/Books.tsx"
  "frontend/src/pages/Techniques.tsx"
  "frontend/src/pages/Pots.tsx"
  "frontend/src/pages/Accessories.tsx"
  "frontend/src/pages/Suggestions.tsx"
  "frontend/src/pages/Login.tsx"
  "frontend/src/pages/TechniqueDetail.tsx"
  "frontend/src/pages/VideoDetail.tsx"
  "frontend/src/pages/ArticleDetail.tsx"
  "frontend/src/pages/EssentialDetail.tsx"
  "frontend/src/pages/AdminAboutUs.tsx"
  "frontend/src/components/admin/ContentForm.tsx"
  "frontend/src/components/admin/UserEditForm.tsx"
  "frontend/src/components/admin/UserProfileComponent.tsx"
  "frontend/src/components/admin/UserCreate.tsx"
  "frontend/src/components/Layout/Header.tsx"
  "frontend/src/components/Layout/Footer.tsx"
  "frontend/src/components/UI/DetailPage.tsx"
  "frontend/src/components/ImageUpload.tsx"
  "frontend/src/services/visitorService.ts"
  "frontend/src/services/contactSettingService.ts"
  "frontend/src/hooks/useGeolocation.ts"
  "frontend/src/main-simple.tsx"
)

echo "🔧 Cleaning files..."
cleaned_count=0

for file in "${files_to_clean[@]}"; do
  if [ -f "$file" ]; then
    # Create backup
    cp "$file" "$file.backup"
    
    # Remove console.log statements (but keep console.error and console.warn)
    # Remove entire lines containing console.log
    sed -i '/[[:space:]]*console\.log(/d' "$file"
    
    # Remove alert() statements
    sed -i '/[[:space:]]*alert(/d' "$file"
    
    # Remove debugger statements
    sed -i '/[[:space:]]*debugger;/d' "$file"
    
    echo "  ✓ Cleaned: $file"
    ((cleaned_count++))
  else
    echo "  ⚠ Not found: $file"
  fi
done

echo ""
echo "✅ Cleaned $cleaned_count files"
echo ""

# Count after cleanup
after=$(grep -r "console\.log\|alert(" frontend/src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
removed=$((before - after))
echo "📊 Results:"
echo "  Before: $before statements"
echo "  After:  $after statements"
echo "  Removed: $removed statements"
echo ""

if [ $after -eq 0 ]; then
  echo "🎉 SUCCESS! All console.log and alert statements removed!"
else
  echo "⚠ Still $after statements remaining. Review manually:"
  grep -rn "console\.log\|alert(" frontend/src --include="*.ts" --include="*.tsx" 2>/dev/null
fi

echo ""
echo "💡 Backups created with .backup extension"
echo "   To restore: rm *.backup"
echo ""
echo "🔨 Next steps:"
echo "   1. Run: cd frontend && npm run build"
echo "   2. Test the application"
echo "   3. If OK, delete backups: find frontend/src -name '*.backup' -delete"
echo "   4. Commit changes"


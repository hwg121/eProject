import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function analyzeBundleSize() {
  const distPath = path.join(__dirname, 'dist');
  const assetsPath = path.join(distPath, 'assets');
  const jsPath = path.join(assetsPath, 'js');
  const cssPath = path.join(assetsPath, 'css');
  
  if (!fs.existsSync(assetsPath)) {
    console.log('❌ Build directory not found. Please run "npm run build" first.');
    return;
  }

  const jsFiles = fs.existsSync(jsPath) ? fs.readdirSync(jsPath) : [];
  const cssFiles = fs.existsSync(cssPath) ? fs.readdirSync(cssPath) : [];
  
  console.log('📊 Bundle Analysis Report');
  console.log('========================\n');
  
  // Analyze JS files
  console.log('📦 JavaScript Files:');
  let totalJSSize = 0;
  jsFiles.forEach(file => {
    const filePath = path.join(jsPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalJSSize += stats.size;
    console.log(`  ${file}: ${sizeKB} KB`);
  });
  
  // Analyze CSS files
  console.log('\n🎨 CSS Files:');
  let totalCSSSize = 0;
  cssFiles.forEach(file => {
    const filePath = path.join(cssPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalCSSSize += stats.size;
    console.log(`  ${file}: ${sizeKB} KB`);
  });
  
  // Total size
  const totalSize = totalJSSize + totalCSSSize;
  console.log('\n📈 Summary:');
  console.log(`  Total JS: ${(totalJSSize / 1024).toFixed(2)} KB`);
  console.log(`  Total CSS: ${(totalCSSSize / 1024).toFixed(2)} KB`);
  console.log(`  Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  if (totalSize > 500 * 1024) {
    console.log('  ⚠️  Bundle size is large (>500KB). Consider:');
    console.log('     - Code splitting');
    console.log('     - Tree shaking');
    console.log('     - Lazy loading');
  } else {
    console.log('  ✅ Bundle size is reasonable');
  }
  
  if (jsFiles.length > 10) {
    console.log('  ⚠️  Many JS chunks detected. Consider consolidating.');
  }
  
  console.log('  ✅ Use lazy loading for better performance');
  console.log('  ✅ Optimize images and use WebP format');
  console.log('  ✅ Enable gzip compression on server');
}

analyzeBundleSize();

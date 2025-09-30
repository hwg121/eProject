import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const deploy = () => {
  console.log('🚀 Starting deployment process...\n');

  // 1. Build the project
  console.log('📦 Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully\n');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  // 2. Copy files to frontend_public
  console.log('📁 Copying files to frontend_public...');
  const distPath = path.join(process.cwd(), 'dist');
  const publicPath = path.join(process.cwd(), '..', 'frontend_public');

  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  // Copy all files from dist to frontend_public
  const copyRecursive = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      fs.readdirSync(src).forEach(childItemName => {
        copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };

  copyRecursive(distPath, publicPath);
  console.log('✅ Files copied successfully\n');

  // 3. Copy web.config and .htaccess
  console.log('⚙️ Copying server configuration files...');
  const webConfigSrc = path.join(process.cwd(), 'web.config');
  const htaccessSrc = path.join(process.cwd(), '.htaccess');
  
  if (fs.existsSync(webConfigSrc)) {
    fs.copyFileSync(webConfigSrc, path.join(publicPath, 'web.config'));
  }
  
  if (fs.existsSync(htaccessSrc)) {
    fs.copyFileSync(htaccessSrc, path.join(publicPath, '.htaccess'));
  }
  console.log('✅ Server configuration copied\n');

  // 4. Generate deployment summary
  console.log('📊 Deployment Summary:');
  console.log('====================');
  
  const files = fs.readdirSync(publicPath, { recursive: true });
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));
  
  let totalSize = 0;
  files.forEach(file => {
    const filePath = path.join(publicPath, file);
    if (fs.statSync(filePath).isFile()) {
      totalSize += fs.statSync(filePath).size;
    }
  });

  console.log(`📦 Total files: ${files.length}`);
  console.log(`📄 JS files: ${jsFiles.length}`);
  console.log(`🎨 CSS files: ${cssFiles.length}`);
  console.log(`💾 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`📁 Deploy directory: ${publicPath}`);
  
  console.log('\n✅ Deployment completed successfully!');
  console.log('🌐 Ready to upload to server');
};

deploy();



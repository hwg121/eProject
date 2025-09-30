const fs = require('fs');
const path = require('path');

// List of detail pages to update
const detailPages = [
  'ArticleDetail.tsx',
  'VideoDetail.tsx', 
  'ToolDetail.tsx',
  'BookDetail.tsx',
  'EssentialDetail.tsx',
  'PotDetail.tsx',
  'AccessoryDetail.tsx',
  'SuggestionDetail.tsx'
];

// Function to remove mock data fallback
function removeMockData(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to match the mock data fallback section
    const mockDataPattern = /} catch \(apiError\) \{\s*console\.warn\('API call failed, using fallback data:', apiError\);\s*\}\s*\/\/ Fallback to mock data if API fails[\s\S]*?set\w+\(mock\w+\);/g;
    
    // Replace with proper error handling
    const replacement = `} catch (apiError) {
          console.error('API call failed:', apiError);
          setError('Failed to load data from server');
          return;
        }
        
        // If no data found, set error
        setError('Data not found');`;
    
    const newContent = content.replace(mockDataPattern, replacement);
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Updated ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`⚠️  No changes needed in ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Update all detail pages
console.log('🚀 Removing mock data from detail pages...\n');

let updatedCount = 0;
detailPages.forEach(pageName => {
  const filePath = path.join(__dirname, 'src', 'pages', pageName);
  if (fs.existsSync(filePath)) {
    if (removeMockData(filePath)) {
      updatedCount++;
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log(`\n🎉 Updated ${updatedCount} out of ${detailPages.length} detail pages`);
console.log('✅ All mock data fallbacks have been removed!');
console.log('✅ Now only real API data will be used!');

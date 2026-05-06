const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  "seed": "node seed-products-with-images.js",
  "seed:basic": "node seed.js",
  "seed:massive": "node seed-massive-products.js"
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json scripts');

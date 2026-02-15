const sharp = require('sharp');
const fs = require('fs');

console.log('Converting SVG to PNG...');

sharp('./resources/icon.svg')
    .resize(128, 128)
    .png()
    .toFile('./resources/icon-128.png')
    .then(() => {
        console.log('✅ PNG icon generated successfully!');
        const stats = fs.statSync('./resources/icon-128.png');
        console.log(`   Size: ${stats.size} bytes`);
    })
    .catch(err => {
        console.error('❌ Error generating PNG:', err.message);
        process.exit(1);
    });


const fs = require('fs');
const path = require('path');

// Criar diretório de ícones se não existir
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Criar diretório de screenshots se não existir
const screenshotsDir = path.join(__dirname, '../public/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Lista de tamanhos de ícones necessários
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('📱 Gerando ícones PWA...');

// Criar ícones placeholder (você deve substituir por ícones reais)
iconSizes.forEach(size => {
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // Criar um arquivo SVG placeholder que pode ser convertido para PNG
  const svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">CD</text>
</svg>`;

  // Salvar como SVG (você pode converter para PNG depois)
  fs.writeFileSync(iconPath.replace('.png', '.svg'), svgContent);
  console.log(`✅ Ícone ${size}x${size} criado`);
});

// Criar ícones de atalho
const shortcutIcons = ['dev-shortcut', 'func-shortcut'];
shortcutIcons.forEach(name => {
  const iconPath = path.join(iconsDir, `${name}.svg`);
  const svgContent = `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="96" height="96" rx="16" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">${name === 'dev-shortcut' ? 'DEV' : 'FUNC'}</text>
</svg>`;

  fs.writeFileSync(iconPath, svgContent);
  console.log(`✅ Ícone de atalho ${name} criado`);
});

console.log('📸 Criando screenshots placeholder...');

// Criar screenshots placeholder
const screenshots = [
  { name: 'desktop.png', width: 1280, height: 720 },
  { name: 'mobile.png', width: 390, height: 844 }
];

screenshots.forEach(screenshot => {
  const screenshotPath = path.join(screenshotsDir, screenshot.name);
  const svgContent = `
<svg width="${screenshot.width}" height="${screenshot.height}" viewBox="0 0 ${screenshot.width} ${screenshot.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${screenshot.width}" height="${screenshot.height}" fill="#1f2937"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">CDforge Screenshot</text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#9ca3af">${screenshot.width}x${screenshot.height}</text>
</svg>`;

  fs.writeFileSync(screenshotPath.replace('.png', '.svg'), svgContent);
  console.log(`✅ Screenshot ${screenshot.name} criado`);
});

console.log('🎉 Todos os arquivos PWA foram criados!');
console.log('📝 Próximos passos:');
console.log('1. Substitua os arquivos SVG por PNG reais');
console.log('2. Teste a instalação no Chrome DevTools');
console.log('3. Teste no iPhone usando Safari');


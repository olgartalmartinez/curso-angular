const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

async function generateTripticoPDF() {
  const imagesDir = path.join(__dirname, '..', 'images');
  const outputDir = path.join(__dirname, '..');
  
  // Convert images to base64 for embedding
  const qrCodeBuffer = await fs.readFile(path.join(imagesDir, 'qr-code.png'));
  const qrCodeBase64 = qrCodeBuffer.toString('base64');
  
  const coverBuffer = await fs.readFile(path.join(imagesDir, 'cover-pencil.png'));
  const coverBase64 = coverBuffer.toString('base64');
  
  // HTML content for the trifold brochure
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tríptico - Un mundo sin guerras es posible</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Source+Sans+Pro:wght@400;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        /* Page setup for A4 landscape with bleed */
        @page {
            size: 303mm 216mm; /* A4 landscape + 3mm bleed on all sides */
            margin: 0;
        }
        
        body {
            font-family: 'Source Sans Pro', Arial, sans-serif;
            width: 303mm; /* 297mm + 6mm bleed */
            height: 216mm; /* 210mm + 6mm bleed */
            position: relative;
            background: white;
        }
        
        /* Crop marks */
        .crop-marks {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .crop-mark {
            position: absolute;
            background: black;
        }
        
        /* Top-left */
        .crop-mark.tl-h { top: 0; left: 3mm; width: 5mm; height: 0.5pt; }
        .crop-mark.tl-v { top: 3mm; left: 0; width: 0.5pt; height: 5mm; }
        
        /* Top-right */
        .crop-mark.tr-h { top: 0; right: 3mm; width: 5mm; height: 0.5pt; }
        .crop-mark.tr-v { top: 3mm; right: 0; width: 0.5pt; height: 5mm; }
        
        /* Bottom-left */
        .crop-mark.bl-h { bottom: 0; left: 3mm; width: 5mm; height: 0.5pt; }
        .crop-mark.bl-v { bottom: 3mm; left: 0; width: 0.5pt; height: 5mm; }
        
        /* Bottom-right */
        .crop-mark.br-h { bottom: 0; right: 3mm; width: 5mm; height: 0.5pt; }
        .crop-mark.br-v { bottom: 3mm; right: 0; width: 0.5pt; height: 5mm; }
        
        /* Folding guides (light gray, non-printing) */
        .fold-guide {
            position: absolute;
            top: 3mm;
            height: 210mm;
            width: 0.25pt;
            background: #ccc;
            opacity: 0.3;
        }
        
        .fold-guide.first { left: 102mm; } /* 99mm + 3mm bleed */
        .fold-guide.second { left: 201mm; } /* 198mm + 3mm bleed */
        
        /* Main content area */
        .content {
            position: absolute;
            top: 3mm;
            left: 3mm;
            width: 297mm;
            height: 210mm;
            display: flex;
        }
        
        /* Panel structure */
        .panel {
            width: 99mm;
            height: 210mm;
            position: relative;
            border-right: 1px solid #f0f0f0;
        }
        
        .panel:last-child {
            border-right: none;
        }
        
        /* Panel derecho (portada) */
        .panel-right {
            background-image: url('data:image/png;base64,${coverBase64}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 15mm 10mm;
            position: relative;
        }
        
        .panel-right::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
                rgba(0,0,0,0.6) 0%, 
                rgba(0,0,0,0.3) 50%, 
                rgba(0,0,0,0.7) 100%);
        }
        
        .cover-content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        
        .main-title {
            font-family: 'Montserrat', Arial, sans-serif;
            font-weight: 900;
            font-size: 24pt;
            line-height: 1.2;
            margin-bottom: 8mm;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }
        
        .title-line {
            display: block;
        }
        
        .title-emphasis {
            font-size: 26pt;
            color: #ffd700;
        }
        
        .title-underline {
            width: 40mm;
            height: 2mm;
            background: #ffd700;
            margin: 5mm auto;
        }
        
        .subtitle {
            font-family: 'Source Sans Pro', Arial, sans-serif;
            font-size: 12pt;
            font-weight: 600;
            line-height: 1.3;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        }
        
        /* Panel central (anzuelo) */
        .panel-center {
            background: #f9f9f9;
            padding: 20mm 8mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .teaser-text {
            font-size: 14pt;
            line-height: 1.6;
            color: #333;
            text-align: justify;
            font-weight: 400;
        }
        
        /* Panel izquierdo (información + QR) */
        .panel-left {
            background: white;
            padding: 15mm 8mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .info-text {
            font-size: 13pt;
            line-height: 1.5;
            color: #444;
            text-align: justify;
            margin-bottom: 10mm;
        }
        
        .qr-section {
            text-align: center;
            margin-top: auto;
        }
        
        .qr-code {
            width: 40mm;
            height: 40mm;
            margin: 0 auto 5mm;
            display: block;
        }
        
        .qr-text {
            font-size: 10pt;
            color: #666;
            line-height: 1.4;
        }
        
        /* Print-specific styles */
        @media print {
            .fold-guide {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Crop marks -->
    <div class="crop-marks">
        <div class="crop-mark tl-h"></div>
        <div class="crop-mark tl-v"></div>
        <div class="crop-mark tr-h"></div>
        <div class="crop-mark tr-v"></div>
        <div class="crop-mark bl-h"></div>
        <div class="crop-mark bl-v"></div>
        <div class="crop-mark br-h"></div>
        <div class="crop-mark br-v"></div>
    </div>
    
    <!-- Folding guides -->
    <div class="fold-guide first"></div>
    <div class="fold-guide second"></div>
    
    <!-- Main content -->
    <div class="content">
        <!-- Panel izquierdo (información + QR) -->
        <div class="panel panel-left">
            <div class="info-text">
                Esta revista "Un mundo sin guerras es posible" explica por qué podemos estar seguros de que la paz mundial es posible y pronto será una realidad.
            </div>
            
            <div class="qr-section">
                <img src="data:image/png;base64,${qrCodeBase64}" alt="Código QR" class="qr-code">
                <div class="qr-text">
                    Escanee el código para leer la revista<br>
                    en formato digital en JW.org
                </div>
            </div>
        </div>
        
        <!-- Panel central (anzuelo) -->
        <div class="panel panel-center">
            <div class="teaser-text">
                ¿Se imagina un mundo sin guerras? La Biblia explica por qué, pese a los esfuerzos humanos, aún no se han erradicado. También muestra que pronto habrá paz mundial. ¿Le gustaría saber cómo?
            </div>
        </div>
        
        <!-- Panel derecho (portada) -->
        <div class="panel panel-right">
            <div class="cover-content">
                <h1 class="main-title">
                    <span class="title-line">Un mundo</span>
                    <span class="title-line">sin guerras</span>
                    <div class="title-underline"></div>
                    <span class="title-line title-emphasis">ES POSIBLE</span>
                </h1>
                
                <p class="subtitle">
                    Descubra por qué la paz mundial<br>
                    está más cerca
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
  
  // Generate PDF using Puppeteer
  console.log('Launching browser...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  console.log('Setting page content...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  console.log('Generating PDF...');
  const pdfPath = path.join(outputDir, 'triptico-una-cara-A4.pdf');
  
  await page.pdf({
    path: pdfPath,
    width: '303mm',
    height: '216mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    format: null // Use custom dimensions
  });
  
  await browser.close();
  
  console.log(`✓ PDF generated: ${pdfPath}`);
  return pdfPath;
}

// Generate SVG file
async function generateSVG() {
  const imagesDir = path.join(__dirname, '..', 'images');
  const outputDir = path.join(__dirname, '..');
  
  // Read images and convert to base64
  const qrCodeBuffer = await fs.readFile(path.join(imagesDir, 'qr-code.png'));
  const qrCodeBase64 = qrCodeBuffer.toString('base64');
  
  const coverBuffer = await fs.readFile(path.join(imagesDir, 'cover-pencil.png'));
  const coverBase64 = coverBuffer.toString('base64');
  
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="303mm" height="216mm" viewBox="0 0 1143.78 814.56" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <title>Tríptico - Un mundo sin guerras es posible</title>
  
  <!-- Definiciones -->
  <defs>
    <style>
      .title-font { font-family: 'Montserrat', Arial, sans-serif; font-weight: 900; }
      .body-font { font-family: 'Source Sans Pro', Arial, sans-serif; }
      .crop-mark { fill: black; }
      .fold-guide { stroke: #ccc; stroke-width: 0.5; opacity: 0.3; }
    </style>
    
    <!-- Gradiente para overlay de la portada -->
    <linearGradient id="coverOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:black;stop-opacity:0.6" />
      <stop offset="50%" style="stop-color:black;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:black;stop-opacity:0.7" />
    </linearGradient>
  </defs>
  
  <!-- Área de sangrado (fondo blanco) -->
  <rect width="100%" height="100%" fill="white"/>
  
  <!-- Marcas de corte -->
  <g class="crop-marks">
    <!-- Esquina superior izquierda -->
    <rect x="11.34" y="0" width="18.9" height="1.42" class="crop-mark"/>
    <rect x="0" y="11.34" width="1.42" height="18.9" class="crop-mark"/>
    
    <!-- Esquina superior derecha -->
    <rect x="1113.54" y="0" width="18.9" height="1.42" class="crop-mark"/>
    <rect x="1142.36" y="11.34" width="1.42" height="18.9" class="crop-mark"/>
    
    <!-- Esquina inferior izquierda -->
    <rect x="11.34" y="813.14" width="18.9" height="1.42" class="crop-mark"/>
    <rect x="0" y="784.32" width="1.42" height="18.9" class="crop-mark"/>
    
    <!-- Esquina inferior derecha -->
    <rect x="1113.54" y="813.14" width="18.9" height="1.42" class="crop-mark"/>
    <rect x="1142.36" y="784.32" width="1.42" height="18.9" class="crop-mark"/>
  </g>
  
  <!-- Guías de plegado -->
  <g class="fold-guides">
    <line x1="385.26" y1="11.34" x2="385.26" y2="803.22" class="fold-guide"/>
    <line x1="758.52" y1="11.34" x2="758.52" y2="803.22" class="fold-guide"/>
  </g>
  
  <!-- Área de contenido (sin sangrado) -->
  <g transform="translate(11.34, 11.34)">
    
    <!-- Panel izquierdo (información + QR) -->
    <g id="panel-left">
      <rect x="0" y="0" width="373.92" height="791.88" fill="white" stroke="#f0f0f0" stroke-width="1"/>
      
      <!-- Texto de información -->
      <foreignObject x="30" y="60" width="313" height="400">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Source Sans Pro', Arial, sans-serif; font-size: 13pt; line-height: 1.5; color: #444; text-align: justify;">
          Esta revista "Un mundo sin guerras es posible" explica por qué podemos estar seguros de que la paz mundial es posible y pronto será una realidad.
        </div>
      </foreignObject>
      
      <!-- Código QR -->
      <image x="166.96" y="500" width="150.75" height="150.75" xlink:href="data:image/png;base64,${qrCodeBase64}"/>
      
      <!-- Texto del QR -->
      <foreignObject x="50" y="670" width="273" height="100">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Source Sans Pro', Arial, sans-serif; font-size: 10pt; color: #666; text-align: center; line-height: 1.4;">
          Escanee el código para leer la revista<br/>en formato digital en JW.org
        </div>
      </foreignObject>
    </g>
    
    <!-- Panel central (anzuelo) -->
    <g id="panel-center">
      <rect x="373.92" y="0" width="373.92" height="791.88" fill="#f9f9f9" stroke="#f0f0f0" stroke-width="1"/>
      
      <!-- Texto del anzuelo -->
      <foreignObject x="404" y="300" width="313" height="400">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Source Sans Pro', Arial, sans-serif; font-size: 14pt; line-height: 1.6; color: #333; text-align: justify;">
          ¿Se imagina un mundo sin guerras? La Biblia explica por qué, pese a los esfuerzos humanos, aún no se han erradicado. También muestra que pronto habrá paz mundial. ¿Le gustaría saber cómo?
        </div>
      </foreignObject>
    </g>
    
    <!-- Panel derecho (portada) -->
    <g id="panel-right">
      <!-- Imagen de fondo con efecto lápiz -->
      <image x="747.84" y="0" width="373.92" height="791.88" xlink:href="data:image/png;base64,${coverBase64}" preserveAspectRatio="xMidYMid slice"/>
      
      <!-- Overlay oscuro -->
      <rect x="747.84" y="0" width="373.92" height="791.88" fill="url(#coverOverlay)"/>
      
      <!-- Contenido de la portada -->
      <g transform="translate(785, 120)">
        <!-- Título principal -->
        <text x="150" y="60" text-anchor="middle" fill="white" font-family="Montserrat, Arial, sans-serif" font-weight="900" font-size="24pt" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          <tspan x="150" dy="0">Un mundo</tspan>
          <tspan x="150" dy="30">sin guerras</tspan>
        </text>
        
        <!-- Línea subrayada -->
        <rect x="100" y="130" width="100" height="6" fill="#ffd700"/>
        
        <!-- Énfasis final -->
        <text x="150" y="180" text-anchor="middle" fill="#ffd700" font-family="Montserrat, Arial, sans-serif" font-weight="900" font-size="26pt" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          ES POSIBLE
        </text>
        
        <!-- Subtítulo -->
        <text x="150" y="250" text-anchor="middle" fill="white" font-family="Source Sans Pro, Arial, sans-serif" font-weight="600" font-size="12pt" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
          <tspan x="150" dy="0">Descubra por qué la paz mundial</tspan>
          <tspan x="150" dy="18">está más cerca</tspan>
        </text>
      </g>
    </g>
    
  </g>
</svg>`;

  const svgPath = path.join(outputDir, 'triptico-una-cara-outside.svg');
  await fs.writeFile(svgPath, svgContent);
  console.log(`✓ SVG generated: ${svgPath}`);
  return svgPath;
}

// Main execution
(async () => {
  try {
    console.log('Generating trifold brochure...');
    
    const pdfPath = await generateTripticoPDF();
    const svgPath = await generateSVG();
    
    console.log('\\n✅ Trifold brochure generated successfully!');
    console.log(`PDF: ${pdfPath}`);
    console.log(`SVG: ${svgPath}`);
    console.log('\\nFiles are ready for printing with 3mm bleed and crop marks.');
    
  } catch (error) {
    console.error('❌ Error generating brochure:', error);
    process.exit(1);
  }
})();
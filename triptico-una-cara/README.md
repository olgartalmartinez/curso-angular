# Tríptico "Un mundo sin guerras es posible"

## Descripción
Tríptico plegable en formato A4 apaisado con diseño profesional para impresión, incluyendo sangrado y marcas de corte.

## Estructura del proyecto

```
triptico-una-cara/
├── triptico-una-cara-A4.pdf          # PDF final con sangrado y marcas de corte
├── triptico-una-cara-outside.svg     # Archivo vectorial editable
├── images/                           # Imágenes procesadas
│   ├── cover-original.jpg            # Imagen de portada original
│   ├── cover-pencil.png              # Imagen con efecto lápiz
│   └── qr-code.png                   # Código QR
├── scripts/                          # Scripts de generación
└── README.md                         # Este archivo
```

## Especificaciones técnicas

### Formato
- **Tamaño final:** A4 (297 × 210 mm) orientación apaisada
- **Tamaño con sangrado:** 303 × 216 mm (3mm de sangrado por lado)
- **Paneles:** 3 paneles de 99mm cada uno (dentro del área de corte)
- **Guías de plegado:** 99mm y 198mm desde el borde izquierdo

### Contenido por panel

#### Panel derecho (portada)
- Imagen de portada con efecto "dibujo a lápiz"
- Título: "Un mundo sin guerras ES POSIBLE"
- Subtítulo: "Descubra por qué la paz mundial está más cerca"

#### Panel central (anzuelo)
- Texto: "¿Se imagina un mundo sin guerras? La Biblia explica por qué, pese a los esfuerzos humanos, aún no se han erradicado. También muestra que pronto habrá paz mundial. ¿Le gustaría saber cómo?"

#### Panel izquierdo (información + QR)
- Texto: "Esta revista 'Un mundo sin guerras es posible' explica por qué podemos estar seguros de que la paz mundial es posible y pronto será una realidad."
- Código QR con texto: "Escanee el código para leer la revista en formato digital en JW.org"

## Tipografía
- **Títulos:** Montserrat Black/Bold
- **Texto:** Source Sans Pro / Noto Sans
- **Fallback:** Arial/Helvetica

## Colores
- Paleta sobria con tonos neutros
- Acento azul/gris para elementos de apoyo
- Alto contraste para impresión

## Cómo regenerar el PDF

1. Instalar dependencias:
```bash
npm install puppeteer jimp
```

2. (Opcional) Regenerar imágenes placeholder:
```bash
node scripts/create-images.js
```

3. Ejecutar script de generación:
```bash
node scripts/generate-pdf.js
```

## Archivos generados

- ✅ `triptico-una-cara-A4.pdf` - PDF final de 1 página con sangrado 3mm y marcas de corte
- ✅ `triptico-una-cara-outside.svg` - Archivo vectorial editable con todos los elementos
- ✅ `images/cover-pencil.png` - Imagen de portada con efecto lápiz aplicado
- ✅ `images/qr-code.png` - Código QR placeholder
- ✅ `images/cover-original.jpg` - Imagen original de portada (placeholder)

## Especificaciones cumplidas

- ✅ Formato A4 apaisado (297×210mm) + sangrado 3mm (303×216mm total)
- ✅ 3 paneles de 99mm cada uno dentro del área de corte  
- ✅ Marcas de corte visibles en PDF
- ✅ Guías de plegado a 99mm y 198mm desde el borde izquierdo
- ✅ Panel derecho con imagen efecto lápiz + título "Un mundo sin guerras ES POSIBLE"
- ✅ Panel central con texto anzuelo (teaser)
- ✅ Panel izquierdo con información + QR en parte inferior
- ✅ Tipografías: Montserrat (títulos) y Source Sans Pro (texto)
- ✅ Diseño minimalista y profesional con alta legibilidad
- ✅ PDF de 1 sola página listo para impresión

## Notas de impresión
- El PDF incluye marcas de corte y sangrado de 3mm
- Exportado en alta calidad para impresión profesional
- Tipografías embebidas o convertidas a curvas
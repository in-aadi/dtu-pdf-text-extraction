import path from 'path';
const pdf = require('pdf-poppler');

export async function convertPDFToImages(pdfPath: string, outputDir: string) {
  const options = {
    format: 'png',
    out_dir: outputDir,
    out_prefix: 'page',
    page: null 
  };

  try {
    
    pdf.convert(pdfPath, options);
    console.log('✅ PDF pages converted to images successfully.');
  } catch (err) {
    console.error('❌ Error converting PDF to images:', err);
  }
}
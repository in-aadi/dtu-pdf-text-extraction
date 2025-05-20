import fs from 'fs';
import path from 'path';
import { extractTextFromPDF } from '../utils/extractTextFromPDF';
import { convertPDFToImages } from '../utils/pdfToImages';
import { extractTextFromImage } from '../utils/extractTextFromImages';
import { deleteFolderContents } from '../utils/deleteImages';

// Helper: Check if text is "empty" or mostly whitespace
function isTextEmpty(text: string): boolean {
  return !text || text.trim().length < 30;
}

export async function extractText(pdfPath: string) {
  console.log('🔍 Trying to extract text directly from PDF...');
  const directText = await extractTextFromPDF(pdfPath);

  if (!isTextEmpty(directText)) {
    console.log('✅ Extracted text directly from PDF!');
    console.log(directText);
    return;
  }

  console.log('⚠️ PDF has no readable text. Falling back to OCR...');

  // Step 1: Convert PDF to images
  const outputDir = path.resolve(__dirname, '..', 'images');
  const imageOutputDir = path.join(outputDir);
  await convertPDFToImages(pdfPath, imageOutputDir);
  
  await new Promise(res => setTimeout(res, 5000));

  // Step 2: Extract text from each image
  const imageFiles = fs.readdirSync(imageOutputDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  let ocrText = '';

  for (const file of imageFiles) {
    const imgPath = path.join(imageOutputDir, file);
    console.log(`🔎 Running OCR on ${file}...`);
    const text = await extractTextFromImage(imgPath);
    ocrText += `\n\n--- Page ${file} ---\n\n` + text;
  }
  console.log('✅ OCR-based text extraction completed.');
  console.log(ocrText);
  deleteFolderContents(imageOutputDir);
}
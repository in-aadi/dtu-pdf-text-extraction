import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';

export async function extractTextFromImage(imagePath: string): Promise<string> {
  const result = await Tesseract.recognize(imagePath, 'eng');
  return result.data.text.trim();
}

async function extractTextFromImagesInFolder(folderPath: string): Promise<void> {
  const files = fs.readdirSync(folderPath).filter(file =>
    /\.(png|jpg|jpeg)$/i.test(file)
  );

  if (files.length === 0) {
    console.error('❌ No image files found in:', folderPath);
    return;
  }

  for (const file of files) {
    const imagePath = path.join(folderPath, file);
    console.log(`\n🔍 Extracting from ${file}...`);
    try {
      const text = await extractTextFromImage(imagePath);
      console.log(`Text from ${file}:\n`, text.trim(), '\n'); 
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}
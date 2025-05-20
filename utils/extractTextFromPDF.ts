import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(pdfPath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text.trim();
}
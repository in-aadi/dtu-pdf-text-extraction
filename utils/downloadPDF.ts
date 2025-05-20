// utils/downloadPDF.ts
import fs from 'fs';
import fetch from 'node-fetch';

export async function downloadPDF(pdfUrl: string, outputPath: string): Promise<void> {
  const response = await fetch(pdfUrl);

  if (!response.ok) {
    throw new Error(`❌ Failed to download PDF: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  fs.writeFileSync(outputPath, buffer);
  console.log(`📥 PDF saved to ${outputPath}`);
}

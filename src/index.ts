import path from 'path';
import { getUnembeddedNotices } from "../utils/getUnembeddedNotices";
import { downloadPDF } from '../utils/downloadPDF';
import fs from 'fs';
import { extractText } from '../utils/extractText';
import { loadSampleData } from '../utils/embedText';
import { markNoticeAsEmbedded } from '../utils/markNoticeAsEmbedded';

async function main() {
  const notices = await getUnembeddedNotices();

  if (notices.length === 0) {
    console.log("✅ All notices are already embedded.");
    return;
  }

  for (const notice of notices) {
    console.log(`📄 Processing: ${notice.heading}`);
    console.log(`🔗 PDF: ${notice.pdfLink}`);
  }

  for (const notice of notices) {
    const fileName = `${notice.id}.pdf`;
    const pdfPath = path.resolve(__dirname, '..', 'pdfs', fileName);
    try {
      await downloadPDF(notice.pdfLink, pdfPath);
      const extractedText = await extractText(pdfPath); 

      if (!extractedText) {
        console.error(`❌ No text extracted from ${fileName}. Skipping...`);
        continue;
      }

      await loadSampleData(extractedText); 

      await markNoticeAsEmbedded(notice.id); // Update DB
      console.log(`✅ Processed and marked as embedded: ${notice.heading}`);
    } catch (err) {
      console.error(`❌ Failed to process ${notice.heading}:`, err);
    } finally {
      // Clean up PDF
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
        console.log(`🗑️ Deleted PDF: ${fileName}`);
      }
    }
  }
}

main();

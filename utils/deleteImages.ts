import fs from 'fs';
import path from 'path';

export function deleteFolderContents(folderPath: string): void {
  if (!fs.existsSync(folderPath)) return;

  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      deleteFolderContents(fullPath); // recursively delete subfolders
      fs.rmdirSync(fullPath);
    } else {
      fs.unlinkSync(fullPath); // delete file
    }
  }
}

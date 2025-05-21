import { db } from '../lib/db'; // adjust path based on your setup

export async function markNoticeAsEmbedded(id: string): Promise<void> {
  try {
    await db.notice.update({
      where: { id },
      data: { embedded: true },
    });
    console.log(`✅ Marked notice ${id} as embedded.`);
  } catch (err) {
    console.error(`❌ Failed to mark notice ${id} as embedded:`, err);
  }
}

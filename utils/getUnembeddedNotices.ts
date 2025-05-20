import { db } from '../lib/db';

export async function getUnembeddedNotices() {
  const notices = await db.notice.findMany({
    where: {
      embedded: false
    },
    orderBy: {
      uploadDate: 'desc'
    }
  });

  return notices;
}
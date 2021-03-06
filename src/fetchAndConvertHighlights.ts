import fetch from 'node-fetch';
import base64 from 'base-64';
import { promises as fsPromises } from 'fs';
import { DiigoBookmark, ReadwiseHighlight } from './types';
import { convertDiigoHighlightToReadwise } from './convertDiigoHighlightToReadwiseHighlight';

const convertDiigoBookmarksToHighlights = (bookmark: DiigoBookmark): ReadwiseHighlight[] => {
  return bookmark.annotations.map((highlight) => convertDiigoHighlightToReadwise(highlight, bookmark));
};

const getLastSyncDateFromFile = (timestampFileName: string) => {
  return fsPromises.readFile(timestampFileName, 'utf-8').then((lastSync) => {
    const lastSyncDate = new Date(lastSync);
    return lastSyncDate
  }).catch(() => {
    return undefined;
  })
}

const shouldBookmarkSync = (bookmark: DiigoBookmark, lastSyncDate: Date | undefined) => {
  if (!bookmark.annotations.length) return false;
  if (!lastSyncDate) return true;
  const DiigoUpdatedAt = new Date(bookmark.updated_at);
  return DiigoUpdatedAt > lastSyncDate;
}

const fetchAllBookmarks = async ({
  diigoApiKey,
  diigoUsername,
  diigoPassword,
  diigoFilterTags,
}: Omit<fetchAndConvertHighlightsArgObject, 'readwiseToken' | 'timestampFileName'>) => {
  let page = 0;
  const resultsPerPage = 100;
  let allBookmarks: DiigoBookmark[] = [];
  while (true) {
    let start = page * resultsPerPage;
    const diigoResponse = await fetch(`https://secure.diigo.com/api/v2/bookmarks?key=${diigoApiKey}&count=${resultsPerPage}&user=${diigoUsername}&filter=all&sort=1&tags=${diigoFilterTags}&start=${start}`, {
      headers: {
        Authorization: `Basic ${base64.encode(`${diigoUsername}:${diigoPassword}`)}`,
      },
    })
    const diigoBookmarks: DiigoBookmark[] = await diigoResponse.json();
    if (!diigoBookmarks.length) break;
    allBookmarks = allBookmarks.concat(diigoBookmarks);
    page++;
  }
  return allBookmarks;
}

interface fetchAndConvertHighlightsArgObject {
  diigoApiKey: string;
  diigoUsername: string;
  diigoPassword: string;
  diigoFilterTags: string;
  readwiseToken: string;
  timestampFileName: string;
}

export const fetchAndConvertHighlights = async ({
  diigoApiKey,
  diigoUsername,
  diigoPassword,
  diigoFilterTags,
  readwiseToken,
  timestampFileName,
}: fetchAndConvertHighlightsArgObject) => {
  const currentSyncDate = Date();
  const lastSyncDate = await getLastSyncDateFromFile(timestampFileName)
  const diigoBookmarks = await fetchAllBookmarks({
    diigoApiKey,
    diigoUsername,
    diigoPassword,
    diigoFilterTags,
  })
  const filteredDiigoBookmarks = diigoBookmarks.filter(bookmark => shouldBookmarkSync(bookmark, lastSyncDate));
  const highlights: ReadwiseHighlight[] = filteredDiigoBookmarks.map(convertDiigoBookmarksToHighlights).reduce((array, currentValue) => array.concat(currentValue), []);
  if (!highlights.length) return fsPromises.writeFile(timestampFileName, currentSyncDate)
  const readwiseResponse = await fetch('https://readwise.io/api/v2/highlights/', {
    method: 'POST',
    headers: {
      Authorization: `Token ${readwiseToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ highlights })
  })
  const readwiseBody = await readwiseResponse.json();
  console.log(readwiseBody);
  return fsPromises.writeFile(timestampFileName, currentSyncDate)
}

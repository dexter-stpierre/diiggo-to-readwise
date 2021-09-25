import fetch from 'node-fetch';
import base64 from 'base-64';
import { readFile } from 'fs/promises';
import { DiigoBookmark, ReadwiseHighlight } from './types';
import { convertDiigoHighlightToReadwise } from './convertDiigoHighlightToReadwiseHighlight';

const convertDiigoBookmarksToHighlights = (bookmark: DiigoBookmark): ReadwiseHighlight[] => {
  return bookmark.annotations.map((highlight) => convertDiigoHighlightToReadwise(highlight, bookmark));
};

interface fetchAndConvertHighlightsArgObject {
  diigoApiKey: string;
  diigoUsername: string;
  diigoPassword: string;
  readwiseToken: string;
}

export const fetchAndConvertHighlights = ({
  diigoApiKey,
  diigoUsername,
  diigoPassword,
  readwiseToken,
}: fetchAndConvertHighlightsArgObject) => {
  readFile('./lastSync.txt', 'utf-8').then((lastSync) => {
    // console.log(new Date(lastSync));
    // const lastSyncDate = new Date(lastSync);
    fetch(`https://secure.diigo.com/api/v2/bookmarks?key=${diigoApiKey}&count=100&user=${diigoUsername}&filter=all&sort=1&tags=test`, {
      headers: {
        Authorization: `Basic ${base64.encode(`${diigoUsername}:${diigoPassword}`)}`,
      },
    }).then(async (response) => {
      const bookmarks: DiigoBookmark[] = await response.json();
      return bookmarks;
    }).then((bookmarks) => {
      // convert array of arrays to a single array
      const highlights: ReadwiseHighlight[] = bookmarks.map(convertDiigoBookmarksToHighlights).reduce((array, currentValue) => array.concat(currentValue));
      return highlights;
    })
      .then(highlights => {
        return fetch('https://readwise.io/api/v2/highlights/', {
          method: 'POST',
          headers: {
            Authorization: `Token ${readwiseToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ highlights })
        }).then(response => {
          return response.json()
        }).then(response => {
          console.log(response)
        })
      })
  });
}

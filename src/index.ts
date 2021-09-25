import fetch from 'node-fetch';
import base64 from 'base-64';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { DiigoBookmark, ReadwiseHighlight } from './types';
import { convertDiigoHighlightToReadwise } from './convertDiigoHighlightToReadwiseHighlight';

dotenv.config();

const convertDiigoBookmarksToHighlights = (bookmark: DiigoBookmark): ReadwiseHighlight[] => {
  return bookmark.annotations.map((highlight) => convertDiigoHighlightToReadwise(highlight, bookmark));
};

readFile('./lastSync.txt', 'utf-8').then((lastSync) => {
  // console.log(new Date(lastSync));
  // const lastSyncDate = new Date(lastSync);
  fetch(`https://secure.diigo.com/api/v2/bookmarks?key=${process.env.DIIGO_API_KEY}&count=100&user=${process.env.DIIGO_USERNAME}&filter=all&sort=1&tags=test`, {
    headers: {
      Authorization: `Basic ${base64.encode(`${process.env.DIIGO_USERNAME}:${process.env.DIIGO_PASSWORD}`)}`,
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
          Authorization: `Token ${process.env.READWISE_TOKEN}`,
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

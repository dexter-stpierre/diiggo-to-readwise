import fetch from 'node-fetch';
import base64 from 'base-64';
import dotenv from 'dotenv';

dotenv.config();

console.log('this is working');
fetch(`https://secure.diigo.com/api/v2/bookmarks?key=${process.env.API_KEY}&count=100&user=${process.env.USERNAME}&filter=all`, {
  headers: {
    Authorization: `Basic ${base64.encode(`${process.env.USERNAME}:${process.env.PASSWORD}`)}`,
  },
}).then(async (response) => {
  const bookmarks = await response.json();
  console.log(bookmarks);
  debugger;
});

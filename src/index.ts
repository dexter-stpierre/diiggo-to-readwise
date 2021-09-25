import dotenv from 'dotenv';
import { fetchAndConvertHighlights } from './fetchAndConvertHighlights';

dotenv.config();

fetchAndConvertHighlights({
  diigoApiKey: process.env.DIIGO_API_KEY || '',
  diigoUsername: process.env.DIIGO_USERNAME || '',
  diigoPassword: process.env.DIIGO_PASSWORD || '',
  readwiseToken: process.env.READWISE_TOKEN || '',
  timestampFileName: '../lastSync.txt',
})

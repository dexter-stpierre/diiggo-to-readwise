import * as core from '@actions/core';
import base64 from 'base-64';
import { fetchAndConvertHighlights } from './fetchAndConvertHighlights';

const diigoApiKey: string = core.getInput('diigoApiKey');
const diigoUsername: string = core.getInput('diigoUsername');
const diigoPassword: string = core.getInput('diigoPassword');
const readwiseToken: string = core.getInput('readwiseToken');

async function run(): Promise<void> {
  try {
    core.setSecret(base64.encode(`${diigoUsername}:${diigoPassword}`));
    fetchAndConvertHighlights({
      diigoApiKey,
      diigoUsername,
      diigoPassword,
      readwiseToken,
    })
  } catch (error: any) {
    core.setFailed(error)
  }
}

run();

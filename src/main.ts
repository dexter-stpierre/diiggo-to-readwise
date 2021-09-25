import * as core from '@actions/core';
import { fetchAndConvertHighlights } from './fetchAndConvertHighlights';

const diigoApiKey: string = core.getInput('diigoApiKey');
const diigoUsername: string = core.getInput('diigoUsername');
const diigoPassword: string = core.getInput('diigoPassword');
const readwiseToken: string = core.getInput('readwiseToken');

async function run(): Promise<void> {
  try {
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

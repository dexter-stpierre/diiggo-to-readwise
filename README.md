# diiggo-to-readwise

This action syncs your [Diigo](https://www.diigo.com/index) highlights to [Readwise](https://readwise.io/) so you can review them, or have them synced to any of Readwise's export options

Here is a high-level overview of what this action does:
- Gets the last synced date from the file it is stored in your repository
- Downloads all of your Diigo bookmarks that match your `diigoFilterTags` selection
- Filters out bookmarks that haven't been updated since your last sync
- Converts the annotations in those bookmarks to match Readwise's data structure
- Saves highlights in Readwise
- Saves new last synced date to a file in your repository



## Prerequisits

- [Diigo](https://www.diigo.com/index) Premium account
- [Readwise](https://readwise.io/) account
- [Github](https://github.com/) account

## Setting up the sync

These are the steps for setting up the sync on a Github action

1. Get a [Diigo API key](https://www.diigo.com/api_dev/docs#section-key)
  - Name it something that tells you that you are using it for this
2. Get a [Readwise Access Token](https://readwise.io/access_token)
  - You won't be able to get back to this one, so make sure you keep it somewhere safe
3. [Create a new repository](https://docs.github.com/en/get-started/quickstart/create-a-repo)
4. Follow [this](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) guide to add secrets named "DIIGO_API_KEY", "DIIGO_USERNAME", "DIIGO_PASSWORD", and "READWISE_TOKEN" with their corresponding information
5. Create a file in your repo named ".github/workflows/main.yml".
  - This is the file that we will configure your syncing action
6. Copy and paste the following into the file:
```
name: Sync Diigo Highlights to Readwise
on:
  # This dictates when the sync will run. The default is every day at midnight. Here's a site that can help you fine tune your schedule: https://cron.help/examples
  schedule:
    -   cron: "0 0 * * *"
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  Sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Sync Diigo Highlights to Readwise
        # You may pin to the exact commit or the version.
        # uses: dexter-stpierre/diiggo-to-readwise@1362c38a71f01b3d780ae1439e2bf16004e7119b
        uses: dexter-stpierre/diiggo-to-readwise@0.1.0
        with:
          # Key used to access Diigo API
          diigoApiKey: ${{ secrets.DIIGO_API_KEY }}
          # Username used to login to your Diigo account
          diigoUsername: ${{ secrets.DIIGO_USERNAME }}
          # Password used to login to your Diigo account
          diigoPassword: ${{ secrets.DIIGO_PASSWORD }}
          # Token used to access Readwise API
          readwiseToken: ${{ secrets.READWISE_TOKEN }}

          # Additional options
          # Uncomment the following lines and fill in the values to change them
          # Comma seperated list of tags that you would like to sync to Readwise. Leave blank to sync all highlights. Example "readwise,favorite"
          # diigoFilterTags: # optional
          # Name of file in your repo to save last synced timestamp to
          # timestampFileName: # optional, default is lastSync.txt
      # This commits the updated lastSync file that contains the timestamp so we don't sync all your old highlights everytime
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Updated last sync file
```
7. Click "Commit new file" button
8. Click the "actions" tab and you should see the action running or complete
9. Click the "watch" button at the top of this repo so you can get notified when I make updates. To get only the most important updates I recommend doing a custom watch and only select "releases" to only get the notifications of new versions along with a guide to upgrade.

If you would like to sync your highlights outside of your schedule click "Sync Diigo Highlights to Readwise" in the "Actions" tab and click the run workflow button.

### Help, something didn't work!!

First, remember to breathe. This isn't an easy thing to set up, especially if it is your first time. Feel free to just make another new repo and re-follow the instructions if you believe you missed a step. If that doesn't work feel free to [Submit an issue](https://github.com/dexter-stpierre/diiggo-to-readwise/issues/new) or reach out to me on [Twitter](https://twitter.com/dexthe_dev)

## What's next for this project?

Check out the v1.0.0 [project board](https://github.com/dexter-stpierre/diiggo-to-readwise/projects/1) for the list of upgrades that are planned for the first major version. If you have some programming chops, or want to get some practice contributing to open source projects feel free to volunteer for any of those tasks! Also please submit a PR if you notice any errors or have improvements to the code.

## How can I show my appreciation?

I am so glad that my work has benefitted you! Feel free to follow/dm me on [Twitter](https://twitter.com/dexthe_dev). If you would like to support me finanially so I can make more time to work on projects like this I accept tips through [Ko-fi](https://ko-fi.com/dexthe_dev).

## Building on the backs of others

I wanted to give a shout out to a few people:
- Readwise and Diigo for making great tools that are worth building an ecosystem of tools around
- Github for their awesome docs and examples that always had the answers when I needed them
- [Matthieu Bizien](https://twitter.com/Matthieu_Bizien) who wrote a github action that automatically backsup Roam. Gave me the idea of this approach, and copied many ideas from his workflow
- [Mela Eckenfels](https://twitter.com/Felicea) for responding to a 4 month old tweet asking if anyone would be interested in a tool like this. Gave me the motivation to dedicate the better part of a weekend to it
- You, for using this tool. It brings me such a sense of pride to know that people are using something I built

## Disclaimers

This tool uses [Github Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions). It is important to understand that you will be running code written by me. Always make sure that you can trust the person who's code you are running. By the nature of this tool you are giving the code access to read and write to your accounts. I promise to be responsible with this code. This project will follow [Semantic Versioning](https://semver.org/) and will not deploy breaking changes in minor or patch versions, so feel free to lock in on the major version level

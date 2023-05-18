# Daily Commit of Shame

![You vs the guy she tells you not to worry about](./readme/meme.jpg)

It is time to become the other guy. This simple Next app will run a CRON job every night at 11:00pm (roughly, Vercel doesn't guarantee on time execution on lower pricing tiers), if you haven't made a commit it will create a issue for you on a repo. Since issues count as commits you will never miss another day, but they are public, so everyone will know your shame.

## Setup

1. Fork this repo.
2. Update the `vercel.json` CRON to be 11PM UTC in your timezone. Just change the `0 13 * * *` to be the time you want. It is currently set up to run at 11PM AEST.
3. Create a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `repo` scope (classic token is fine). The expiration time is up to you. Make sure you copy with somewhere.
4. Go to Vercel and create a new project, connect it to your forked repo.
5. Set the environment variable `GITHUB_TOKEN` to the token you created in step 2.
6. Set the environment variable `GITHUB_REPO` to the repo you want to commit to. This would be the name of your fork repo.
7. Set the environment variable `GITHUB_OWNER` to the owner of the repo you want to commit to. This is usually your username.
8. Deploy the project.
9. Pray it still works.

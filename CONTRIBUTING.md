# Contributing to LibraFlow

First off, thank you for considering contributing to LibraFlow! It's people like you that make LibraFlow such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork LibraFlow and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-graphql-support
```

## Install dependencies and run locally

Follow the instructions in the `README.md` to get the project up and running locally using Docker Compose or Node.js directly.

## Make a pull request

At this point, you should switch back to your master branch, make sure it's up to date with LibraFlow's master branch:

```sh
git remote add upstream git@github.com:yourusername/libraflow.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-graphql-support
git rebase master
git push --set-upstream origin 325-add-graphql-support
```

Finally, go to GitHub and make a Pull Request.

## Code Style

This project uses Prettier and ESLint. Please ensure your code passes the linters before submitting a PR.

```sh
npm run lint
```

---
title: "Swamp in action - Finding relevant branches in git"
canonicalUrl: https://blog.algogrit.com/posts/2018-03-27-swamp-in-action
license: all-rights-reserved
tags: git,utility,multiple-branches
published: true
---

I had written a small script sometime in 2014 for me to separate out the stale branches from the most relevant branches in a git repository.

Today, I was working on a bunch of repositories. I wanted to figure out the recent most branches, and their relevance in relation to master. It hit me out of nowhere and I remembered the script I had written earlier.

First, see the script in action:

![Listing][SwampInActionGif]

Alternatively, you can view it on [asciinema][AsciinemaLink].

# Analysis

Right off the bat, I can see that

![Listing][SwampInActionPng]

### 4 branches are all merged into master (+0) already.

  ```
    origin/hackathon
    origin/cloudFirestoreTest
    origin/beta
    origin/dev
  ```

I could probably [`nuke`][GitNuke] a few of these branches.

### The branches being actively worked on are:

  ```
    origin/robertoscaramuzzi-text-form-field-autovalidate
    origin/revert-15819-fix_test_flakiness
  ```

  and probably

  ```
    origin/dev
  ```

All right. Now I know which branch I want to branch off of.

# How to install?

A quick and easy install is using this [gist][InstallSwampGist]:

```bash
curl https://gist.githubusercontent.com/algogrit/3fd5b9ca88dd08ec5f6ce4d5e2c4c719/raw | sh
```

The content of the install script is simply:

```bash
#!/usr/bin/env bash

mkdir -p /usr/local/bin
curl -s https://raw.githubusercontent.com/algogrit/Script-BackUp/swamp-0.3/OS%20X/Custom-Git-Commands/git-swamp > /usr/local/bin/git-swamp
chmod 744 /usr/local/bin/git-swamp
```

If you have /usr/local/bin in your PATH already, then you can starting using it as:

```bash
git swamp
```

I hope you find it as useful as the fun I had in writing it.

[SwampInActionGif]: https://blog.algogrit.com/assets/gifs/02-swamp-in-action.gif
[SwampInActionPng]: https://blog.algogrit.com/assets/images/02-swamp-in-action.png
[AsciinemaLink]: https://asciinema.org/a/172856
[GitNuke]: https://github.com/algogrit/Script-BackUp/blob/master/OS%20X/Custom-Git-Commands/git-nuke
[GitBranchingModel]: http://nvie.com/posts/a-successful-git-branching-model/
[InstallSwampGist]: https://gist.github.com/algogrit/3fd5b9ca88dd08ec5f6ce4d5e2c4c719

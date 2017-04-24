---
title: "To rebase or not to rebase?"
layout: Post
date: 2017-02-18
---

So, me and Pavan (my colleague and friend at TarkaLabs) were discussing on how to handle the different scenarios he has faced while working with git. He would find himself in position where he isn't sure if he should do a `git merge` or `git rebase`. Sometimes he would do the other causing a state where the branch needs to be force pushed `git push -f`!

Below is a short excerpt from the conversation:

`Pavan:` Dude, I have a few commits in master which I want in develop as well. These were done during our last deployment. Do you think we should run `git merge master` or `git rebase master`?

`Me:` Let me see the status of both the branches.

  ```bash
    $ git status
  ```

  ```
  On branch develop
  Your branch is up-to-date with 'origin/develop'.
  nothing to commit, working tree clean
  ```

  ```bash
    $ git checkout master ; git status
  ```

  ```
  On branch master
  Your branch is up-to-date with 'origin/master'.
  nothing to commit, working tree clean
  ```

  ```bash
    $ git log master..develop --oneline | wc -l // List commits which are only in the develop branch and not in master
  ```

  ```
    6
  ```

  ```bash
    $ git log develop..master --oneline | wc -l // List commits which are only in the master branch and not in develop
  ```

  ```
    4
  ```

`Me (cont):` Looks like we have different sets of commits both in `master` and `develop` branches. I would suggest to do a `git merge master`.


`Pavan:` Alright. Will I have to deal with conflicts?

`Me (after inspecting the git logs):` Probably. The conflicts will arise from the commits in the master branch.


`Pavan:` How about I do a `git rebase master`?

`Me:` Well you could! I would not recommend doing that cause it will rewrite history of develop branch, which on its own is not that bad. But in this case remote `origin/develop` is caught up with the local copy of the `develop` branch.


`Pavan:` So?

`Me:` So, the thing is once you run the rebase command, git will think that there are commits in remote `origin/develop` which you haven't pulled in. Also you will have to push the rewritten commits from your local `develop` branch. It will result in total mess. Unless you are going to force push this, which just moves the issue to other developers in the team.


`Pavan:` Can you explain it more clearly?

`Me:` Sure. Let me draw the state which we are in currently.

```
  ---0---1---M1---M2---M3---M4---M5---M6 (master & origin/master are on par)
          \
           \
            1---D1---D2---D3---D4 (develop & origin/develop are on par)
```

`Pavan:` Got it.

`Me:` Now let's see the state we will be in once we run the `git rebase` command and fixing any merge conflicts.

```
  ---0---1---M1---M2---M3---M4---M5---M6 (master & origin/master are on par)
          \                            \
           \                            \
            \                            M6---RD1---RD2---RD3---RD4 (develop)
             \
              \
               1---D1---D2---D3---D4 (origin/develop)
```

`Pavan:` What!? Where did the RD1, ... all come from?

`Me:` Yeah! Let's first look at what happens roughly when you run `git rebase` as a pseudocode:
  - Checkout head of master branch
  - Pick all the commits only in develop branch (D1, D2, D3, D4)
    - For each of the commits, perform a cherry-pick operation
      - Incase of conflicts, wait for the user to resolve or skip this commit
      (This step basically changes the commit hash, so your D1 becomes RD1)


`Pavan:` Ah! I see. So git now cannot identify RD1 and D1 as the same commits anymore. Rebase seems like a sure shot way of shooting yourself in the foot.

`Me:` Well not precisely. We do perform a rebase operation each time we do a `git pull --rebase`. Here we are rebasing the `origin/{branch-name}` to `{branch-name}`. Git does it seemlessly for us. Moreover, as you have seen earlier this causes git to show conflicts only due to the code in our local branch. i.e.) the code which you wrote; making the whole process of conflict resolution simply to identify the changes which need to done to our code.


`Pavan:` Oh yeah definitely. So rebase is good for local changes?

`Me:` Not only local changes. You can feel free to perform a rebase operation when rewriting history will not cause other developers to rewrite history in their copies.
For eg. when you are solo developing a feature, you can feel free to do a rebase with `develop` to get the changes from `develop` branch onto the feature branch. This way you are only merging back the changes for the feature into the develop branch. In fact, this is the recommended way to avoid creating a confusing history.


`Pavan:` Cool. Sounds great. Thanks for the explanation.

`Me:` No problem. And thank you, you just gave me a great idea for a blog post.

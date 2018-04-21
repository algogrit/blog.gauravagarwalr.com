---
title: Introducing git multi
canonicalUrl: https://blog.gauravagarwalr.com/posts/2013-07-30-intro-to-git-multi/
license: all-rights-reserved
tags: git,utility
published: true
---

Hiya there,

Did you ever need to manage a number of git repositories for your project? It can be cumbersome when the number of repositories you are dealing with day-to-day increases beyond a number. For eg, in my current day job, I am working with atleast 5 different git managed repositories. Now knowing which repository is in which state, and if the remote HEAD of the repos has diverged with the local, can become a bit painful to track if you have to cd into each of those directories and check for the status, or even poll for the latest changes. To avoid some of these common pitfalls, you might find git-multi (currently, tested only on Mac OS X), which is a pure shell utility useful.

For eg:

```bash
$ git multi remote update
$ git multi status
$ git multi pull --rebase
```

Are all supported commands, which will first list out all the git managed repos within the current directory and will execute the command you specify, say 'status' on each of those repos. You can basically execute any git command on all the repos under the current directory.

For a __simple installation__, run:

```bash
$ curl https://gist.github.com/gauravagarwalr/6080309/raw/0d5fe1455df13be1d7a667a9ecccf7fd13d4f0b3/install_git-multi.sh | sh
```

To manually do the above installation, you can follow the below steps:

```bash
$ mkdir -p ~/bin
$ curl https://raw.github.com/gauravagarwalr/Script-BackUp/master/OS%20X/Custom-Git-Commands/git-multi > ~/bin/git-multi
$ chmod 744 ~/bin/git-multi
```

And add the following to your shell load scripts (.bashrc/.bash_profile for Bash shell or .zshrc/.zprofile for Zsh shell).

```bash
export PATH=~/bin:$PATH
```

Of course, there is a built-in help to the command, which you can get lesser info using:
```bash
$ git multi help
```

The code is currently being managed [here][github]. I guess at some point in time I would be moving it out of the current repo, and give it a proper repo, along with the other shell utils.

[github]: https://github.com/gauravagarwalr/Script-BackUp/blob/master/OS%20X/Custom-Git-Commands/git-multi

---
title: "Bash - n things you didn't know"
layout: Post
date: 2018-06-16
tags: bash
---

This is a post I have been meaning to write for a long time now and have been procrastinating on it.

These are quirks, lessons, learnings from using Bash over the course of 6 years. I am distilling and highlighting some of the surprising (and not so surprising) features of Bash, especially for `zsh` folks who didn't know `bash` could do stuff.

So let's get on with...

# Ghost in the shell

How do your executables in bash get run without you specifying the full path to it? If I write a program with the same name will that get run? How? Why?

## Enter `$PATH` variable

> > The PATH environment variable is a colon-delimited list of directories that your shell searches through when you enter a command.[<sup>1</sup>][PATH_Definition]

You have the definition... Let me show you what the `$PATH` on my machine looks like:

```bash

  $ echo $PATH
/Users/gaurav/bash_scripts/bin:/Users/gaurav/bin:/Users/gaurav/Custom-Git-Commands:/Users/gaurav/Developer/experimental/sdk/flutter/bin:/usr/local/share/android-sdk/tools:/usr/local/share/android-sdk/tools/bin:/usr/local/share/android-sdk/platform-tools:/Users/gaurav/.jenv/shims:/Users/gaurav/.jenv/bin:/Users/gaurav/.goenv/shims:/Users/gaurav/.goenv/bin:/usr/local/Cellar/pyenv-virtualenv/1.1.3/shims:/Users/gaurav/.pyenv/shims:/Users/gaurav/.nodenv/shims:/Users/gaurav/.nodenv/bin:/usr/local/var/rbenv/shims:/usr/local/opt/python/libexec/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/opt/X11/bin:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Wireshark.app/Contents/MacOS
```

Whew! I have quite a lot of directories in my PATH. Let's view the content of a few of them:

![PATH][BashPATHGif]

Alternatively, you can view it on [asciinema][BashPATHGifAC].

I have modified `ls` so it prints out executables in red color with a `*`. I will get to how I did that in a moment.

All the executables in all of the directories in the `PATH` environment variable are now available for me to type without qualifying it with the directory.

* Q: What happens if I have 2 programs with the same name in different directories?

  > When a command name is specified by the user or an exec call is made from a program, the system searches through $PATH, examining each directory from left to right in the list, looking for a filename that matches the command name. Once found, the program is executed as a child process of the command shell or program that issued the command.[<sup>2</sup>][PATH_Behavior]

This simply means that the command in the first directory gets executed.

This brings us to...

## Wrapping your head around wrapping executables



[PATH_Definition]: https://kb.iu.edu/d/acar
[BashPATHGif]: https://blog.gauravagarwalr.com/assets/gifs/03-bash-paths.gif
[BashPathGifAC]: https://asciinema.org/a/iOnUcPLwGtKHeoDOGLnmpTl1G
[PATH_Behavior]: https://en.wikipedia.org/wiki/PATH_(variable)#Unix_and_Unix-like

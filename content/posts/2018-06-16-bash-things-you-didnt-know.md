---
title: "Bash - n things you didn't know"
layout: Post
date: 2018-10-19
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

## `which` command

From the `man` page

> > which -- locate a program file in the user's path

`which` command basically finds the exact location of an executable in one's `$PATH` variable. Using `which` you can also figure out multiple executables with same name in your `$PATH` and their respective location.

For eg, on my machine `git` is located in:

```bash
  $ which -a git
/usr/local/bin/git
/usr/bin/git
```

Now, when I run `git` command, the executable from the first location gets picked up and executed.

## `PS1` variable

What does the `$PS1` variable look in my machine?

```bash
  $ echo $PS1
\[\033[1;36m\]\w:$(parse_git_branch) $ \[\033[0m\]
```

Uh what? Let's try and decode each part:

  * `\[\033[1;36m\]`...`\[\033[0m\]`

  This part sets the prompt color to be in cyan. You can read more about it [here][BashColors]. From [SO][BashEscapeSequence],

> > The \033 is the escape character, and those sequence are not bash specific but interpreted by the terminal (software or hardware (via network or serial line)) in which the (bash) program runs. There are many such sequences.

  * `\w`

  This sequence gets the current working directory path.

  * `$(parse_git_branch)`

  As the name suggests, it gets the current branch name along with a status indicator. So what is `parse_git_branch`?

```bash
  $ type parse_git_branch
parse_git_branch is a function
parse_git_branch ()
{
    echo "$(__git_ps1)"
}
```

  * `$`

  This is just a silly little delimiter I have added to make it more bashy.

All right, got it? But what does the `PS1` variable actually do?

`PS1` is one of the few [**P**rompt **S**tatement variables][PromptStatementVariable]. The rest are numbered from 2-4. `PS1` being the default interactive prompt. It controls the output on the screen before the cursor (before anything has been typed).

On my terminal, based on the above `PS1` value it outputs `~/Developer/Gaurav/blog.gauravagarwalr.com/project-resources: (blog +) $`, in cyan, of course!

## `exec bash`

The `exec` builtin is used to replace the current process with the invoked - shell/script/program. When the invoked process exits, the terminal exits as well.

[PATH_Definition]: https://kb.iu.edu/d/acar
[BashPATHGif]: https://blog.algogrit.com/assets/gifs/03-bash-paths.gif
[BashPathGifAC]: https://asciinema.org/a/iOnUcPLwGtKHeoDOGLnmpTl1G
[PATH_Behavior]: https://en.wikipedia.org/wiki/PATH_(variable)#Unix_and_Unix-like
[BashColors]: http://tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html
[BashEscapeSequence]: https://unix.stackexchange.com/a/116244/26799
[PromptStatementVariable]: https://ss64.com/bash/syntax-prompt.html

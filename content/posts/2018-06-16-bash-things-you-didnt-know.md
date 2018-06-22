---
title: "Bash - n things you didn't know"
layout: Post
date: 2018-06-16
tags: bash
---

This is a post I have been meaning to write for a long time now and have been procrastinating it.

These are quirks, lessons, learnings from writing a few scripts over the course of 6 years. I am distilling and highlighting some of the surprising lessons of Bash (especially for `zsh` folks who didn't know `bash` could do stuff).

So let's get on with...

# Ghost in the shell

How do your executables in bash get run without you specifying the full path to it? If I write a program with the same name will that get run? How? Why?

Enter `$PATH` variable

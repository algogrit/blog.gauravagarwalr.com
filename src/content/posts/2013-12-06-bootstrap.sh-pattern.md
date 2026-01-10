---
title: "Bootstrap.sh Pattern"
date: 2013-12-06
tags: setup, devops, utility, bash
excerpt: ./bootstrap.sh — one script to check dependencies, install what’s needed, and run your app. This post explains why every project should have one.
---

*"If I have seen further it is by standing on ye sholders of Giants"* - **Issac Newton**

***Recently,***

I have incorporated the practice of writing a executable bash script each time I am on a new project. The script is basically a collection of commands which I used while I was 'bootstrapping' my machine to get the application up and running.

The **reason** I scripted these small tasks, was to (not in any particular order):

- Make it easier for new people to setup their system by running the script
- Create a reference, for me, to setup the project, long after it was created (probably in a new machine)
- If maintained properly, it will let me effortlessly not disturb any of my coworkers' workflow (like adding/replacing a search engine, can be done by starting up the new search engine instead of old one)
- Standardize it across all the different applications we need to run
- Have a one liner to start my application

		./bootstrap.sh

So **what** really is this file about?

The bootstrap.sh/go.sh is intended for use by *developers*<sup>[1]</sup> to provided a automated step by step guide on how to get the application running on their system.

**How** do we structure such a file?

The way I usually structure it is based on the exact purpose, like:

- Check for external dependencies
- Setting up the language and libraries with right versions / custom configurations
- *Actually*, booting up the server (and in some cases even the dependent services)

There exists a similar file for this site as well. You can curl from [here](/bootstrap.sh).

# The Code

### bootstrap.sh

```bash
#!/usr/bin/env bash
which rbenv
is_rbenv_present=$?

if [ $is_rbenv_present -ne 0 ]; then
	echo "Please install rbenv and proceed."
	exit 1
else
	set -e
	./scripts/setup.sh
	./scripts/run.sh
fi
```

This is the master file, and is the only file expected to be invoked directly by the user. The only necessary external dependency I am expecting to be full-filled is the rbenv, which is a version/environment manager for the ruby language (RVM is the more widely used one, but it has its own issues, on which I will discuss later).

The script does not go ahead and install the version manager, if not found, but rather gives the option to the user as to how, and if, it should be installed. There are multiple strong reasons to not auto install the external dependencies, unless you want to write a full blown dependency management system (*think* Chef/Puppet).

### scripts/setup.sh

```bash
#!/usr/bin/env bash

rbenv versions | grep `cat .ruby-version` | grep '*'

if [ $? -ne 0 ]; then
	echo "Installing the required ruby version..."
	rbenv install $1
fi

echo "Installing the required gems..."
bundle
```

This is the script invoked when, the external dependencies are satisfied. Here the idea is to check if the right ruby version is installed and currently in use. Next, it tries to install it, if not found. And then it uses the bundle gem to resolve and install the dependencies as listed in the `Gemfile`.

### scripts/run.sh

```bash
#!/usr/bin/env bash

jekyll serve -w
```

For this application, this is the shortest script and is really a one liner. But, for more complicated projects, I would perhaps check if the right configuration settings have been made, start the database server and all the other standard tools which the application depends on during run time.

# Conclusion

The intent for writing this blog post, for me, was to convince more people to write simple scripts to ease up the work for other people, and themselves. The concept of `bootstrap.sh` even fits well and even complements the workflow where you already have dependency management systems and/or provisioners.

<sub>
[1] Anyone who needs to run the application on their own machine, like QAs, Developers, Designers
</sub>

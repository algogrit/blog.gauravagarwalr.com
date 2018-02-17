---
title: "Migrating from glide to dep: Golang"
layout: Post
date: 2018-02-17
tags: go, glide, dep, package-manager
---

I had started using [glide][GlidePackage] when I initially started learning Go. Since then, I have moved to [dep][Dep].

In an existing project, with dependencies managed by glide, an easy way to switch to dep is to run:

```bash
  $ dep init
```

```
  Importing configuration from glide. These are only initial constraints, and are further refined during the solve process.
  Detected glide configuration files...
  Converting from glide.yaml and glide.lock...
    Using ^1.6.0 as initial constraint for imported dep github.com/gorilla/mux
    Trying v1.6.1 (53c1911) as initial lock for imported dep github.com/gorilla/mux
    Using ^1.0.0 as initial constraint for imported dep github.com/jinzhu/gorm
    Trying v1.0 (5174cc5) as initial lock for imported dep github.com/jinzhu/gorm
    Trying * (94eea52) as initial lock for imported dep golang.org/x/crypto
    Trying master (5493cab) as initial lock for imported dep github.com/auth0/go-jwt-middleware
    Using ^3.1.0 as initial constraint for imported dep github.com/dgrijalva/jwt-go
    Trying v3.1.0 (dbeaa93) as initial lock for imported dep github.com/dgrijalva/jwt-go
    Using ^0.3.0 as initial constraint for imported dep github.com/urfave/negroni
    Trying v0.3.0 (5dbbc83) as initial lock for imported dep github.com/urfave/negroni
    Using ^1.2.0 as initial constraint for imported dep github.com/rs/cors
    Trying v1.2 (7af7a1e) as initial lock for imported dep github.com/rs/cors
    Using ^1.4.0 as initial constraint for imported dep github.com/onsi/ginkgo
    Trying v1.4.0 (9eda700) as initial lock for imported dep github.com/onsi/ginkgo
    Using ^1.3.0 as initial constraint for imported dep github.com/onsi/gomega
    Trying v1.3.0 (003f63b) as initial lock for imported dep github.com/onsi/gomega
    Trying master (08b5f42) as initial lock for imported dep github.com/gorilla/context
    Trying master (1c35d90) as initial lock for imported dep github.com/jinzhu/inflection
    Trying * (83612a5) as initial lock for imported dep github.com/lib/pq
    Locking in  (94eea52) for direct dep golang.org/x/crypto
    Locking in v2 (d670f94) for transitive dep gopkg.in/yaml.v2
    Locking in master (4e4a321) for transitive dep golang.org/x/text
    Locking in master (37707fd) for transitive dep golang.org/x/sys
    Using master as constraint for direct dep github.com/auth0/go-jwt-middleware
    Locking in master (5493cab) for direct dep github.com/auth0/go-jwt-middleware
    Locking in master (136a25c) for transitive dep golang.org/x/net
  Old vendor backed up to /Users/gaurav/.goenv/src/github.com/gauravagarwalr/Yet-Another-Expense-Splitter/_vendor-20180217215249
```

This creates a couple of new files and a backup of the vendor directory.

```bash
  $ git status

  Untracked files:
    (use "git add <file>..." to include in what will be committed)

    Gopkg.lock
    Gopkg.toml
    _vendor-20180217215249/

  nothing added to commit but untracked files present (use "git add" to track)
```

Check if the project builds/runs successfully. Once it does, now you can remove the `glide.*` files and the backed up `_vendor-*` directory. That's all folks.


[GlidePackage]: https://glide.sh/
[Dep]: https://github.com/golang/dep

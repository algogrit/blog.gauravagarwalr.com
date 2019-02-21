---
title: "Learn go series: Part IV - Project Structuring"
layout: Post
date: 2018-01-14
tags: learn-go-series, go, organizing, project-structure
---

This is **Part 4** of "**Learn go**" series. You can find the previous post [here][LearnGoPartIII].

As a beginner to Golang, it was relatively painful to figure out an ideal project structure where code isn't dumped into one single file or package even. This post sums up my learnings to keep things simple by splitting project across multiple files and packages.

This post **does not** pick up from the previous posts [Part I][LearnGoPartI], [Part II][LearnGoPartII] and, [Part III][LearnGoPartIII].

All of the code from this series can be found in [this repository][YAES-API].

# Directory listing

![Listing][ProjectStructGif]

Alternatively, you can view it on [asciinema][AsciinemaLink].

# Packages

I have defined 4 packages in total, including `main` in this project. Let me list out all the 4 packages and the corresponding files.

### main

  ```
    ./main.go
  ```

Contains the `main` function which calls the initialization code for db and starts the server. It also is responsible for reading environment variables and passing them to the appropriate functions.

### api

  ```
    ./src/api/api.go
    ./src/api/expense.go
    ./src/api/payable.go
    ./src/api/user.go
  ```

`api.go` contains the glue code for routers, handlers and middleware. It gets port number from `main`. The other files contain code handlers for the particular domain model as evident from the name of file.

### db

  ```
    ./src/config/db/db.go
  ```

Contains logic for db connection and migration. It exposes `InitializeDB` and `Instance` functions. `Instance` is used to access the db instance as created by the call to `InitializeDB` in main function.

### model

  ```
    ./src/models/expense.go
    ./src/models/payable.go
    ./src/models/user.go
  ```

These files contain the domain model's type definitions. Apart from this the `user.go` file contains additional functions which are relevant only to the `User` type.

# Importing

All of the packages can be imported except main as follows:

```golang
import {
  api "github.com/algogrit/yaes-server/src/api"
  db "github.com/algogrit/yaes-server/src/config/db"
  model "github.com/algogrit/yaes-server/src/models"
}
```

As an example you can use the `Instance` function like:

```golang
  db.Instance()
```

Note: You need to capitalize the first letter of the functions you want to export.

This is as simple as it gets for API projects. If you have a much complex app, you can adapt this project structure accordingly.

# Caveats & Honorable mentions

  * Go doesn't allow for [cyclic dependencies][GoNuts]

Signing off for now. As always, please leave your thoughts and comments in the section below.

[LearnGoPartI]: https://blog.algogrit.com/posts/2017-12-18-learn-go-series-part-1/
[LearnGoPartII]: https://blog.algogrit.com/posts/2017-12-25-learn-go-series-part-2/
[LearnGoPartIII]: https://blog.algogrit.com/posts/2018-01-09-learn-go-series-part-3/
[YAES-API]: https://github.com/algogrit/yaes-server/tree/099362c706f78601d9c70642234c143fc7beac3f
[ProjectStructGif]: https://blog.algogrit.com/assets/gifs/01-learn-go-series-part-4.gif
[AsciinemaLink]: https://asciinema.org/a/zwDQYHxeb5jQR03wvwAJUD91a
[GoNuts]: http://grokbase.com/t/gg/golang-nuts/144g9tepvf/go-nuts-why-import-cycle-not-allowed

---
title: "Learn go series: Part II - Gorm up!"
layout: Post
date: 2017-12-20
---

This is a **Part 2** of "**Learn go**" series. You can find the previous post [here][LearnGoPartI].

In this post, I will be walking you through an example of interacting with database. A very common scenario, creating a user. This post picks up from the [previous post][LearnGoPartI], so if you haven't read, please skim through it.

Let's begin...

# Setting up and configuring db

# Defining the type User

### user.go

```golang
package main

import "github.com/jinzhu/gorm"

type User struct {
  gorm.Model
  Username       string `gorm:"not null;unique"`
  HashedPassword string `gorm:"not null"`
  FirstName      string
  LastName       string
  MobileNumber   string `gorm:"not null;unique"`
}
```

# Tying it together - An API and crypted password

[LearnGoPartI]: blog.gauravagarwalr.com/posts/2017-12-18-learn-go-series-part-1/

---
title: "Learn go series: Part II - Gorm up!"
layout: Post
date: 2017-12-20
tags: learn-go-series, go, api
---

This is a **Part 2** of "**Learn go**" series. You can find the previous post [here][LearnGoPartI].

In this post, I will be walking you through an example of interacting with database. A very common scenario, creating a user. This post picks up from the [previous post][LearnGoPartI], so if you haven't read, please skim through it.

Let's begin...

# Defining the problem

We are going to be creating a sign up end-point. For this, we begin by...

# Defining the type User

### user.go

```golang
package model

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

I have defined password as 'HashedPassword'. We will be storing the password as [one-way encrypted hash + salt][HashingSecurity] in this field. If you aren't sure why you should salt and hash your password, please read this [crypto.stackexchange.com post][CrypoSaltAndHash]

# Setting up and configuring db

Oh, wait, we didn't configure the db connection yet.

### Creating postgres db

    $ createdb temp-db

### db.go

```golang
package db

import (
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/postgres"

  model "github.com/gauravagarwalr/go-example/src/models"
)

var dbInstance *gorm.DB

func InitializeDB() {
  dbName := "temp-db"

  localDb, err := gorm.Open("postgres", "dbname="+dbName+" sslmode=disable")

  if err != nil {
    panic("failed to connect database")
  }

  localDb.LogMode(goAppEnvironment != "production")
  dbInstance = localDb

  // Migrate the schema
  dbInstance.AutoMigrate(&model.User{})
}

func Instance() *gorm.DB {
  return dbInstance
}

```

# Tying it together - An API and crypted password

With the user model defined and the db configured. All we have left to do is the api. Let's see how simple it is to do...

### api.go

``` golang
package api

import (
  "encoding/json"
  "net/http"

  db "github.com/gauravagarwalr/go-example/src/config/db"
  model "github.com/gauravagarwalr/go-example/src/models"
)

type newUser struct {
  Username     string
  FirstName    string
  LastName     string
  MobileNumber string
  Password     string
}

func CreateUserHandler(w http.ResponseWriter, req *http.Request) {
  var newUser newUser
  json.NewDecoder(req.Body).Decode(&newUser)

  user := model.User{
    Username:     newUser.Username,
    FirstName:    newUser.FirstName,
    LastName:     newUser.LastName,
    MobileNumber: newUser.MobileNumber}
  user.HashedPassword = model.HashAndSalt(newUser.Password)

  if err := db.Instance().Create(&user).Error; err != nil {
    http.Error(w, err.Error(), unprocessableEntity)
    return
  }

  json.NewEncoder(w).Encode(user)
}

func RunServer(port string) {
  router := mux.NewRouter()

  router.Handle("/users", CreateUserHandler).Methods("POST")

  log.Fatal(http.ListenAndServe(":"+port, router))
}
```

Pay close attention to `user.HashedPassword = model.HashAndSalt(newUser.Password)`. We haven't defined the function yet. Let's go back to `user.go` in `model` package and define it...

### user.go

```golang
import {
  "log"
  "github.com/jinzhu/gorm"
  "golang.org/x/crypto/bcrypt"
}

func HashAndSalt(pwd string) string {
  hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.MinCost)
  if err != nil {
    log.Println(err)
  }

  return string(hash)
}
```

# Conclusion

We have built a simple way of storing new user information along with their password in a secure format. Gorm does a lot of things right.

# Caveats & Honorable mentions

  * [Go zero values][ZeroValues] - Go doesn't do `nil` unless the type is a pointer
  * [Go validator][GoValidator] - Validates values using tags

Signing off for now. Please leave your thoughts and comments in the section below.

[LearnGoPartI]: http://blog.gauravagarwalr.com/posts/2017-12-18-learn-go-series-part-1/
[HashingSecurity]: https://crackstation.net/hashing-security.htm
[CryptoSaltAndHash]: https://crypto.stackexchange.com/questions/1776/can-you-help-me-understand-what-a-cryptographic-salt-is
[ZeroValues]: https://tour.golang.org/basics/12
[GoValidator]: https://github.com/go-validator/validator

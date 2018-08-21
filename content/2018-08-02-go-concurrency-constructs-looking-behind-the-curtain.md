---
title: "Looking behind the curtain - Go Concurrency constructs"
layout: Post
date: 2018-08-02
tags: go, concurrency, atomic-ops, atoms, mutexes
---

I am sure you are aware that Go provides `goroutines` to run code concurrently and using `channels` to communicate between them. These constructs are simple to reason about and are powerful enough to build highly concurrent systems.

These constructs are built on top of some lower level constructs, some of them you might have come across during your 'Operating Systems' classes. In this post, I will be detailing some of such lower level constructs.

# Mutexes
Mutexes are a way mechanism through which access to data can be controlled so that it cannot be corrupted / used by two different operations at once. This is the most succinct explanation of it.

> A Mutex is a mutually exclusive flag. It acts as a gate keeper to a section of code allowing one thread in and blocking access to all others. This ensures that the code being controled will only be hit by a single thread at a time. <sup>[[1]](https://stackoverflow.com/a/34556/1268651)</sup>

An [example code][MutexExample] can be found at Go by example site.

```golang
  mutex.Lock()
  total += state[key]
  mutex.Unlock()
```

`Mutex` is part of the `sync` package in Go. You can instantiate it as follows:

```golang
  var mutex = &sync.Mutex{}
```


# Atomic Operations

# How is a channel implemented internally?


[MutexExample]: https://gobyexample.com/mutexes

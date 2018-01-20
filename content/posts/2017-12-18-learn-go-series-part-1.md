---
title: "Learn go series: Part I - Hello World as a service"
layout: Post
date: 2017-12-18
tags: learn-go-series, go, api
---

This is **Part 1** of "**Learn go**" series. This series assumes you have a general familiarity of the golang syntax and types. If not, I urge you to follow the interactive [tour of go][TourOfGo] and/or watch [Russ Cox's video][TourOfGoVideo]

In this post, I will be walking you through an example of writing a *Hello World* json end point. So lets begin with...

# A Simple "Hello World!"

### main.go

```golang
package main

import "fmt"

func main() {
  fmt.Println("Hello World!")
}
```

Now compiling it as:

```bash
  $ go build -o main
```

and running:

```bash
  $ ./main
```
```
    Hello World!
```

Alternatively, you can skip the above using:

```bash
  $ go run main.go
```
```
    Hello World!
```

As with many other languages, golang begins execution with `main` function. By convention, functions to be exported begin with capital letters. Here, we have imported `fmt` package which exports `Println` function.

# Intro to native `net/http`

I have been dabbling with go for almost a month now, and honestly, the entire language feels like a web framework. It has a ton of niceness baked right into it. You can pretty much skip importing libraries for ***most*** tasks. Let me give you an example of writing a native API from [golang docs][WritingWebApps]

### main.go
```golang
package main

import (
  "encoding/json"
  "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
  response := map[string]string{"hello": "world"}

  json.NewEncoder(w).Encode(response)
}

func main() {
  http.HandleFunc("/hello/", helloHandler)
  http.ListenAndServe(":8080", nil)
}
```
```bash
  $ go run main.go
```

Ensure the server has started by running the following:

```bash
  $ curl http://localhost:8080/hello/
```
```
    {"hello":"world"}
```

As you can see, this works pretty well and we didn't even import any third-party libraries. Hold on, we aren't done yet though. Let's say I want the API to look like: `http://localhost:8000/hello/{yourName}`. Or I only want it to work with GET method. I have some other functionality in mind for POST.

It is quite possible with the native `HandleFunc` and the handler functions to add these functionality (*cough* switch case *cough*), but the code quickly becomes unwieldy. Let me walk you through one of my favorite solutions for such occasions - [`mux`][MuxRouting] from the [Gorilla toolkit][GorillaToolkit].

# Entering Skull Island

Although, there are several other web "frameworks" in golang. My favorite by far is a little routing library called ["mux"][MuxRouting]. It is from the [Gorilla toolkit][GorillaToolkit] which has several other useful web packages.

```bash
  $ go get github.com/gorilla/mux
```

Now rewriting, as follows:

### main.go
```golang
package main

import (
  "encoding/json"
  "net/http"

  "github.com/gorilla/mux"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
  response := map[string]string{"hello": "world"}

  json.NewEncoder(w).Encode(response)
}

func helloNameHandler(w http.ResponseWriter, r *http.Request) {
  response := map[string]string{"hello": mux.Vars(r)["yourName"]}

  json.NewEncoder(w).Encode(response)
}

func main() {
  router := mux.NewRouter()

  router.HandleFunc("/hello", helloHandler).Methods("GET")
  router.HandleFunc("/hello/{yourName}", helloNameHandler).Methods("GET")
  http.ListenAndServe(":8080", router)
}
```

As before, run it:

```bash
  $ go run main.go
```

Now you can access:
```bash
  $ curl http://localhost:8080/hello # {"hello": "world"}
  $ curl http://localhost:8080/hello/Gaurav # {"hello": "Gaurav"}
```

# Honorable mentions & caveats

  * [Glide][GlidePackage] - Go Package Manager
  * [Gin][GinAutoReload] - To auto reload server during development. Not to be confused with gin web framework
  * Go expects all source code to be namespaced and located within $GOPATH/src directory. For eg: `https://github.com/gauravagarwalr/go-example` will be in `$GOPATH/src/github.com/gauravagarwalr/go-example`

As always leave your thoughts in the comments section below. In the next post, I will be covering a go ORM called [`gorm`][Gorm].

[TourOfGo]: https://tour.golang.org
[WritingWebApps]: https://golang.org/doc/articles/wiki/#tmp_3
[TourOfGoVideo]: https://www.youtube.com/watch?v=ytEkHepK08c
[MuxRouting]: http://www.gorillatoolkit.org/pkg/mux
[GorillaToolkit]: http://www.gorillatoolkit.org/
[GlidePackage]: https://glide.sh/
[GinAutoReload]: https://github.com/codegangsta/gin
[Gorm]: http://jinzhu.me/gorm/

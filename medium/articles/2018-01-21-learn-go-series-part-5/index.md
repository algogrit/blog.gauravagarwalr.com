---
title: "Learn go series: Part V - Testing and API documentation"
canonicalUrl: https://blog.algogrit.com/posts/2018-01-21-learn-go-series-part-5
license: all-rights-reserved
tags: learn-go-series,go,testing,api-docs,documentation
published: true
---

This is **Part 5** of "**Learn go**" series. Probably the last in this series. You can find the previous post [here][LearnGoPartIV].

This post picks up from the previous posts [Part I][LearnGoPartI], [Part II][LearnGoPartII], [Part III][LearnGoPartIII] and, [PartIV][LearnGoPartIV] , so if you haven't read, please skim through it.

# Introduction

Sometimes writing test cases in a new language can be intimidating. This post focuses on writing readable BDD style (for those familiar with [Rspec][Rspec], already know what I am talking about) tests instead of [xUnit][xUnit] style. And also documenting API endpoints.

Golang has excellent support for [xUnit][TestingPackage] style tests built in. If you don't mind writing your test cases using the native library then this post is not intended for you. You can still read ahead and figure out why [BDD works][IntroducingBDD].

All of the code from this series can be found in [this repository][YAES-API]. Let's get started.

# Stepping into the 'ginkgo' forest

Installing dependencies using glide.

```bash
  $ glide get github.com/onsi/ginkgo
  $ glide get github.com/onsi/gomega/...
```

To get the executable...
```bash
  $ go get -u github.com/onsi/ginkgo/ginkgo
```

[Ginkgo][Ginkgo] is a BDD style test framework. It integrates with Go's native `testing` package. You can run test using either `go test` or `ginkgo`'s cli tool. [Gomega][Gomega] offers an extensive set of assertions to be used along with ginkgo.

Now that we have installed everything lets bootstrap the framework to bind with native `testing`.

```bash
  $ ginkgo bootstrap
```

This generates a file with projects name and following content.

### Yet_Another_Expense_Splitter_suite_test.go

```golang
package main_test

import (
  "testing"

  . "github.com/onsi/ginkgo"
  . "github.com/onsi/gomega"
)

func TestYetAnotherExpenseSplitter(t *testing.T) {
  RegisterFailHandler(Fail)
  RunSpecs(t, "YetAnotherExpenseSplitter Suite")
}
```

This file imports native `testing` package. It uses the convention of writing a `TestXYZ` function to bind the ginkgo framework. From this point on, you can write tests using `ginkgo` framework. You can rename the file to `main_test.go` as per golang conventions.

We can write `BeforeSuite` and `AfterSuite` hooks as follows.

### src/api/api_test.go

```golang
package api_test

import (
  "testing"

  api "github.com/algogrit/Yet-Another-Expense-Splitter/src/api"
  db "github.com/algogrit/Yet-Another-Expense-Splitter/src/config/db"
  . "github.com/onsi/ginkgo"
  . "github.com/onsi/gomega"
)

func TestAPI(t *testing.T) {
  RegisterFailHandler(Fail)
  RunSpecs(t, "API Suite")
}

var _ = BeforeSuite(func() {
  db.InitializeDB("test")
  api.InitializeRouter()
})

var _ = AfterSuite(func() {
  db.Instance().Close()
})
```

# Writing our first test case

Ginkgo provides for various different ways of structuring your test cases. It provides you with the familiar `Describe`, `Context` and `It` blocks for writing the test cases, along with `BeforeEach`, `AfterEach` and a special `JustBeforeEach` hooks. And to top it all `BeforeSuite` and `AfterSuite` functions to setup the entire test harness.

```bash
  $ ginkgo generate src/api/user
```

Replace `main_test` with `api_test` in the generated file.

This test will check if the API endpoint `GET /users` returns 401 if no token is passed.

### src/api/user_test.go

```golang
package api_test

import (
  "net/http"
  "net/http/httptest"

  "github.com/algogrit/Yet-Another-Expense-Splitter/src/api"
  . "github.com/onsi/ginkgo"
  . "github.com/onsi/gomega"
)

var _ = Describe("User API", func() {
  Describe("GET /users", func() {
    Context("when the user is not logged in", func() {
      It("should fail with unauthorized code", func() {
        req, _ := http.NewRequest("GET", "/users", nil)
        response := httptest.NewRecorder()
        api.Instance().ServeHTTP(response, req)

        Expect(response.Code).To(Equal(http.StatusUnauthorized))
      })
    })
  })
})
```

We are using a `httptest.NewRecorder` to capture the response from the endpoint. We then use Gomega's matchers to write our assertion.

When we run this, we should get the following output.

```bash
$ GO_APP_ENV="test" go test -v ./...
?     github.com/algogrit/Yet-Another-Expense-Splitter  [no test files]
=== RUN   TestAPI
Running Suite: API Suite
========================
Random Seed: 1516479816
Will run 1 of 1 specs

[negroni] 2018-01-21T01:53:36+05:30 | 401 |    140.514µs |  | GET /users
•
Ran 1 of 1 Specs in 0.135 seconds
SUCCESS! -- 1 Passed | 0 Failed | 0 Pending | 0 Skipped --- PASS: TestAPI (0.14s)
PASS
ok    github.com/algogrit/Yet-Another-Expense-Splitter/src/api  0.175s
?     github.com/algogrit/Yet-Another-Expense-Splitter/src/config/db  [no test files]
?     github.com/algogrit/Yet-Another-Expense-Splitter/src/models [no test files]
```

The test case passes successfully. Now feel free to add more test cases and send in [PR][YAES-API-Latest].

# Documenting API

Let's move on to our next big topic for today, writing API docs. A good API always contains documentation along with test cases.

To start adding docs to our API example, lets install `swagger` cli tool.

```bash
  $ go get -v -u github.com/go-swagger/go-swagger/cmd/swagger
```

and run

```bash
  $ swagger init spec
```

This generates a API spec file named `swagger.yml`. You can refer to the [API blueprint specification][APIBlueprint] or [swagger examples][SwaggerExamples] to see how to write your own API description.

Let's see how our API docs look like on the browser, run...

```bash
  $ swagger serve swagger.yml
```
![API Docs][APIDocsImage]

Oh also you can [split][Azimi.me] the swagger.yml into multiple files.

# Honorable mentions

  * [Writing benchmarks][DaveCheney] - Instead of starting your `func` with `Test`, you can write a benchmark, in your `_test.go` file, using `Benchmark`.

Signing off for now. As always, please leave your thoughts and comments in the section below.

[LearnGoPartI]: https://blog.algogrit.com/posts/2017-12-18-learn-go-series-part-1/
[LearnGoPartII]: https://blog.algogrit.com/posts/2017-12-25-learn-go-series-part-2/
[LearnGoPartIII]: https://blog.algogrit.com/posts/2018-01-09-learn-go-series-part-3/
[LearnGoPartIV]: https://blog.algogrit.com/posts/2018-01-14-learn-go-series-part-4/
[Rspec]: http://rspec.info/
[xUnit]: https://en.wikipedia.org/wiki/XUnit
[TestingPackage]: https://golang.org/pkg/testing/
[IntroducingBDD]: https://dannorth.net/introducing-bdd/
[Ginkgo]: https://github.com/onsi/ginkgo
[Gomega]: https://github.com/onsi/gomega
[YAES-API]: https://github.com/algogrit/Yet-Another-Expense-Splitter/tree/6af8c4d6fbf0e50f529dd3687242df53f21fc684
[YAES-API-Latest]: https://github.com/algogrit/Yet-Another-Expense-Splitter
[APIBlueprint]: https://apiblueprint.org/
[SwaggerExamples]: https://github.com/go-swagger/go-swagger/tree/master/examples
[APIDocsImage]: https://blog.algogrit.com/assets/images/01-learn-go-series-part-5.png
[Azimi.me]: http://azimi.me/2015/07/16/split-swagger-into-smaller-files.html
[DaveCheney]: https://dave.cheney.net/2013/06/30/how-to-write-benchmarks-in-go

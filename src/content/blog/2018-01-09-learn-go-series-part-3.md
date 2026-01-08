---
title: "Learn go series: Part III - Stuck in the middle!"
date: 2018-01-09
tags: learn-go-series, go, middleware, jwt, auth
excerpt: Part 3 of Learn Go - secure your APIs with JWT authentication, add CORS support, and compose clean middleware chains using Negroni.
---

Alternate title: Working with JWT, CORS as middlewares using Negroni.

This is **Part 3** of "**Learn go**" series. You can find the previous post [here][LearnGoPartII].

In this post, I will be walking you through an example of adding middlewares for working with JWT for [sessions][Joepie91]. As well as making an API, CORS compatible. This post picks up from the previous posts [Part I][LearnGoPartI] and, [Part II][LearnGoPartII], so if you haven't read, please skim through it.

Let's begin...

# Problem Statement

We need an API where when we login, we get a JWT token back for authentication, similar in the manner to session cookies.

# Creating the Login API

We are creating a login handler. Let's call it `CreateSessionHandler`

### api/user.go

```go
type credentials struct {
  Username string
  Password string
}

func CreateSessionHandler(w http.ResponseWriter, req *http.Request) {
  var creds credentials
  json.NewDecoder(req.Body).Decode(&creds)

  var user model.User
  db.Instance().Where("username = ?", creds.Username).First(&user)

  if model.ComparePasswords(user.HashedPassword, creds.Password) {
    tokenMap := model.CreateJWTToken(user, jwtSigningKey)

    json.NewEncoder(w).Encode(tokenMap)
  } else {
    http.Error(w, "Not Authorized", unauthorized)
    return
  }
}
```

How does the `ComparePasswords` and `CreateJWTToken` actually work?

### models/user.go

```go
func ComparePasswords(hashedPwd string, plainPwd string) bool {
  byteHash := []byte(hashedPwd)
  err := bcrypt.CompareHashAndPassword(byteHash, []byte(plainPwd))
  if err != nil {
    log.Println(err)
    return false
  }

  return true
}
```
For comparing passwords, we use [bcrypt][bcypt]'s `CompareHashAndPassword` function.

```go
func CreateJWTToken(user User, jwtSigningKey []byte) map[string]string {
  token := jwt.New(jwt.SigningMethodHS256)

  /* Create a map to store our claims */
  claims := token.Claims.(jwt.MapClaims)

  /* Set token claims */
  claims["user"] = user
  claims["userID"] = user.ID

  /* Sign the token with our secret */
  tokenString, _ := token.SignedString(jwtSigningKey)

  tokenMap := map[string]string{"token": tokenString}

  return tokenMap
}
```

For creating a jwtToken we need a `jwtSigningKey` defined. This is a random alphanumeric string. This needs to be kept secret as this verifies the signed token's authenticity. We can then create a new token using [jwt][JWT-Go].

# Validating and authenticating using JWT Token

We aren't done yet. We have created the token, now we need a way to verify and validate the JWT token in requests for other APIs.

Let's first write the middleware...

### api.go
```go

  jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
    ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
      return jwtSigningKey, nil
    },
    SigningMethod: jwt.SigningMethodHS256,
  })
```
Note: This is a [third-party middleware][Auth0Middleware].

We can hook this up in multiple ways to our mux router. Let me use a middleware library called [`negroni`][negroni]. Rewriting the example from the [Part I][LearnGoPartI], as

### api.go
```go
  router.HandleFunc("/hello", negroni.New(
    negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
    negroni.Wrap(helloHandler),
  )).Methods("GET")
```

We are creating a new `Negroni` instance and passing it the jwtMiddleware's `HandlerWithNext` function and the wrapped `helloHandler` function.

# CORS

We are almost done. Our API is almost functional. We run it, test it and it works fine. Then we hit the API from the UI on a different domain, and **BAM** it doesn't work. Bummer!

Well, we forgot to enable [CORS][MozillaCORS] support to our server. Duh!

Let's do this by using a simple [CORS package][CORSPackage].

### api.go
```go
  handler := cors.Default().Handler(router)
  http.ListenAndServe(":"+8080, handler)
```

We are wrapping our router with the default cors' `Handler`. We open up our browser and test again. And voila! Things work like a charm.

# Caveats & Honorable mentions

  * [JWT as Sessions][Joepie91] - Counter Argument against JWT cause JWT aren't session cookies

# References

  * [Go's Bcrypt][bcrypt]
  * [JWT Introduction][JWT-Intro]
  * [CORS][MozillaCORS]

Signing off for now. As always, please leave your thoughts and comments in the section below.

[LearnGoPartI]: https://blog.algogrit.com/posts/2017-12-18-learn-go-series-part-1/
[LearnGoPartII]: https://blog.algogrit.com/posts/2017-12-25-learn-go-series-part-2/
[bcrypt]: https://godoc.org/golang.org/x/crypto/bcrypt
[JWT-Go]: https://github.com/dgrijalva/jwt-go
[Auth0Middleware]: https://github.com/auth0/go-jwt-middleware
[negroni]: https://github.com/urfave/negroni
[MozillaCORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[CORSPackage]: https://github.com/rs/cors
[Joepie91]: http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/
[JWT-Intro]: https://jwt.io/introduction/

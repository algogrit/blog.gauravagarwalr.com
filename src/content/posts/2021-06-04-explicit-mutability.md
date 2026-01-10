---
title: "A case for explicit mutability"
date: 2021-06-04
tags: rust, go, c++, clojure, java, mutability, immutability
excerpt: Implicit vs Explicit Mutability - Lessons from Go, FP, and Rust
---

Far more programming languages promote implicit mutability as a feature (through assignment, of course) than necessary.

For eg, let's take the following Go code:

```go
m := map[Person]string{}
k := Person{}

m[k] = "Hey, there!"
k.name = "Daniel"

print(m[k]) // => ""
```

& equivalent Java code:

```java
Map<Person, String> map = ...
Person k = new Person();
map.put(k, "Hey, there!");

k.setName("Daniel");
map.get(p);       // => null
```

Most developers wouldn't find any problem with this code and would find this code reasonable.

For most functional programmers, the use of the variable `"k"` & how it loses meaning, isn't ideal.

## What about functional languages?

Functional languages promote the concept of immutability. The above example doesn't translate just as well in these languages, as you would have to rebing the `"variable"` to it's new value.

```clj
;; Trying to mutate a key in a HashMap
(defstruct person :name :age)

(def k (struct person "Gaurav" 30))

(def m {})

(def m (assoc m k "Hey, there!"))

;; There is no way to update `k`, other than to rebind it, in that case, it is an entirely different memory location

;; Rest of the code omitted
```

Functional languages usually take a hard stance against mutability.

Take a look at how you would work with a list:

```clj
;; Doubling the items in a list

(def primes '(1 2 3 5 7))

(def res (map #(* 2 %) primes))
```

Apart from the lazy-evaluation, clojure also ensures that the list isn't mutable. It instead creates a new list, which is a `"fork"` of the old list.

There are other ways to make in-place mutations work in clojure, by using `atoms` for that matter. For eg:

```clj
;; Doubling the items in a list in-place
(def primes (atom '(1 2 3 5 7)))

(swap! primes #(map (fn [el] (* 2 el)) %))
```

This code works well even in multi-threaded environments. Ensuring that the mutations wouldn't cause any race conditions. But `atoms` are sort of an extra feature which you need to reach out for.

## "Hello" from a cRUSTacean

Rust does things slightly differently in some ways and same in many ways.

It is inspired by a lot of functional languages, especially from the ML family of languages and it's compiler is unique in the sense that it comes with a `borrow checker`.

One of the things Rust does by default, is promoting immutability.

```rs
let i: i32 = 42; // Declares an immutable variable `i` of type: i32, which can be assigned only once
i = 10; // causes a compile-time error
```

Rust, even though is a strong-statically typed language, like FP, promotes shadowing:

```rs
let i: i32 = 10; // Binds `i` to the value `10`
let i = "Hello"; // Rebinds `i` to the value `"Hello"`; type is inferred by the compiler
```

Unlike, most FP languages which promote other "constructs", in order to have mutability, Rust, uses a simple keyword to make things explicitly mutable:

```rs
let mut i = 10; // Rust is type inferred, we don't need type info on the left `i32`
i = 42;
```

Same thing works even with references:

```rs
fn update_number(x: &mut i32) {
    *x = 42;
}

fn main() {
    let mut v = 10;

    update_number(&mut v);

    println!("Value of v: {}", v); // Value of v: 42
}
```

### Collections & Iterators

It works even with list-like or `Vec` (in Rust) types:

```rs
let primes = vec!(1, 2, 3, 5, 7);

// Less idiomatic
primes = primes.iter().map(|el| {el * 2}).collect(); // Doesn't compile

// More idiomatic
primes.iter_mut().for_each(|el| { *el = *el * 2 }); // Doesn't compile either
```

Rust compiler ensures that the data in collections can't be updated, unless the collections itself are marked as mutable, same as any primitive type.

One other thing to note, Rust allows for different access to the elements in a collection through the different iterators (by calling `iter` or `iter_mut` for example) you create. This isn't something you can control as a programmer in many other languages.

So far so good. But what about thread-safety?

### The "Borrow Checker"

Rust compiler ships with a borrow checker. That's how Rust ensures memory safety with it's ownership model.

The borrow checker ensures "correctness" of a program by enforcing rules at compile time.

#### Rules

- At any given time, you can have either (but not both of) one mutable reference or any number of immutable references.
- References must always be valid.

Let's modify the `update_number` code, slightly:

```rs
fn update_number(x: &mut i32) {
    *x = 42;
}

fn main() {
    let mut v = 10;

    let r = &v;

    update_number(&mut v);

    println!("Value of v: {}", v); // Value of v: 42
    println!("Value referenced by r: {}", r);
}
```

Similar program in other programming languages (Go comes to mind) would compile, let's see what Rust compiler says:

```bash
$ rustc /tmp/test.rs
error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable
  --> /tmp/test.rs:10:19
   |
8  |     let r = &v;
   |             -- immutable borrow occurs here
9  |
10 |     update_number(&mut v);
   |                   ^^^^^^ mutable borrow occurs here
...
13 |     println!("Value referenced by r: {}", r);
   |                                           - immutable borrow later used here

error: aborting due to previous error

For more information about this error, try `rustc --explain E0502`.
```

Even in a single-threaded setting, I can't really have both a mutable and immutable reference to the same variable at the same time. Most race conditions get eliminated at compile time, rather than be run-time issues.

There are workarounds in Rust, to be able to update and access values from multiple places, but I will keep it out of purview of this post.

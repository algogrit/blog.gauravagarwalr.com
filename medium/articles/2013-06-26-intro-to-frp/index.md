---
title: Introduction to Functional Reactive Programming
canonicalUrl: https://blog.algogrit.com/posts/2013-06-26-intro-to-frp/
license: all-rights-reserved
tags: frp
publishStatus: draft
published: true
---

For all functional enthusiasts. I am pretty sure you would have heard the term Functional Reactive Programming, but might not have completely understood the concept. [Here][wikipedia] is the link to the wikipedia article on the concept.

Now if you really don't get the concept at first, no worries, think of creating formulas in excel, and how it behaves when the dependent values are updated automatically.

This is certainly different than the imperative languages, where the value of a variable represents a operation on the dependent variables, only at some point in time; Instead, the variables can represent operation on dependent variables, at ANY point in time!

A better explanation of this concept is probably contained in this [SO][stack-overflow] post.

Anyways, all I wanted to share was really the library in JS which can get you started with this, so [here][reactive.js] is the link.

P.S. I have heard of similar libraries available in Scala, so if any Scala aficionados could point me to such a resource would be interesting.

[wikipedia]: http://en.wikipedia.org/wiki/Functional_reactive_programming
[stack-overflow]: http://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming
[reactive.js]: https://github.com/mattbaker/Reactive.js

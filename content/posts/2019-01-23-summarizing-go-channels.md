---
title: "An investigative walk-through of Go's channels"
layout: Post
date: 2019-01-26
tags: go, channels, internals
---

This is a summary of a [talk][GopherconVietnam] I gave during Gophercon Vietnam & Gophercon India. If you have seen this talk already, you might find the concepts crystallized after reading the blog post. You can find the slides [here][GoChannelsSlides].

I have split this blog post, similar to the way I had structured the talk:

- A simple scraper walk-through
- Deep dive into Go's channels
- Runtime execution and demo

# Simple scraper walk-through

In this walk-through, I will be talking about a simple program to scrape from Amazon's product listing page. All the code is available [here][ConcurrentScraperCode].

![Product Listing][AmazonProductListing]

Here, we are scraping data into a `struct` which looks like:

```go
type Product struct {
	Name    string
	Link    string
	Image   string
	Price   string
	Reviews []Review
}
```

In this program, I am using a simple scraping & parsing library called [`soup`][GoSoup].

The algorithm can be summarized as:

* Open up the product listing page
  * Parse the products
    * For each product, get it's [name, image, price and link][CodeProductParsing].
    * Visit the product's page using the scraped `link`
* In the product's page,
  * Parse the reviews
    * For each review, get it's [name, rating and content][CodeReviewParsing]


As a result, the snippet of [code][CodeMainParser] below,

![Main Code][CodeImMain]

produces the following output:

```json
{
  "Name": "Sanyo 108.2 cm (43 inches) Full HD IPS LED TV XT-43S7100F (Black)",
  "Link": "https://www.amazon.in/Sanyo-108-2-inches-XT-43S7100F-Black/dp/B01ICVLK4S/ref=lp_1389396031_1_5/260-5276449-2035623?s=electronics&ie=UTF8&qid=1540385124&sr=1-5",
  "Image": "https://images-eu.ssl-images-amazon.com/images/I/51F0yKjVX1L._AC_US218_.jpg",
  "Price": "17,990",
  "Reviews": [
    {
      "Name": "Cooper Vrf",
      "Rating": "5.0 out of 5 stars",
      "Content": "Much has been said about the clarity and performance of the TV. Yes its a great value for money product, but here I am going to say about the customer service part. After using my 49 inch TV for about 21 months one day my TV went black. I could hear only the sound but no picture. I emailed the Sanyo customer care and within four hours a service person called me and fixed the appointment for very next day. The next day he inspected the TV and told that the panel has gone dead and they will have to change the panel. As my TV was under 2 year warranty he assured me that the company will possibly replace the panel and it could be done within 10 days. I was very much skeptical about the panel replacement as the next day I received an email from the company saying that they will be taking all possible actions to solve my query but no mention of panel replacement. After about a week I received a call from their service center in Bilimora that my tv has arrived and the service person is coming to install it. Even though it was raining heavily on that day he came right on time and to my amazement he brought out from his car a whole new TV box. Believe me the company has replaced a whole new tv in place of the old one, only the two boards from my old tv were fixed on the new one. Really hats off to the Company's customer service and special mention to their service centre in Bilimora which got the job done on time even in heavy rainfall and even though my hometown is about 25 kms away. Within the next two hours I received three calls from the company regarding my query solved. Thanks Sanyo..... Really satisfied on buying your company's TV."
    },
    {
      "Name": "Debasish Sen",
      "Rating": "4.0 out of 5 stars",
      "Content": "Great clarity. Decent sound. A cracking deal at this price."
    },
    {
      "Name": "Naziruddin",
      "Rating": "4.0 out of 5 stars",
      "Content": "A good tv for the exchange price.Good reception n colours.Gurantee card does not say 10 years tv panel warranty but mentioned on the web site of the Tv,hopefully it's  true. Worth buying."
    }
  ]
}
```

The above code has room for [out-of-order execution][OutOfOrderExec], this means we could use some of Go's concurrency paradigms like channels and goroutines to make the code run faster. This is what the code looks like now:

![Concurrent scraper][CodeImConcurrentScraper]

# Deep dive into Go's channels

Go has two channel implementations:

* buffered `ch := make(chan Product, 3)`
* unbuffered `ch := make(chan Product)`

They both make use of the same `hchan` struct under the hood.

## What's in a `hchan` struct?

![Hchan struct][CodeImHchan]

The information in a hchan struct can be broadly grouped as:

* Type information
* Buffers & queues
* Counters
* Locks & flags

Let's look at each of them in detail:

### Type information

* elemsize

  Represents the size of a single element in memory in bytes. For eg, our `Product` struct takes 88 bytes (`string` takes 16 bytes, `Review` takes 24 bytes) in the stack. Type `int` takes 8 bytes.

* elemtype

  Used when messages are copied over from one goroutine to the other. It has a bunch of fields which provide type and size information for the type of values the channel can hold. There is a bit of overlap with `elemsize`.

  ![Elem Type][CodeElemType]

### Buffers & queues

#### Buffers

* buf

  This is a [circular queue][CircularQueue]. With a buffered channel of size 3, `ch := make(chan Product, 3)`, buf will look as follows:

  ![buffer Illustration][BufferIllustration]

  Essentially `make(chan Product, 1) != make(chan Product)`, because when channel size is defined a circular queue implementation is used internally to hold the elements of a channel.

#### Queues

* recvq & sendq

  Before we deep dive into these two fields, let's talk about `sudog` struct:

  ![sudog struct][CodeSudogStruct]

  `sudog` represents a goroutine. `recvq` & `sendq` hold the information on the goroutines which are currently blocking on the channel while receiving and sending respectively. They are pointers to `sudog`.

  Taking `recvq` as an example:

  ![recvq Structure][recvqStructure]

  <h6>Image credits: Ankur Anand</h6>

  `sudog` is designed as a doubly linked list. It has pointers to the `prev` and `next` goroutines which are blocking on the channel. It also contains an unsafe pointer to `elem`, the element which the goroutine is currently blocking on.

  As and when the channel is ready, the next goroutine to run is picked from the `recvq` and `sendq` by the [Go's scheduler][GoSchedulerTalk].

### Counters

  * dataqsiz

    This represents the entire buffer size of the channel, as specified by the user. Essentially, the queue capacity.

  * qcount

    This represents the number of slots in the circular queue currently filled up.

  * sendx & recvx

    These are indices on the circular queue, `buf` to figure out where to next dequeue from (recvx) or enqueue to (sendx).

    Let's look at an alternative representation of the buffered channel and let's go through a few scenarios to understand the behavior of `sendx` and `recvx`.

  ![Kavya's Buffered Queue][kavya-sendx-recvx]
  <h6>Image credits: Kavya Joshi</h6>


  When the channels is empty:
  ![Kavya's Buffered Queue][kavya-sendx-recvx-empty]
  <h6>Image credits: Kavya Joshi</h6>

  After an enqueue happens:
  ![Kavya's Buffered Queue][kavya-sendx-recvx-enqueue]
  <h6>Image credits: Kavya Joshi</h6>

  After the channel becomes full, note the `dataqsiz` & `qcount` become equal. All sends to this channel will block at this point.
  ![Kavya's Buffered Queue][kavya-sendx-recvx-full]
  <h6>Image credits: Kavya Joshi</h6>

  Let's dequeue one element:
  ![Kavya's Buffered Queue][kavya-sendx-recvx-dequeue]
  <h6>Image credits: Kavya Joshi</h6>


### Flags & locks

  * closed

    This is a flag which shows whether the channel is currently closed or not. A channel can be closed by any of the goroutines which have access to the channel.

  * lock

    This is a mutex which controls access to the channels. Channels are goroutine safe due to the use of this lock. It controls receives and sends to the channel, ensuring no race condition happens.

This was all you need to know to under the following demo.

# Runtime execution & demo

Please watch the following video to catch channels live in action.

<iframe width="560" height="315" src="https://www.youtube.com/embed/sOhKBA4EfIQ?start=1063" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Summarizing channels

* FIFO (first-in, first-out) - recvq/sendq
* *Do not communicate by sharing memory; instead, share memory by communicating.*<sup>[1]</sup>
* ~~Thread~~ Goroutine safe

* *First-class citizens!*

## References

* Kavya Joshi's GopherCon 2017 talk on [Understanding Channels](https://www.youtube.com/watch?v=KBZlN0izeiY)
* Ankur Anand's post on [Diving deep into Golang Channels](https://codeburst.io/diving-deep-into-the-golang-channels-549fd4ed21a8)
* Gaurav Agarwal's talk on [Go concurrency constructs](https://www.youtube.com/watch?v=JqNpNpb5TlQ)
* Using delve debugger along with Visual Studio code


[GopherconVietnam]: https://www.youtube.com/watch?v=sOhKBA4EfIQ
[GoChannelsSlides]: https://go-channels.slides.algogrit.com/
[ConcurrentScraperCode]: https://github.com/Chennai-Golang/go-concurrency-constructs/tree/concurrent
[AmazonProductListing]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/amzn-product-listing.png
[GoSoup]: https://github.com/anaskhan96/soup
[CodeProductParsing]: https://github.com/Chennai-Golang/go-concurrency-constructs/blob/concurrent/main.go#L15-L23
[CodeReviewParsing]: https://github.com/Chennai-Golang/go-concurrency-constructs/blob/concurrent/review.go#L22-L24
[CodeMainParser]: https://github.com/Chennai-Golang/go-concurrency-constructs/blob/concurrent/main.go#L30
[CodeImMain]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/code-parser.png
[OutOfOrderExec]: https://en.wikipedia.org/wiki/Out-of-order_execution
[CodeImConcurrentScraper]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/code-concurrent-parser.png
[CodeImHchan]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/code-chan-structure.png
[CodeElemType]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/elemtype.png
[CircularQueue]: https://en.wikipedia.org/wiki/Circular_buffer
[BufferIllustration]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/buffer.png
[CodeSudogStruct]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/code-sudog-struct.png
[recvqStructure]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/recvq-structure.png
[GoSchedulerTalk]: https://www.youtube.com/watch?v=YHRO5WQGh0k
[kavya-sendx-recvx]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/kavya-sendx-recvx.jpg
[kavya-sendx-recvx-empty]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/kavya-sendx-recvx-empty.jpg
[kavya-sendx-recvx-enqueue]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/kavya-sendx-recvx-enqueue.jpg
[kavya-sendx-recvx-full]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/kavya-sendx-recvx-full.png
[kavya-sendx-recvx-dequeue]: https://blog.algogrit.com/assets/images/04-summarizing-go-channels/kavya-sendx-recvx-dequeue.jpg
[1]: https://golang.org/doc/effective_go.html#sharing

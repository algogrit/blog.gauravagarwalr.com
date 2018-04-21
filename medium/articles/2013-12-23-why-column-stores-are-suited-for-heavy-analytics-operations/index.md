---
title: "Why Column Stores are suited for Heavy Analytics Operations"
canonicalUrl: https://blog.gauravagarwalr.com/posts/2013-12-23-why-column-stores-are-suited-for-heavy-analytics-operations/
license: all-rights-reserved
tags: db,column-store
published: true
---
*"Bad programmers worry about the code. Good programmers worry about data structures and their relationships."* - **Linus Torvalds**

Hi,

Currently, am working on an internal analytics application involving crunching of data across multiple variables (about 20+ columns alone, on a single table). The application gives insight into the Usage patterns of a product. We are using *MySQL* running on an m1.medium instance.

### Our Use Case

The data is about every session the user created and attributes associated with it. There are about *6+ million* rows in the database, growing at about *40K entries per day*. I know the data is not that huge, but when you are building an analytics app and trying to crunch almost a million records for every request, it seems huge!

There are about 9 important dimensions in the data. We going with a widget kind of model, where once the dashboard is loaded, all the numbers (as tables/charts) would be populated through Ajax requests. On the landing page itself we have about 10+ such requests each operating on such a million records, depending on the range selected by the user.

During such situations it becomes critical to ensure, the data is available to Business at all times, and especially in times of need, we can't let the management wait for 2-3 minutes for all of the requests to complete. It became obvious quickly to us that MySQL, isn't going to scale for our needs and we started looking at alternatives.

One such alternative to the team was **[MonetDB]**. Now, MonetDB is used extensively in the research and academic world, and rarely so in production.

## Why MonetDB?

*MonetDB* is a **[Column Store][Group-B]**, relational in nature. Though it is designed to scale well vertically. It seems right for our purposes cause of the following reasons:

 - We deal with about 5-6 columns at a time,
 - Most of the operations we do are aggregations of data,
 - Though we are going to be doing a few joins, we would be doing more charts (especially trend charts, over various periods)
 - Our access patterns, are not well defined as of now and can range from, selecting a range as large as year, to as granular as a day (or even hours, perhaps?)
 - There are going to be a lot of drill downs, and roll ups (typical OLAP situation)
 - It has all the goodness of relational databases
 - Has a [SQL interface][1] (supports SQL-2008 standard), makes it all the more familiar to work with

So, why do I insist on using Monet. And what the heck is a Column Store!?

## What is a column store?

[Here][wikipedia] I would like to point you to the wikipedia link on the same topic. Please go ahead and read it, though I will try best to summarize the same.

The main difference as the name suggests, the column data are stored closer together vs the Row-oriented system, where the data pertaining to a row is all stored locally together. This might not seem to be a difference at first, but offers some pretty smart optimizations for an analytics application! For eg:

* Since all the data for a column is stored together, when you are [projecting], i.e. selecting only few of the columns, the [seek] time is reduced considerably. Since, all the data pertaining to a column is closer. *Though, this holds true less as an optimization in the world of SSDs!*
* The data or let us refer to it as the "working set", loaded in memory (RAM) by the database is smaller. Since only the required columns and their values are read. Always to have enough RAM, sometimes a little more than you need is good.
* The smartest feature/optimization for me, was how it stores data of a column, which has redundant values. Taking from wiki, let us consider that we are storing a column with names, the way it would be storing it is:

    Smith:001,Jones:002,004,Johnson:003

here the names 'Smith' is part of tuple with internal id 001. But if you look closely, the name 'Jones' is pointing to two ids 002, 004. Thus implying that it is present in 2 rows.

This makes it especially interesting, as now we see a sort of an inverted index. Thus having indices on all of the columns of the table. Plus, lower disk space requirements! ;)

Theoretically, any such system would have worser performance for writes. But lets dive into the internals of MonetDB, and how it beats some of the more widely used row-oriented databases in their own forte.

# Impressions of Monet

MonetDB, to me, seems like the [typical][2] Column Store. This is really the first column store I was introduced to, by one of the most experienced and smartest person I know.

Now, Monet has its own nuances as to how it stores and maintains data internally. The storage limit is based on the architecture of the underlying operating system.

### I am BAT(man!)

MonetDB [stores][3] data in its own BAT -- *Binary Association Table* files, whereby it does vertical fragmentation of data and stores each of the columns in a separate file, of the form:

     {(surrogate,value)}

The surrogate (head) is also known as object-identifiers (OID). The tail contains attribute values. Each of the columns are stored in their own BAT files.

When any queries are executed, MonetDB uses its own BAT algebra, closely related to the relational model, to return you results in, *you guessed it*, BAT files.

### Transaction

Well there is nothing new which am going to talk here expect what is already summarised [here][4]. Most of the relational databases use [Pessimistic Concurrency Control][concurrency], which basically means that they lock the resources before any operation (even on READ!). How horrible is that, for a Data Warehousing application which is mostly going to have Bulk inserts and many reads! MonetDB out performs MySQL even on writes, but it is not suited for high write situations.


[wikipedia]: http://en.wikipedia.org/wiki/Column-oriented_DBMS
[MonetDB]: http://www.monetdb.org/Home
[projecting]: http://en.wikipedia.org/wiki/Projection_(relational_algebra)
[seek]: http://en.wikipedia.org/wiki/Hard_disk_drive_performance_characteristics#SEEKTIME
[Group-B]: http://dbmsmusings.blogspot.in/2010/03/distinguishing-two-major-types-of_29.html
[1]: http://www.monetdb.org/Documentation/SQLreference
[2]: http://www.monetdb.org/Home/Features
[3]: http://www.monetdb.org/Documentation/Manuals/MonetDB/Architecture
[4]: http://www.monetdb.org/Documentation/Manuals/SQLreference/Transactions
[concurrency]: http://en.wikipedia.org/wiki/Concurrency_control

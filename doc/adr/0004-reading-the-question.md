# 4. Reading the question

Date: 2021-12-02

## Status

Accepted

## Context

So far there are training samples given to you in the question so that you can use those to make something that is likely to 
get the right answer, for example:

```
For example, suppose you had the following report:

199
200
208
210
200
207
240
269
260
263

This report indicates that, scanning outward from the submarine, the sonar sweep found depths of 199, 200, 208, 210, and so on.

The first order of business is to figure out how quickly the depth increases, just so you know what you're dealing with - you never know if the keys will get carried into deeper water by an ocean current or a fish or something.

To do this, count the number of times a depth measurement increases from the previous measurement. (There is no measurement before the first measurement.) In the example above, the changes are as follows:

199 (N/A - no previous measurement)
200 (increased)
208 (increased)
210 (increased)
200 (decreased)
207 (increased)
240 (increased)
269 (increased)
260 (decreased)
263 (increased)

In this example, there are 7 measurements that are larger than the previous measurement.
```

This is a full example that can be used to make a passing test.

This reminds me a lot of a Gojko Adzic course I did where we had to write sample specifications based on a ficticious problem.

He had some example written on a piece of paper he was holding.

And then after we'd finished he said "Why didn't you ask for the examples I was holding".

The examples are there in plain sight, I wonder how many people use them?

## Decision

The change that we're proposing or have agreed to implement.

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

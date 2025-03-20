---
title: Types Are Not Tests and Tests Are Not Types
coverImage: "/assets/blog/types-are-not-tests/title.jpg"
date: "2019-07-04T12:00:00.000Z"
author:
  name: Matti Petrelius
  picture: /assets/blog/authors/matti-pic.png
ogImage:
  url: "/assets/blog/types-are-not-tests/title.jpg"
---

![Types Are Not Tests](/assets/blog/types-are-not-tests/title.jpg)

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@worthyofelegance?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Alex"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Alex</span></a>

In this post, I write about something that I think does not get enough attention. Testing is an important part of any software development and the JavaScript ecosystem has from the start established good tools for writing tests. However, the picture changes quite significantly with TypeScript.

This post is a part of a larger **TypeScript in the Back** series. **TypeScript** is taking the web and **JavaScript** development world by storm and it has some interesting implications on how we do things.

This is the third part of the series.

[Part 1: I'd Like Some Type in My Script Instead of Java, Please!](../posts/id-like-some-types)  
[Part 2: Bringing the Types Back to the Back](../posts/bringing-the-types-back)  
[Part 3: Types Are Not Tests and Tests Are Not Types](../posts/types-are-not-tests)  
[Part 4: Serverless TypeScript](../posts/serverless-typescript)

## It's Not Either-Or

One thing I've noticed coming from a statically typed language (C#) to a dynamic one (JavaScript) is that there is understandably a lot more focus on writing good unit tests and having good test coverage.

I think a lot of this has to do with not having the safety that types provide. Remember that both types and tests aim for the same goal of reducing errors in the code. So since we can't rely on types to reduce our errors, we write tests to do the job.

**However I strongly believe that introducing types to our code does not take away the need for tests**

But it definitely changes the game. You should focus on testing to make sure there are no logical errors, functions act in a desired way when errors occur and certain input produces a certain output. You should not test whether a function returns an object of a certain type or whether a function calls another function with correct parameters. This kind of tests are done by the compiler already.

With types, you can also focus more on writing integration tests that make sure your application works correctly in a bigger picture. For example making sure that the API returns data in a shape that it is supposed to, that the right kind of document is persisted in the database or that a UI component renders desired output. Since you know the inner implementation details are correct, you have more time to test other things.

Also as I will go into more detail in this post later, there are interesting changes to how you can implement tests with static types in the first-hand.

## Getting Your Tests Running

Having tests is great, but not very useful unless you can also run them. So to start off you need a test runner. There are currently two major test runners for JavaScript: [Mocha](https://mochajs.org/) and [Jest](https://jestjs.io/). Jest is the new kid and it is very popular in the React scene. It has some nice features compared to Mocha, but Mocha remains as the battle-tested old-timer that gets the job done and does it pretty well. And a great thing is that it also works very well with TypeScript.

The easiest way to get going with Mocha in a Node.js project is to simply set your NPM test script to:

```
mocha
```

Mocha by default looks for `.js` test files in the `test` directory and **only** for files directly in that directory, not subdirectories. If you want to also include files in subdirectories you can pass the --recursive option:

```
mocha --recursive
```

Also if you prefer another directory than the default `test` then you can define your own one:

```
mocha "./spec/**/**.test.js"
```

A thing to note here is that though the [official documentation](https://mochajs.org/#the-test-directory) claims that you can use the `--recursive` option along with a custom test directory without the globstar (`**`) wildcard, I was not able to get it to work on either Windows or Linux. The way it seems to me is that if you want to specify your own test directory then you need to also use the globstar wildcard. **And** you should wrap the directory path in double quotes to make sure it works on all platforms. In my tests, it worked on Windows without the quotes but not on Linux. Also when you pass the custom directory like this, there's no need for the `--recursive` option anymore.

### But what about when my files are not JS but TS?

With TypeScript, you obviously need to specify that the test files have a `.ts` extension. But Mocha does not know out-of-the-box what to do with TS files.

You could, of course, add a compilation step for your tests, so that before the tests are run, the tests would be compiled to JS files. I practice this is a bit cumbersome since you have a single `tsconfig.json` with an output directory and you most likely don't want your tests to end up in the actual outputted application.

#### ts-node

Luckily there is an alternative to compiling called [ts-node](https://github.com/TypeStrong/ts-node) that enables running TypeScript directly without compiling it first. It is useful for other things than tests as well.

For example, you might not want to always restart and recompile your app after every change. Usually in Node.js this is done with tools like [nodemon](https://github.com/remy/nodemon) or [node-dev](https://github.com/fgnass/node-dev). There is a TypeScript version of `node-dev` called [ts-node-dev](https://github.com/whitecolor/ts-node-dev) which uses `ts-node` under the hood. It watches for file changes and then restarts the Node.js process.

The way you can use `ts-node-dev` to watch for file changes is:

```
ts-node-dev --respawn --transpileOnly ./src/index.ts
```

The two options are for `node-dev` and `ts-node`. Option `--respawn` tells `node-dev` to keep watching for changes even after the app has exited. Option `--transpileOnly` tells `ts-node` to use the TypeScript's faster transpileModule function to only transpile TypeScript to JavaScript without type checking. It might seem odd that you would want to skip the type checking, but remember it's only for the fast dev-loop. You can still run a type checker on-demand separate from the watcher.

To use Mocha with `ts-node` you can run your TypeScript tests like this:

```
mocha --require ts-node/register "test/**/**.test.ts"
```

But often you don't just want to run the tests, you also want to have the test runner watch for changes in source files and run the tests again if anything changes. In plain old Node.js you could simply achieve this with Mocha using the `--watch` option:

```
mocha --watch
```

With TypeScript again things are just a bit more complicated. You need to pass mocha the ts-node options and the `--watch` option and in addition a `--watch-extensions ts` options:

```
mocha --watch --watch-extensions ts --require ts-node/register "test/**/**.test.ts"
```

## NPM Scripts in the Whole

After setting up the test running scripts my NPM scripts look like the following. These include the scripts for building and running the app, running with a file watcher, running the tests and running the tests with a file watcher.

```json
"scripts": {
  "build": "tsc --build",
  "start": "tsc --build && node ./lib/index.js",
  "watch": "ts-node-dev --respawn --transpileOnly ./src/index.ts",
  "test": "mocha --require ts-node/register \"test/**/**.test.ts\"",
  "test-watch": "mocha --watch --watch-extensions ts --require ts-node/register \"test/**/**.test.ts\""
}
```

## Mockito Ergo Sum

I'm pretty sure everyone who has ever written unit tests, has run into a situation where you need to pass a non-trivial object or a function to the tested function and it can't be null.

In JavaScript, this is not a difficult task. You can easily create objects with the required properties and functions and pass them where needed. There are mock libraries for JavaScript such as [Sinon.JS](https://sinonjs.org/) but they are more about creating fake functions with faked behavior and spy abilities than mocking objects.

But when you start writing tests in TypeScript you quickly face two decisions.

## 1. Any all the things

Let's say you have a function foo that takes a parameter that is of type Bar:

```typescript
function foo(bar: Bar) {
  // something ...
}
```

Bar is a class with multiple properties and methods like this:

```typescript
class Bar {
  prop1: string;
  prop2: string;
  prop3: string;
  method1() {
    console.log("1");
  }
  method2() {
    console.log("2");
  }
  method3(a: number, b: number) {
    return a + b;
  }
}
```

Now if you would like to mock the bar parameter to the foo function you could try the same tactic as with plain JavaScript and provide an empty object as the parameter:

```typescript
foo({});
```

However, by doing this you would end up with the following compiler error:

```
Argument of type '{}' is not assignable to parameter of type 'Bar'.
  Type '{}' is missing the following properties from type 'Bar': prop1, prop2, prop3, method1, and 2 more.
```

A simple way to fix this error is to just type the empty object as **any**:

```typescript
foo({} as any);
```

After this small change, the compiler won't complain anymore.

This is an efficient way to make the compiler not care about the types of the mocks, but it comes with some caveats. By declaring the mock as any, we are essentially giving up on static typing. The type of the parameter might not be a correct one and it could cause runtime exceptions.

Whether this is an actual concern is up to debate. At least it is not any worse than the JavaScript alternative. Then again it is not any better either.

Personally, I like to think that the test code is just as important as the actual business code, and therefore I am a proponent for having types also in testable constructs and mocks.

## 2. Use a mocking library

If you want to have static types in tests, you will either have to start writing your own mocks that implement all the required properties and methods or use a library that takes care of it automatically.

In our previous example, building a mock would look something like this:

```typescript
const barMock = {
  prop1: "1",
  prop2: "2",
  prop3: "3",
  method1: () => {},
  method2: () => {},
  method3: (a: number, b: number) => 0,
};
```

You might be wondering why we are creating a mock in the first place and not just newing up an instance of Bar. The reason lies in the methods of the class Bar. In this simple example, they only write to the console log, but they could have more powerful side effects too. Typically functions call external resources like API:s and Databases, which is something we don't want to happen during our tests.

The mock we wrote might also not seem too complicated and you would be right about that. But imagine a class with tens of methods and properties. At some point mocking all of them will definitely get too cumbersome.

But luckily there is a solution: Using a mock library. There are some mock libraries that look promising:

- typemoq
- ts-mockito
- substitute.js

### typemoq

I come from a C# background and in C# writing mocks for tests is an unavoidable evil. The best language for writing mocks is called Moq. It has a relatively nice syntax for writing mocks and provides powerful features of which most of them you never use.

**typemoq** is a mock library for TypeScript with a very similar syntax as Moq. I thought this would be an obvious first choice for me so I gave it a try.

However, I ran into some typing errors with it that were extremely hard to fix. Also, the syntax seemed in TypeScript a bit less idiomatic than in C#. It just felt like there had to be a better option.

Also one of the big problems with typemoq is that it always executes the constructor of the class that it is instantiating. For me at least this caused some weird and hard to catch errors in tests.

### ts-mockito

This is a mock library that is based on the popular mock library in Java called **mockito**. It comes with a very nice syntax and powerful features. It's also very reliable and simply gets the job done.

After trying typemoq and subsequently ts-mockito, I settled on using ts-mockito. It seemed like the simplest way to get the mocks done that I needed.

Also the fact that it does **not** execute the constructor of the class that is mocked is very nice.

### substitute.js

This is the new kid on the block. substitute.js tries to take the clean syntax of ts-mockito even a bit further and it brings one really big feature: **mocking interfaces**.

Mocking interfaces is not supported in either typemoq or ts-mockito and it is a real bummer. For example, sometimes you might want to mock something like AxiosInstance (An interface from the popular HTTP client).

But I haven't given substitute.js a real try yet. Currently, my choice is ts-mockito but that might change in the future.

### A mock example with ts-mockito

Basic mocking with ts-mockito is really simple. Give the previous example we could mock `bar` with ts-mockito with the following code:

```typescript
const barMock = mock(Bar);
```

Then to use the actual mock instance you would pass it to foo:

```typescript
foo(instance(barMock));
```

You can also use function `when` and the anyX functions to stub method calls like this:

```typescript
when(barMock.method3(1, 1)).thenReturn(2);
```

Also, if you prefer to just return the same value for any parameter values then you can do that with functions like `anything, anyString, anyNumber, ...`

```typescript
when(barMock.method3(anyNumber(), anyNumber())).thenReturn(2);
```

And you can use function `verify` to make sure a method gets called:

```typescript
verify(barMock.method3(1, 1)).called();
```

All in all, ts-mockito feels a lot like using **Sinon.JS** but with the static typing goodness. I recommend it for all the features except for the disappointing fact that it still does not support mocking interfaces. It might because of this one missing feature I might take a look at substitute.js next.

## A summary

I can't say that testing in TypeScript is as easy as in JavaScript but despite static typing, it is still very important. You just have to understand how different writing strongly typed tests is from writing plain JavaScript tests.

Hopefully, this article gives you some tools, that make it easier to migrate your tests from JavaScript to TypeScript. Personally, I believe test code quality is just as important as the quality of the actual code running in production. It is important that the tests themselves work correctly, and at the very least, making changes to your tests will be a lot easier.

## TypeScript in the Back Series

This was the third part of a four-part blog post series that I'm working on. There will be a final fourth part focusing on how to write serverless functions with TypeScript.

[Part 1: I'd Like Some Type in My Script Instead of Java, Please!](../posts/id-like-some-types)  
[Part 2: Bringing the Types Back to the Back](../posts/bringing-the-types-back)  
[Part 3: Types Are Not Tests and Tests Are Not Types](../posts/types-are-not-tests)  
[Part 4: Serverless TypeScript](../posts/serverless-typescript)

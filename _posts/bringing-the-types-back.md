---
title: Bringing the Types back to the Back
excerpt: "In this post, I will dive into how TypeScript can be utilized on the Backend. TypeScript is much more widely in use on the frontend, but it suites the backend just as well."
coverImage: "/assets/blog/bringing-the-types-back/bring-it.svg"
date: "2019-06-13T12:00:00.000Z"
author:
  name: Matti Petrelius
  picture: /assets/blog/authors/matti-pic.png
ogImage:
  url: "/assets/blog/bringing-the-types-back/bring-it.svg"
---

![Bringing the Types back to the Back](/assets/blog/bringing-the-types-back/bring-it.svg)

In this post, I will dive into how TypeScript can be utilized on the Backend. TypeScript is much more widely in use on the frontend, but it suites the backend just as well.

This post is a part of a larger **TypeScript in the Back** series. **TypeScript** is taking the web and **JavaScript** development world by storm and it has some interesting implications on how we do things.

This is the second part of the series.

[Part 1: I'd Like Some Type in My Script Instead of Java, Please!](../posts/id-like-some-types)  
[Part 2: Bringing the Types Back to the Back](../posts/bringing-the-types-back)  
[Part 3: Types Are Not Tests and Tests Are Not Types](../posts/types-are-not-tests)  
[Part 4: Serverless TypeScript](../posts/serverless-typescript)

## Where did the types go?

Not too long ago the backend was dominated by languages such as Java and C# - languages which are very much statically typed. These were the golden years of types.

But these days, It's actually the dynamically typed languages that are more popular. Both most popular languages on the backend, JavaScript (Node.js) and Python, are dynamically typed.

Don't get me wrong, Java and C# are still popular and there are newer languages with static typing such as Go and Rust. But the scale is tilted to the dynamic languages.

## So let's bring the types back

There are benefits to dynamic languages. It is easier to get moving with them and writing code without type annotations feels fast. Also, the absence of a compilation step makes the development cycle faster. There absolutely situations where dynamic languages are a perfect choice.

But like I wrote in the last post [I'd like some Type in my Script instead of Java, please!](../posts/id-like-some-types), there are clear benefits to static languages also. Static typing makes it easier to avoid certain types of bugs and it makes it easier to refactor the code.

The solution is of course TypeScript. TypeScript allows developers to still use the same tools they are used to with JavaScript while introducing static typing to the mix.

## Building and running TypeScript in Node.js

If you are familiar with how TypeScript works with the frontend these days, then you know that you usually have a module bundler such as Webpack and the bundler will need a plugin or something to load the TypeScript files. But since you don't usually bundle your Node.js application, you can just run the compiler.

TypeScript compiler is `tsc` and you can install it globally:

```
npm install --global typescript
```

or just to the project with:

```
npm install --save-dev typescript
```

The benefit from installing TypeScript to the project directory is that allows having different versions of TypeScript in different projects.

In the simplest example, you would have a TypeScript file `index.ts` and you run the compiler with:

```
tsc index.ts
```

It generates the `index.js` file that you can run normally with:

```
node index.js
```

You can combine these two commands to a single NPM `start` script as:

```json
"scripts": {
  "start": "tsc index.ts && node ."
}
```

Here `index.js` is replaced with `.`, which means the current directory and Node.js looks for an index.js file in it.

### But what if you have more than one TypeScript file?

In a more realistic app, there is more than one TypeScript file. You could just list all the files like:

```
tsc file1.ts file2.ts file3.ts
```

but that would get cumbersome and boring fast.

Also, you might not want the outputted JS files to reside in the same directory with the TS source code. For this and for other compiler options, a `tsconfig.json` file can be added to the root of the project.

After adding the `tsconfig.json` file, compiling the code is as easy as:

```
tsc --build
```

or just

```
tsc
```

So your NPM scripts in `package.json` for building and running TypeScript would be:

```json
"scripts": {
  "build": "tsc --build",
  "start": "tsc --build && node ."
}
```

Now to build the project you would simply:

```
npm run build
```

and to run the app:

```
npm start
```

### The insides of a tsconfig.json file

If you want to start fast you can create a new tsconfig.json file with:

```
tsc --init
```

It creates a file with minimum configuration but also with a ton of comments.

Here's an example of what a `tsconfig.json` file in one of my more simple Node.js app looks like:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "outDir": "dist",
    "rootDir": ".",
    "sourceMap": true,
    "strict": true
  }
}
```

#### module

`module` is the module system to use in the compiled output. CommonJS is the module standard that Node.js uses so that's what we want when building a Node.js application.

#### target

`target` is the ECMAScript target version. With Node.js `es6` has usually been the target. It means that the resulting code will be almost identical to the TypeScript excluding the type annotations. However, since Node.js 8.x it has been possible to safely target `es2017` as well. The difference is that with `es6` target TypeScript compiles `async/await` to a contrived looking and more verbose `__awaiter` polyfill.

For example this beautiful await/async:

```typescript
async function f2(): Promise<boolean> {
  return true;
}

async function f1(): Promise<boolean> {
  return await f2();
}

f1().catch(console.error);
```

compiles down to this crazy JS code:

```javascript
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function (resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
function f2() {
  return __awaiter(this, void 0, void 0, function* () {
    return true;
  });
}
function f1() {
  return __awaiter(this, void 0, void 0, function* () {
    return yield f2();
  });
}
f1().catch(console.error);
```

and with target `es2017`, the JS output is the same as TS source code, excluding the type annotations:

```javascript
async function f2() {
  return true;
}
async function f1() {
  return await f2();
}
f1().catch(console.error);
```

Of course, this is not super important since there is probably not a very big effect on performance and the only noticeable difference is the length and readability of the code. Length or size of the app does not really matter in Node.js as much as in a web app. Also very rarely should you have to read the JS output. Source maps make it possible to debug your app while reading the TS source code instead of the JS that gets run.

#### outDir

`outDir` is simply the directory where you want the output JS files to be generated. The output will maintain the structure of the source code files and their directories inside the outDir.

#### rootDir

`rootDir` is the directory where TypeScript compiler will start looking for TypeScript source code files. Usually, this is the root directory of the project or for example `src`. You don't have to explicitly set this value which will make the compiler to look for all TS files in your project directory.

#### sourceMap

`sourceMap` controls whether the compiler should in addition to the JS output files generate a source map `.js.map` file. These are files for the debugger that it can use to show the actual TS source code instead of the running JS code. It makes a huge difference if the compiled JS differs a lot from the TS code. So I recommend always set this to `true`.

#### strict

`strict` is an option to enable all strict type checking options. TypeScript has multiple levels of strictness you can apply to your type checking. Depending on your goals and starting point you might want to tweak how strict the type checker is going to be.

If you set it to `true` then the following options will be enabled:

- noImplicitAny
- noImplicitThis
- alwaysStrict
- strictBindCallApply
- strictNullChecks
- strictFunctionTypes
- strictPropertyInitialization

##### No implicit any

If you write TypeScript without type annotations then some times TypeScript is smart enough to infer the types for variables, return types and so on. But some times there is not enough information to infer the type so an implicit `any` type is given. When `noImplicitAny` is enabled, then all of these implicit any types will cause a compiler error. This helps to find mistakes in code, where a strong typing was desired but a missing type annotation actually causes the compiler to accept values of all types.

##### No implicit this

Using this in JavaScript is notoriously error-prone. It is **so** easy to write code where you think `this` refers to the object inside which the function is declared, without explicitly binding the function to the object. `noImplicitThis` helps by giving a warning if this is used in an implicit way.

##### Always strict

Always strict outputs `"use strict";` to all JavaScript output files which will make them run in a `strict` operating context. Running in strict mode prevents certain dangerous actions and gives more useful exceptions.

While TypeScript with modern editors and linters already warns and hints for many mistakes, it is still a good idea to have JS run in strict mode, because it makes the Node.js runtime also check the outputted code.

##### Strict bind call apply

This is a fairly new option introduced in TypeScript version 3.2 which enables strong type checking on bind, call and apply function object methods. With these methods, you can do some surprising things and easily get into trouble. The strict type checking helps to avoid errors with them.

##### Strict null checks

This is probably my favorite strict option because it puts the compiler into a strict null checking mode. In this mode, there are strict limitations to how null and undefined should be handled. Naturally, this is to avoid the dreaded `Cannot read property 'x' of undefined` error and other errors related to null and undefined.

In strict null checking mode, you have to explicitly say in the type that it can be null or undefined. Otherwise, it is illegal to set null or undefined to it. For example type `T` does not accept setting it to null but type `T | null` does. This also leads to the fact that since you cannot assign a value of type `T | null` to `T` you have to first check the value for null so it becomes `T`. And all of this is checked by the compiler, and you will get a compiler error instead of running into the error while running the code!

##### Strict function types

This one is a bit tricky and has to do with things called covariance and contravariance. Type theory can be a bit much sometimes, but even this option is not insignificant. It helps to avoid errors in situations where you are dealing with functions that have parameters which are of a subtype of a type. It might be you never run into these, but I think it is safer to leave it on, and if you run into issues with it then it just like the other strict options can be individually opted out from.

##### Strict property initialization

This one requires that the `strictNullChecks` option is also enabled. It requires you to either type class properties as possibly undefined, add explicit initializers to them or explicitly set a value to them in the constructor.

## Visual Studio Code and debugging

Visual Studio Code has really great support for debugging Node.js applications. It makes it easy to step through the code and see what values are assigned and what is really happening without littering the code with console.logs.

You can get the same experience while using TypeScript as well. You just have to change the default Node.js debugging configuration a bit.

### Setup basic Node.js debugging configuration

When you create a new Node.js app or open an app that does not have debugging configured yet, you can see an indicator in the debug view that you don't have any configurations yet but you can let Visual Studio Code create it for you.

![VS Code Debug Configuration](/assets/blog/bringing-the-types-back/vs-code-debug-config.png)

Click on the cog wheel icon and choose Node.js as the environment. VS Code will create a launch.json for you with the configuration needed to debug a Node.js app. The problem is that you might need to check the program path so that it points to the actual outputted main entry point JS file if it is in a different output directory.

Another thing you need to add is the TypeScript build pre-launch task: `"preLaunchTask": "tsc: build - tsconfig.json"`

After that your launch.json should look something like this:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}\\index.js",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/**/*.js"]
    }
  ]
}
```

Try running your app in debug by hitting the `F5` key or choosing `Launch Program` from the debug view. If everything goes well, you should get the app running and be able to hit breakpoints, evaluate values and set watches and so on.

One thing to note is that you cannot set breakpoints to the TypeScript code unless you set `sourceMaps` to `true` in the tsconfig.json file!

## Summary and what comes next

That's about it, what you need to know to use TypeScript in your Node.js code! Though there are still some issues you are bound to run into if you start using TypeScript in larger Node.js app. In the next blog post, we'll dive into those things.

I personally think that having TypeScript in Node.js is worth all the extra effort it takes to get it running. Somehow it is even surprising that TypeScript is not more popular in the backend. Most of the Node.js libraries have good typings that you can install from the `@types` NPM registry. For example, you will quite fast run into the situation where you import a Node.js base class library module like `fs` and get a compiler error that it can't find that module. To fix this issue you must install typings for Node.js:

```
npm install --save-dev @types/node
```

This was the second part of a four-part blog post series that I'm working on. The rest of the series deep dive more into how to use TypeScript in backend development.

### TypeScript in the back series

[Part 1: I'd Like Some Type in My Script Instead of Java, Please!](../posts/id-like-some-types)  
[Part 2: Bringing the Types Back to the Back](../posts/bringing-the-types-back)  
[Part 3: Types Are Not Tests and Tests Are Not Types](../posts/types-are-not-tests)  
[Part 4: Serverless TypeScript](../posts/serverless-typescript)

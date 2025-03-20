---
title: Hello visitor number {visitCount}!
coverImage: "/assets/blog/hello-visitor/hola.jpg"
date: "2020-07-23T12:00:00.000Z"
author:
  name: Matti Petrelius
  picture: /assets/blog/authors/matti-pic.png
ogImage:
  url: "/assets/blog/hello-visitor/hola.jpg"
---

For some reason, 🙄 visit counters are not so popular anymore. There are undoubtedly younger web devs that have never seen one.
That and for no other particular reason, I thought it would be cool to bring them back.

![Hola](/assets/blog/hello-visitor/hola.jpg)

<span>Photo by <a href="https://unsplash.com/@jontyson?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Jon Tyson</a> on <a href="https://unsplash.com/s/photos/hola?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

> ### Preface
>
> The last post on this blog was written in November last year (8 months ago 😬)
>
> When I started this blog I made a promise to myself to keep writing the blog despite there being other important matters to attend to.
> I set an ambitious goal of writing a new blog post every week.
>
> Last September I started working for a new company. Not only was the company new but it was a total culture for me.
> I work for a much larger company than I previously have. I switched from the comfortable Microsoft tech stack that I had been honing my skills in for 10+ years
> to writing JavaScript full-day.
>
> So it's feel's an understatement to say that it has taken a lot of time and energy to get comfortable with the current situation.
>
> But enough with the excuses. I'm back writing this blog and hope that this post will be the first of the many to come.

## Visit counter

Do you recognize this?

![A visit counter](/assets/blog/hello-visitor/visit-counter.png)

Sorry about the pixelation but this screenshot is from a time with a lot less resolution. These things used to be all the rage.
In the times long before Google Analytics (before Google actually), the way to record the number of visits or hits on your HTML page
was to use a **visit counter**. It was also instant bragging rights if you managed to get it to show a gigantic number like 10000 visits or something.

Visit counter is a very convenient excuse for me to do something I have not yet done for my blog. To have a backend API endpoint and persist data to a database.
Back in the day, the first visit counters would just store the number of visitors to the server's memory. This is why it would only show the number of visitors since
the last reset. Whenever the server would restart the counter would reset, much to the web master's disappointment. I wanted to make a more advanced visit counter
that would actually persist the number of visitors, forever!

## Going beyond a static site

One of the reasons why my blog is so _"blazing fast"_ ™️ is that it's built with **Gatsby** which is a static site generator. The idea is not new, but it's still quite popular
and Gatsby brings some original twist to it. Static sites are fast because they just serve HTML, JavaScript, and CSS, and nothing is being rendered or calculated on the backend.

But it's not that restricted with Gatsby. Because Gatsby runs on React, it is actually composed of React components, which can have life cycle methods, state, and side effects just like a regular
React app.

Gatsby uses the server-side rendering capabilities of React apps to pre-render whatever it can. Then it uses React hydration to execute the rest of the code client-side.
This way you can create what Gatsby calls a hybrid app that does some of the data fetching build-time and some of it on the client.
This results in an optimal way of combining pre-fetched static content with dynamic content that is fetched in the client.

## Netlify functions

![Netlify](/assets/blog/hello-visitor/Netlify_logo2.svg)

I love serverless. Serverless is not always as easy as it promises to be, but the main value-prop of the technology is still sound to me.
Especially when developing a blog, I'm looking for options that can help me to have a very lightweight backend and keep the costs down (at least until the popularity blows up 😂)

My blog is deployed to [Netlify](https://www.netlify.com/) which is a sweet hosting platform. They offer a static site for free and they have some other treats to go with that.
One of them is **Netlify functions**.

Netlify functions are actually just easy-to-use **AWS Lambdas**. Because they are offered as an easy to use service, they are a bit more expensive though.
They give you 125k executions for free and after that, it's **\$25 a month**. For startups and entrepreneurs, the cost is probably not that bad but personally, it makes me think
if I should switch to just using AWS Lambda or some other serverless offering. But to go over the 125k limit,
I would have to have more than 62500 visits a month (each visit triggers two function calls).
Now according to Google Analytics, I'm getting about 300 visits a month so I think I'm safe for the time being 😎

## FaunaDB

![FaunaDB](/assets/blog/hello-visitor/fauna.jpg)

Probably the most interesting piece of technology in the stack I've chosen is [FaunaDB](https://fauna.com/) You could call it a **database as a service** (DBaaS).
Another way to describe it would be an API for storing and reading your application state.

Serverless functions are almost always stateless and it can become a problem in certain scenarios.
To overcome this problem and to make your functions stateful you need to use an external data store.
Not all data stores and databases are ideal for a serverless app though. Some of them might be slow to connect since they are meant to be used over a single persisted connection.
Some might have a high upfront cost because they are meant for large datasets, hardly ideal for use cases like my cute little visit counter.

So I need something that scales up from the very minimal size, is fast for every query, and preferably does not cost a lot (maybe even free). Fauna DB fills all of those requirements.

The basic offering is free. It comes with quotas of max storage of 5 GB, 100k read ops per day, 50k read ops per day, and data transfer out of 50 MB per day.
Those are more than enough for my purpose. After that, you will be billed based on usage.

FaunaDB has its own query language **FQL** which some may like and some feel is kind of unnecessary abstraction. It takes some time to learn a new language but once you get the
hang of it, it's not that bad. I have to say that it took me maybe a bit longer than I would have wanted to get started.
Creating API keys, databases, collections, and indexes took some time to master, but in the end, it worked out just as well as I hoped.

## How to make your own visit counter

So let's start with the steps to get the counter done.

1. Create a FaunaDB account
2. Install FaunaDB CLI (Fauna shell)
3. Create the database, user, collection and index
4. Install Netlify CLI
5. Create a Netlify function for creating a visit
6. Create a Netlify function for getting the visits
7. Call the APIs from the frontend

Quite many steps for a simple visit counter, but fortunately they are not that big steps.

### 1. Create a FaunaDB account

Go to https://fauna.com/ and signup.

> 💡 A word of advice, if you signup with GitHub or Netlify, you need to create a secret key to use with the Fauna shell.
> It might not be a big deal but there are two ways to create the secret key and make sure you create it from account ``settings / account api keys`,
> so that you don't end up creating child databases as I did 🙈

### 2. Install FaunaDB CLI (Fauna shell)

Install Fauna shell with

```bash
npm install -g fauna-shell
```

### 3. Create the database, user, collection and index

Okay, this is one of the trickier parts, so bare with me.

Start by logging in to Fauna shell

```bash
fauna cloud-login
```

This will prompt you for either email and password or the secret key (if you signed up with GitHub or Netlify).
If you need the secret key you can create it from the console by going to your **account settings** and **account api keys**.

Once you log in, you can go ahead to create your database. But first, you need to start up the Fauna shell, where the rest of the commands will be run.

```bash
fauna shell
```

#### Create the database

Okay, we need a database, let's call it `my-app` or something just as ingenious.

```js
CreateDatabase({ name: "my_app" });
```

Just type the FQL script to the shell. If you want to split the queries into multiple lines, you can easily do it by pressing return.

#### Create a server key

Once the database is created it is recommended to create a **server key** that has access to just that DB (instead of using an admin user) so let's do that

```js
CreateKey({
  database: Database("my_app"),
  role: "server",
});
```

Grab the server key from the response, it is only shown this one time so make sure to put it somewhere safe.
With Gatsby what I did was put it in the `.env.development` file which makes it available locally when developing.
I then added it as an environment variable to my app in Netlify as well.

> 💡 Make sure `.env.development` is in your git ignore file!

After this, you need to exit the current shell, because we want to access the specific database we just created.
Exiting can be done with

```js
.exit
```

> 💡 You could also now switch to using your server key, but you can also use the admin key you are already logged in with.

Now just start the Fauna shell again but this time provide the database you want to access.

```bash
fauna shell my_app
```

#### Create the collection

The collection will be holding our visitor data, so let's create it.

```js
CreateCollection({ name: "visits" });
```

#### Create an index

One last thing we need, so we can query the documents from the collection is an index.
We will create an index for getting all the visits. There are many more kinds of indexes you can create.

Check https://docs.fauna.com/fauna/current/api/fql/indexes for more information.

```js
CreateIndex({
  name: "all_visits",
  source: Collection("visits"),
});
```

### 4. Install Netlify CLI

That takes care of the database stuff. Now we need to create the functions that act as the backend API.
But to be able to run them locally we need to install Netlify CLI.

```bash
npm install netlify-cli -g
```

### 5. Create a Netlify function for creating a visit

Okay, so first of all the Netlify functions are run from a special directory `.netlify/functions` from the project root.

We need to create a new directory `.functions` into our application root and a new file inside it named `visits-create.js`.

#### visits-create.js

```js
const faunadb = require("faunadb");
const q = faunadb.query;
const serverClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

const handler = async (event) => {
  const data = {
    remoteAddress: event.headers["client-ip"],
    userAgent: event.headers["user-agent"],
    time: new Date().toISOString(),
  };
  try {
    const response = await serverClient.query(
      q.Create(q.Collection("visits"), { data })
    );
    console.log("success");
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

module.exports = { handler };
```

> 💡 You might notice there's a `FAUNADB_SECRET` environment variable in the code. That's the secret key we created earlier for the database.

### 6. Create a Netlify function for getting the visits

We need another function to get the visits. Let's create a function called `visits-get.js` in the `functions` directory.

#### visits-get.js

```js
const faunadb = require("faunadb");
const q = faunadb.query;
const serverClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

const handler = async () => {
  try {
    const response = await serverClient.query(
      q.Paginate(q.Match(q.Index("all_visits")))
    );
    console.log("success");
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

module.exports = { handler };
```

## 7. Call the APIs from the frontend

Cool! 😎 We're almost done! Now we just need to call our functions from the frontend. My frontend is a Gatsby app so it's basically just a React app and I can call the
functions which are just API endpoints with fetch in the `componentDidMount` method of my `index.js` component.

#### index.js

```js
componentDidMount() {
  const getAndUpdateVisits = async () => {
    const response = await fetch('/.netlify/functions/visits-get', {
      method: 'POST',
    })
    const { data } = await response.json()
    this.setState({ visitCount: data.length + 1 })
    await fetch('/.netlify/functions/visits-create', {
      method: 'POST',
    })
  }

  getAndUpdateVisits()
}
```

And that's it! We have the visit count in the state. Except that if you tried to run this code it would throw an error about trying to assign `visitCount` to a null value.
We must also add a constructor where we will create the initial state for the component.

```js
constructor(props) {
  super(props)
  this.state = {
    visitCount: 0,
  }
}
```

We also didn't cover anything about the actual visit counter component. So here is how it's used and the implementation.

#### index.js

```js
<VisitCounter visitCount={this.state.visitCount} />
```

#### VisitCounter.json

```js
import React from "react";
import styled from "styled-components";

const DigitContainer = styled.div`
  text-align: center;
`;

const Digit = styled.span`
  margin: 1px;
  padding: 2px 4px;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    180deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(10, 10, 10, 1) 50%,
    rgba(19, 19, 19, 1) 50%,
    rgba(32, 32, 32, 1) 100%
  );
`;

const VisitCounter = ({ visitCount }) => {
  const paddingZeros = "0".repeat(6 - visitCount.toString().length);
  const visitCountText = `${paddingZeros}${visitCount}`;

  return (
    <DigitContainer>
      {visitCountText.split("").map((c) => (
        <Digit>{c}</Digit>
      ))}
    </DigitContainer>
  );
};

export default VisitCounter;
```

I spiced it up with some CSS visuals to make it more old school like. Here's what it looks like (zoomed in):

![The final counter](./final_counter.png)

You can run the Gatsby app with the Netlify functions locally by using the Netlify CLI

```bash
netlify dev
```

So there you have it! The visit counter reborn! I'm so happy to be creating something so useful 😎.

## Summary

In all honestness, I find features and implementations like this inspirational in the current way of things. The whole **JAMStack** movement feels getting air under its feet
and it brings new innovative ideas to the genre.

Much of this blog post was written with tongue in cheek, but the core ideas and technology is still very much sound.

I think one of the greatest things at the moment in web development is that there is so much momentum to find the next best thing. React has been dominating for a long while
but people seem to agree that it's not a complete solution to all our problems. Static site generators have a place as well. But then there are players like [Next](https://nextjs.org/)
who like to mix things up even more. We are trying to find the correct balance between server-side and client-side rendering. Whether we want to render in build-time (prerendering)
or to render on-demand (client-side). It's just really nice to see we have a lot of different options.

For example, I have been wondering if it would be a fun exercise to migrate my blog to Next or maybe something like [Redwood](https://redwoodjs.com/)

Anyways, thanks to anyone who has read this far. Please if you have any thoughts about what I wrote, please comment on Twitter!

## Edit: A bug in the counter

After posting this, I noticed the counter didn't seemed to be working anymore. Of great! Who would have guessed it, I just wrote a blog post of a broken counter 💩.
But like a good programmer after some sobbing, I turned to debugging it. My first fear was that something was broken with the write function since it seemed to be getting some number of visitors.
Maybe it was just not writing new visits.

But after checking the logs on Netlify, it looked like everything was fine. No errors visible. So what could it be?

Turns out the problem was reading the visits after all, more exactly this FQL query:

```js
q.Paginate(q.Match(q.Index("all_visits")));
```

I should have guessed the `Paginate` function will get me into trouble, but I didn't expect it to happen so soon.
I knew it only returns a single page of the results and not all of them, but it turns out it has a default page size of `64` 😡.
That's why my counter was always stuck on `65` (one more than the page size, since we always add the current visit to the number in database)

A quick-and-dirty fix was just to raise the page size

```js
q.Paginate(q.Match(q.Index("all_visits")), { size: 10000 });
```

That'll do for now, but a more sustainable solution will be to loop through the pages until there are none.
And maybe keep the page size a bit lower, to keep the memory usage also lower.

---
title: React and Serverless
excerpt: "Last week I was extremely lucky to get to attend two amazing events held here in my home town Helsinki. And I even got to talk at one of them. Slightly unfortunately the events overlapped a bit so I could not be present at React Finland for both thursday and friday."
coverImage: "/assets/blog/react-and-serverless/title.png"
date: "2019-04-30T22:12:03.284Z"
author:
  name: Matti Petrelius
  picture: /assets/blog/authors/matti-pic.png
ogImage:
  url: "/assets/blog/react-and-serverless/title.png"
---

Last week I was extremely lucky to get to attend two amazing events held here in my home town Helsinki. And I even got to talk at one of them. Slightly unfortunately the events overlapped a bit so I could not be present at React Finland for both thursday and friday.

So the events were of course [ServerlessDays Helsinki](https://helsinki.serverlessdays.io/) and [React Finland](https://react-finland.fi/). Both interesting but also very different events.

ServerlessDays is an international event that was held in Helsinki for the very first time. It was also the most northern ServerlessDays event held so far. It managed to gather an audience of about 200 people which was impressive considering it was first of it's kind in Finland.

React Finland was held for the second time. I didn't attend last year so I don't know how this year was different but I had a feeling that this year's event was bigger in many ways. It surprised me in being a fairly large event but still being very honest to it's roots. The organizers clearly wanted to make an event that felt like their own kind of event.

I have previously mostly been only to Microsoft events (I did go to one AWS event last year). Both ServerlessDays and React Finland were very different from what I'd been used to. There were very little talks about products and features and most talks were about something really personal to the speaker. I like how it felt like nobody was selling me anything or I wasn't being convinced of the superiority of specific vendor's products.

## ServerlessDays Helsinki

<img alt="ServerlessDays Helsinki" src="./unicorn_mascot.svg" style="height: 300px">

ServerlessDays Helsinki was an incredible experience for me in many ways. First of all it was the first Non-Microsoft event I was a speaker in. Also the organizers did an amazing job as making us speakers feel welcomed. For the first time I got to attend a speakers' dinner where I got to meet all the other speakers and get to know them before the actual event.

I gave a talk called **Real-life experience building a chatbot on Azure Functions**. The talk went really well and I got a lot of good questions and feedback. I had good talks about Azure Functions, serverless and cold-starts during the evening after my talk. You can find the slides for my talk [here](https://www.slideshare.net/MattiPetrelius/reallife-experience-building-a-chatbot-on-azure-functions).

Other talks were all also really interesting. To mention a few the event opened up with a talk by **Sheen Brisals** called **Serverless Journey of shop.LEGO.com**. It is always cool to hear talks about real-life scenarios and Lego as a company is especially interesting. This was also probably one of the most complex examples of a serverless architecture I've seen so far.

Sheen talked about how they went from a online shop that crashed and was down for two hours on Black Friday to a serverless system built on AWS Lambda.

There was also a talk about how to do chaos engineering in a serverless environment by **Emrah Samdan**. **Bruno Almeida** talked about **Google Cloud AI**, which was refreshing because most of the talks were about AWS. **Davide Taibi** gave a really interesting talk about **Serverless patterns and anti-patterns**.

I met so many awesome people at the event that I won't try to mention all of them here. I'd just like to thank all of the organizers, sponsors, speakers and attendees for making it one of the best events I've ever been to. I'm really looking forward to ServerlessDays Helsinki next year.

## React Finland

<img alt="ServerlessDays Helsinki" src="./react-finland.svg" style="height: 250px">

After the amazing ServerlessDays Helsinki I attended React Finland on the second day. React Finland was an (at least) three day event, but I skipped the workshop day and since ServerlessDays Helsinki overlapped the first conference day of React Finland, I also missed the first conference day.

But fortunately I was able to attend the second day. Fortunately, because it was a very different experience than ServerlessDays Helsinki.

Of course, being a speaker at an event is very different from just attending. So I can't make a straight comparison of the two events. But there was a very different kind of vibe about them.

React Finland felt more about the React community. A lot of the talks felt like they were not strictly about React but they were about the things that were important to the speakers personally and the community.

Many of the speakers and the MCs **Jani** and **Sara** were interesting characters in themselves and the actual contents of the talks sometimes took a back seat.

I'm not saying there were not some really good talks. The ones that stuck to my mind were **The Untouchable Web** by **Rick Hanlon**. Rick works on the React Native team at Facebook and he talked about how providing a good experience on people with touch devices is not a simple task. He made a good case for React Native Web.

And also the talk **Scalable (Design) Systems with TypeScript** by **Tejas Kumar** was an interesting play on how TypeScript and Design Systems have the same sort of benefits and he had some cools code playgrounds powered by the Monaco Editor.

Some other talks I liked were **Web Assembly - The Next Big Platform** by **Sven Sauleau** and **Building resilient frontend architecture** by **Monica Lent**. Though I wish the Web Assembly talk would have convinced me a bit more about why I should use WASM. I'm still not completely sold on the idea, even though I find it a really interesting technology. Monica's talk about architecture was extremely insightful and smart.

The long week was taking it's toll on me and I did not meet as many people at React Finland as I was hoping for. But the ones I met, we had some good conversations with. I missed the after party also, which I believe was quite epic, and instead went for a couple beer with my colleagues. But I trust there's going to be React Finland next year too, so maybe I'll do a better job then.

## In Summary

All in all the week was very demanding and also extremely rewarding. I met more people at ServerlessDays Helsinki and talking at events is always special so that was definitely the highlight of the week for me.

I strongly recommend everyone to try giving talks at events. Many events have CFP:s where anyone can suggest a talk. And if you don't first get accepted, don't let it get you down, just try again for another event. It's completely worth it, trust me.

## Serverless and Web Development

You'd think that after these two events I'd have learned a ton about serverless and web development, and in a way I did and then again I didn't.

Somehow it made me understand how much there is still that has not been really figured out, especially in serverless. There are a lot of issues related to performance, vendor lock-in, tooling, monitoring and testing. Also the so called best practices are not clear and many of us are still just figuring them out.

React itself has started to mature and stabilize very nicely. The APIs (with the recent addition of hooks) are getting more complete and there are some really well formed best practices emerging. But it seems that what is not complete at all is all the other features surrounding React, like the state management and styling of components.

Whether Redux is truly dead or not and what it's replacement should be seems to be a continuous question. Also CSS in JS feels like a good thing but it does not come without some caveats.

There seems to be a rise of design systems, but so far I haven't figured out whether it's preferred to pick one of the already open libraries written by large corporations or to make my own system.

I do firmly believe however that both serverless and React are things that we will continue to hear more about. So many people are interested in them and both have not yet reached full potential. It's really cool to be living in an era where I can watch them grow and see how they evolve as technologies.

In my last post I wrote about how serverless and web development were very close to each other and I still kind of feel like it's true. But after these two events I also see a large gap between the two of them.

Serverless seems to be a bit more of thing for the backend developers while web development is more and more about the frontend. This is also evident by the fact that there were almost no people in addition to myself attending both ServerlessDays Helsinki and React Finland. Partly obviously because the events were overlapping but also because not many people are interested in both.

I hope this isn't a sign that backend and frontend developers are drifting farther and farther away from each other. I still have hope that the ease and simplicity of serverless backends will allow for developers to keep being fullstack at least to some extent. Both frontend and backend development does not need to get more complicated. We have the right ideas, now we just need to learn how to use them correctly.

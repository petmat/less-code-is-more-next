---
title: Build 2019
coverImage: "/assets/blog/build-2019/title.png"
date: "2019-05-07T22:12:03.284Z"
author:
  name: Matti Petrelius
  picture: /assets/blog/authors/matti-pic.png
ogImage:
  url: "/assets/blog/build-2019/title.png"
---

![Build 2019](/assets/blog/build-2019/title.png)

Build is the main technology conference for Microsoft where they announce the most significant new features of Azure, Office 365 and Windows. Each year every Microsoft developer is looking forward to the event to hear about where Microsoft is focusing on and what the future will look for them.

In the last years, Azure has become one of the biggest topics in Build and for a good reason. Cloud is more and more important for Microsoft as well as it's competitors AWS and Google.

Personally each year in Build the most interesting news revolves around Azure and more precisely **Azure Serverless**. In my blog, one of the main points of interest is serverless and I have a long history of being a Microsoft developer so Azure Serverless in a natural fit for me.

## Why so excited?

First a bit of context to why and what I was looking forward going into Build 2019.

Last year serverless played a big part at Build and all the other major Microsoft tech events. There were a lot of talk and demos even in the keynotes about Azure Functions, Logic Apps, Eventgrid, etc.

AWS took it event further in re:Invent 2018 where serverless was just everywhere and their message was Serverless-First.

So, coming to this years Build I was just expecting serverless to be as big as ever and there to be some really cool announcements about for example Azure Functions.

## The meat and potatoes

Like any large conference Build 2019 kicked off with keynotes that painted the direction of Microsoft and Azure and highlighted some of the most important news and announcements.

There was first a vision keynote by Microsoft CEO **Satya Nadella**, which to be honest was not so interesting for me since it is less technical and more about the broader vision in technology by Microsoft.

After the vision keynote, more technical keynotes followed and of them, the most interesting personally was the Azure keynote.

I was honestly a bit surprised how little serverless played a role in the keynote. It was barely mentioned as a word and even Azure Functions did not make a big appearance. Keynote focused more on edge computing, hybrid-cloud and Kubernetes.

There were some interesting announcements that were serverless related though in the keynote and even more announcements came the next day in the sessions. The rest of this blog post is about the serverless things in Build 2019 that I personally found the coolest.

## Azure Functions Premium plan

Though not entirely a new announcement at Build, this probably came as a new thing for most.

Azure Functions Premium plan takes a new twist on trying to solve the problem of cold-starts in serverless. Instead of trying to minimize the cold-start times it aims to get rid of them completely.

The way it works is that if you run your Azure Functions on a premium plan, there will always be one warm instance of your function waiting. What it means is that once your function gets called it will respond as fast as possible without any additional cold-start penalty from starting up a cold instance. Once the warmed up instance is running, a new instance is immediately warmed up to make sure it's ready if and when another function call happens.

I've known about Premium Plan for some time now since I've been following closely on the improvements in Azure Functions. From the first time I heard about it, it seemed a bit odd. I love the fact that it promises us a way to get rid of cold starts altogether, but at the same time, I'm confused about the fact that it seems to just circumvent the issues around cold start. It does not offer us a solution to fix them, it instead makes us think that we might not have to pay those penalties at all.

However, there will undoubtedly be scenarios, for example in enterprise applications, where the extra performance guarantees are worth the increased costs.

One interesting approach to Azure Functions Premium plan is to not use it constantly but to switch to it programmatically when a high load is expected and to otherwise use the less expensive default consumption plan.

To read more about the Azure Functions premium plan look [here](https://azure.microsoft.com/en-us/blog/announcing-the-azure-functions-premium-plan-for-enterprise-serverless-workloads/)

## New stateful patterns for Durable Functions

This announcement is part of the Durable Functions 2.0 preview that was maybe a bit of a sleeper announcement. Durable Functions is not the most well-known feature on Azure and even many developers who use Azure Functions do not know much about Durable Functions.

Probably the biggest reason is that they are a fairly new feature (released in preview 2017) and that the same kind of orchestration can also be achieved with Logic Apps which is a much more well known and utilized service. Durable Functions is still struggling a bit to find a place for it.

Nevertheless, with features like the new stateful patterns, Durable Functions is starting to find it's use cases. For those who are more familiar with building distributed systems than for example integrations, Durable Functions might be a better fit with patterns that already look and sound familiar.

The new stateful patterns are made possible by something called **Entity Functions**. Entity functions can read and update pieces of state called **Durable Entities**. Entity functions don't have the same code constraints as **orchestrator functions** and they manage state explicitly.

Here is a code example of an Entity Function:

`gist:petmat/d41fcc75f2ec312dd866a817124e8cf6#EntityFunction.cs`

The concepts around Durable Entities is heavily influenced by the actor model. If you are familiar with it you should also find Durable Entities easy to reason about. Be aware that there are some important differences between them though.

As far as I can tell, at the moment the new patterns are only available for C#, but I can't be sure.

You can read more about stateful Durable Functions [here](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-preview)

## Preview of Azure SQL Database serverless

There was a big announcement of the new Azure SQL Database serverless offering. What it means is that there will be a new tier that provides something called hyperscale that basically eliminates the need for pre-provisioning the database resources. This makes your SQL databases serverless in Azure in the fashion that CosmosDB is already. It also follows in the same tracks as Aurelia Database does in AWS.

This is by no means a small announcement. One of the biggest caveats of SQL databases and benefits of No-SQL databases was how well they scaled and now since SQL databases have fast scaling offerings the benefits of using a No-SQL database are getting slimmer.

Read more about the Azure SQL Database serverless [here](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-serverless)

## KEDA

Probably the second most important serverless announcement at Build was **KEDA: Kubernetes-based event-driven autoscaling**.

KEDA is a collaboration with **Red Hat** to create an open-source project supporting serverless event-driven containers on Kubernetes.

What it really means is that you can host event-driven serverless runtimes such as Azure Functions on hosted Kubernetes services such as **Azure Kubernetes Service (AKS)** and **Red Hat OpenShift**.

This kind of thinking is not completely new. You could already previously host Azure Functions in a Docker container. And there have been frameworks such as **OpenFaaS** that allow you to do event-based serverless apps inside containers and Kubernetes.

Google has already had a platform called [Knative](https://cloud.google.com/knative/) that allows you to run your serverless workloads on Kubernetes. It seems like KEDA is Azure's response to it.

KEDA fits situations where you need to run Azure Functions on-premises or you already have a Kubernetes cluster setup and you want to add some Azure functions to it. Also, it is the only way to currently do Azure Functions on a different cloud platform than Azure.

I personally find KEDA interesting but only time will tell if it really finds the target audience for it. One of the themes in Build this year was the hybrid cloud and KEDA fits that theme well. As the cloud gets introduced to more and more enterprise-level organizations this kind of solutions might become necessary and even the best tool for the job.

You can read more about KEDA [here](https://cloudblogs.microsoft.com/opensource/2019/05/06/announcing-keda-kubernetes-event-driven-autoscaling-containers/)

## Preview of Powershell support in Azure Functions

**Powershell** is the scripting language of choice for many Windows IT professionals and administrators. So the fact that it is supported in Azure Functions makes Azure Functions an interesting platform for automating many IT tasks.

Many might not know but there is now a **Powershell Core** version that runs cross-platform on Windows, Linux, and Mac. This is the version of Powershell that Azure Functions also uses.

While Powershell brings IT automation to the cloud, I don't see it as something that will threaten the dominant Azure Functions languages: C# and JavaScript. It is obviously targeted for different developers, but we'll just have to see what kind of popularity it gets.

If you're interested in writing Azure Functions with Powershell, you can learn more [here](https://azure.microsoft.com/en-us/blog/serverless-automation-using-powershell-preview-in-azure-functions/)

It is also interesting to see Azure Functions finally starting to take advantage of its new language worker model. One of the features of Azure Functions 2.0 is that it should be easier to add new language runtimes. And it is finally starting to show with the recent additions of Java, Python and now Powershell.

What remains to be seen is how good of a tactic it is to constantly add more language support. Surely it will please more developers, but with it comes a burden of also maintaining all these language supports.

Last year AWS announced **Custom AWS Lambda runtimes** which takes a different approach to language support. With it, anyone can include their language and runtime of choice in their Lambda. This in principle gives us unlimited languages for Lambda but in reality, they are also releasing more officially supported languages as well. Maybe this is something that Azure Functions should look into. It is technically possible to [implement your own language worker](https://github.com/Azure/azure-functions-host/wiki/Language-Extensibility#implementing-a-language-worker) in Azure Functions but it is quite a significant amount of work and I haven't heard of anyone that has done it so far.

## Azure Functions Dependency injection for .NET

This is a new feature only for .NET Azure Functions. If you write your Functions in C# you can now utilize the same dependency injection (DI) in Azure Functions that has so far been available for traditional .NET Core applications.

The way you do it is by writing a special Startup class with a Configure method. The Configure method takes an IFunctionsHostBuild parameter that can be used to register implementations for interfaces and classes.

Code example:

`gist:petmat/93e1b735c5c39a88c7fd41032693ddf9#AzureFunctionsDI.cs`

If you're familiar with dependency injection then you will feel right at home with this feature.

Of course, the main advantage of using DI is making the code more testable. When running unit tests you can easily mock the injected dependencies and test the functions without having to for example make actual database queries or call actual APIs.

It's a bit of a bummer to see new features only targeting .NET but this one is quite understandable. It is just an extension of the already existing .NET Core dependency injection feature. And it is debatable whether JavaScript even needs DI, at least in the same sense as it is done in C#.

You can read more about dependency injection in Azure Functions [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-dotnet-dependency-injection)

## New Azure Functions templates in Azure DevOps

Azure DevOps is starting to become a powerful tool for building and deploying software. It is the main tool for doing CI/CD on a Microsoft technology stack.

Azure DevOps has now improved the experience of deploying Azure Functions. They have added a bunch of useful templates.

I haven't done much of DevOps with Azure Functions yet, but from what I've seen, configuring builds and releases has been a convoluted so far. With these new templates, I'm hopeful that now it can be done with less hassle.

You can read more about the new Azure Functions Azure DevOps templates [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-azure-devops).

## My summary

I'm absolutely positive I missed some announcements since there were so many at Build. But instead of a comprehensive list of all the announcements, I tried to point out the ones that caught my eye the most. If you want a list of all the announcements then check out for example [this list](https://azure.microsoft.com/en-us/build-2019/announcements/)

Overall now a week after Build, I feel like there were quite a lot of serverless announcements made. However compared to all the other announcements, serverless did not play as a big role as I expected. I guess I should not be surprised since Microsoft and Azure is about so much more than just serverless, but it still feels a bit odd that a cloud platform is not investing more in serverless.

It makes sense if one thinks about how important enterprise customers are for Microsoft. Enterprise has traditionally had it's very specific challenges and Microsoft has always listened carefully to their needs. As a developer, I do hope that this enterprise heavy concentration of Build will be counter-balanced in the other large Microsoft conferences later this year.

Most importantly I'm looking forward to seeing some serious improvements to cold-start performance in Azure Functions. I hope that all the attempts to reduce cold-start time won't be uninvested because of the addition of Azure Functions Premium plan.

But one thing is clear, Azure and serverless are moving forward and at a breath-taking pace.

## Oh yeah, almost forgot ...

There were also the sessions and talks, a lot of them. Microsoft kindly released all the recorded sessions in a [Youtube playlist](https://www.youtube.com/playlist?list=PLlrxD0HtieHgspNIlv1x2H5_cxSRm7B17) which has 341 videos with lengths ranging from 15 minutes to one hour. I've filtered it to 29 sessions I want to watch but it's still a lot of work. If you're interested, you can find my playlist [here](https://www.youtube.com/playlist?list=PLantYRne0kEVFhYbJSHriKke-1VvxCgHG)

There's also a curated list of Azure Functions related session recordings [here](https://hackmd.io/s/Bk5gtA-nN)

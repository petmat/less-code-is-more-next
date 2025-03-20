---
title: Bonus Round - Utility Types - Part 2
coverImage: "/assets/blog/utility-types-part2/title.jpg"
date: "2019-11-07T12:00:00.000Z"
author:
  name: Matti Petrelius
  picture: /assets/blog/authors/matti-pic.png
ogImage:
  url: "/assets/blog/utility-types-part2/title.jpg"
hashtags: TypeScript, UtilityTypes
---

This post is the second part of a two-part series about **Utility Types** in **TypeScript**. The first part can be found [here](../posts/utility-types-part1).

Utility Types have been a mystery for me a long time until recently so I thought that might be the case for others as well and maybe I should write about them. The main reason why I think utility types are so awesome is that often when dealing with **JavaScript** code and libraries there's a need for complex typing.

![Utility Types](/assets/blog/utility-types-part2/title.jpg)

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@neonbrand?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from NeONBRAND"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">NeONBRAND</span></a>

## Let's pick up where we left off

The [first part](../posts/utility-types-part1) was about these six utility types: `Partial<T>`, `Required<T>`, `Readonly<T>`, `Record<K,T>`, `Pick<T,K>` and `Omit<T,K>`.

In addition to the types, we also learned some features of TypeScript that make implementing types like these possible in the first place.

**In this part** we are going to cover the eight remaining utility types:

- Exclude&lt;T,U>
- Extract&lt;T,U>
- NonNullable&lt;T>
- ReturnType&lt;T>
- InstanceType&lt;T>
- ThisType&lt;T>
- Parameters&lt;T>
- ConstructorParameters&lt;T>

## More magical typing goodness

Before we get going we should learn a couple more features in TypeScript that will help us understand the following utility types and their implementation.

> 💡 This part 2 of utility types assumes that you have already read the part 1 and its **type shenanigans**. If you haven't done it yet, please go read [part 1](../posts/utility-types-part1) because otherwise some of the utility type implementations here will be hard to understand.

### never

`never` is a very special type representing **values that never occur**. It is a bit of an abstract concept but best explained with examples. For example, a function has a return type of `never` if it never reaches its endpoint:

```typescript
function foo(): never {
  throw new Error();
}
```

Also when using type guards that can never be true the value might get a type of never:

```typescript
const a = 1;
if (typeof a === "boolean") {
  const b = a; // const a: never
}
```

Type `never` might seem impractical at first but it is used for example when inferring a type in a conditional type that cannot be false. Try to think of it as the type of values that should not exist in the given context.

### ...

Not even a TypeScript feature but ECMAScript, the **rest operator** can be used to store all the arguments after the `...` operator into a single parameter. For example:

```typescript
function foo(...args: any[]) {
  console.log(args);
}
```

This function can take any number of arguments and log them. The rest operator will be visible in many of the utility type implementations so it is important you know what it is.

### Conditional types

A **conditional type** select one of two possible types based on a type relationship test:

```typescript
T extends U ? X : Y
```

This reads that when type `T` is assignable to type `U` the resulting type is `X` otherwise `Y`.

A rather naive but a clear example of how a conditional type can be used:

```typescript
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : "object";

type T0 = TypeName<string>; // string
type T1 = TypeName<number>; // number
```

### Distributive conditional types

There's one more thing about conditional types. If the checked type is a **naked type** parameter, then the conditional type is a **distributive conditional type**. When distributive conditional type is applied to a union type it is distributed over the union type.

For example the above `TypeName<T>` would return the following for a union type:

```typescript
type T2 = TypeName<string | number>; // string | number
```

### infer

The keyword `infer` is used in conjunction with conditional types. Take a look at the following example:

```typescript
type Unpacked<T> = T extends (infer U)[] ? U : T;

type T1 = Unpacked<string[]>; // string
type T2 = Unpacked<string>; // string
```

`Unpacked<T>` takes a type argument `T` and if the type is an array, it infers **real type** of the type argument `U` and returns it. If the type argument `T` is not an array then the type just returns the type `T`.

`infer` is heavily used in some of the utility types in this blog post.

> 💡 Don't mix up **rest operator** with the **spread operator**. They look the same but have a completely different meaning. The only way to tell them apart is by knowing the context they are used in. To learn more about the spread operator go here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

### Lookup types

Also called **indexed access types**. This is a feature in TypeScript that allows you to query the types of certain properties from a type. For example:

```typescript
interface Foo {
  a: number;
  b: string;
  c: string;
}

type A = Foo["a"]; // number
type AB = Foo["a" | "b"]; // string | number
type BC = Foo["b" | "c"]; // string
```

If you provide multiple properties then a union of the types of the properties is returned. This does not come up in any of the utility types but there's some additional type juggling in the end of this post that uses **lookup types**.

## Exclude&lt;T,U>

This utility type is like `Omit<T, K>` from [Part 1](../posts/utility-types-part1) but for **union types**. It returns a new type that consists of types in `T` that are not assignable to type `U`. Here's the implementation:

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

Remember conditional types? Here we are introduced to one. Also, we are using the `never` type. The implementation reads that if `T` is assignable to `U` return type `never` otherwise `T`. And since the conditional type is also a distributive conditional type, it is applied over union types, resulting in `never` when the type is not assignable to `U`. The `never` is not a possible type so it is simply removed from the union type.

Here's an example of how to use `Exclude<T, U>`:

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

## Extract&lt;T,U>

This is the opposite of `Exclude<T,U>` and therefore also operates on union types. It creates a type with types from `T` which are assignable to `U`. Here's the implementation:

```typescript
type Extract<T, U> = T extends U ? T : never;
```

It's excatly like `Exclude<T, U>` but the true and false expressions are flipped! So the types assignable to `U` will be kept and others removed. Here's an example:

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () => void
```

## NonNullable&lt;T>

This type also operates on union types. It removes `null` and `undefined` types from the given type and returns the resulting type.

Here is the implementation of the type:

```typescript
type NonNullable<T> = Exclude<T, undefined | null>;
```

So in the essence the following type definitions are equal:

```typescript
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = Exclude<string | number | undefined, undefined | null>; // string | number
```

Where you would use this is probably in situations where you have an existing type that has nullable properties but you want to end up with a type without any properties that can have nulls in them.

## ReturnType&lt;T>

This is a type that takes a type parameter that needs to be a function and returns the return type of that function. For example:

```typescript
type T1 = ReturnType<(s: string) => number>; // number
```

Here is the implementation for the type:

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

One situation where you might want to use this is when you have a function that returns an object created with an object literal and is therefore inferred by TypeScript. You could define the type mimicking the object literal but an easier way is to use `ReturnType<T>`:

```typescript
function results(num1, num2) {
  return {
    sum: num1 + num2,
    equals: num1 === num2,
    concat: `${num1}${num2}`,
  };
}

type Foo = ReturnType<typeof results>; // { sum: number, equals: boolean, concat: string }
```

## InstanceType&lt;T>

This is a somewhat mindboggling one. It's not easy to come up with a real-life example of how you would use `InstanceType<T>` but I'll try. First of all, here is the implementation:

```typescript
type InstanceType<T extends new (...args: any) => any> = T extends new (
  ...args: any
) => infer R
  ? R
  : any;
```

What it does is takes a constructor function type and return its return type. A naive example would be the following:

```typescript
class A {
  b = 0;
  c = "";
}

type T = InstanceType<typeof A>; // A
```

But this does not make sense since the resulting type is just `A` so this could have been much easier expressed with just `type T = A`.

But what if we want to declare a generic factory function. Like this:

```typescript
declare function create<T extends new () => any>(c: T): InstanceType<T>;

class A {
  b: 0;
}

const a = create(A); // A
```

Since `create<T>` is a generic function the return type is not explicitly known. The return type also cannot be simply `T` because it refers to the type itself but rather `InstanceType<T>` which means that the function returns an instance of type `T`.

## ThisType&lt;T>

This is one of the most esoteric of the utility types. This type is an exception to the rule in that it does not return a transformed type like all the other ones. It is used to mark the contextual `this` type. As such, it's just a marker interface:

```typescript
interface ThisType<T> {}
```

Take a look at this example (it's directly from the TypeScript documentation. I just couldn't come up with an original example. Not sure there are other examples.):

> 💡 By the way, this utility type cannot be used unless you also enable the `noImplicitThis` compiler option.

```typescript
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

## Parameters&lt;T>

This takes a function type as a parameter and returns a tuple consisting of the parameters of that function. Here's the implementation:

```typescript
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

As you can see here if the type is a function, the parameter types are inferred and returned. Otherwise, any is returned.

`Parameters<T>` is useful for example when you want to create a function that wraps another function. You don't have to know the parameters the function that is wrapped to have it typed if you use `Parameters<T>`. You can even combine it with `ReturnType<T>` to return the return value of the wrapped function:

```typescript
const add = (a: number, b: number) => a + b;

const logAndAdd = (...args: Parameters<typeof add>): ReturnType<typeof add> => {
  console.log(args);
  return add.apply(null, args);
};

const result = logAndAdd(1, 2);
```

## ConstructorParameters&lt;T>

Just like the name implies this is the same as `Parameters<T>` but for constructors instead of regular functions. Here's the implementation:

```typescript
type ConstructorParameters<T extends new (...args: any) => any> =
  T extends new (...args: infer P) => any ? P : never;
```

You could use it to create a factory function like this:

```typescript
class Foo {
  a: number;
  b: number;

  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }
}

const fooFactory = (
  ...args: ConstructorParameters<typeof Foo>
): InstanceType<typeof Foo> => {
  return new Foo(...args);
};
```

Notice that `InstanceType<T>` is used here in the same way `ReturnType<T>` was used with `Parameters<T>`. In a way `InstanceType<T>` is to `ConstructorParameters<T>` what `ReturnType<T>` is to `Parameters<T>`.

## Let's go a bit type crazy

Utility types are super powerful and a testament to the awesomeness of the type system in TypeScript. For more proof, I would like to introduce one very complex but useful type that I found on Stack Overflow (https://stackoverflow.com/a/49725198)

### RequireAtLeastOne&lt;T, Keys>

This is a type that transforms a type so that at least one of the given properties is required.

```typescript
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
```

Here's an example of how to use it:

```typescript
interface Person {
  name?: string;
  age?: number;
  phoneNumber?: string;
  email?: string;
}

type PersonWithContact = RequireAtLeastOne<Person, "phoneNumber" | "email">;

const john: Person = {
  name: "John",
};

const jack: PersonWithContact = {
  name: "Jack",
  email: "jack@someemail.com",
};

const jill: PersonWithContact = {
  name: "Jill",
  phoneNumber: "jill@someemail.com",
};

const joe: PersonWithContact = {
  // Property 'email' is missing in type '{ name: string; }' but required in type 'Required<Pick<Person, "email">>'.
  name: "Joe",
};
```

John is a `Person` with all optional properties. Jack and Jill are of type `PersonWithContact` which is created with the `RequireAtLeastOne<T, Keys>` type. `PersonWithContact` requires either `phoneNumber` or `email`.

Joe is also a `PersonWithContact` but it causes a type error saying that `email` is required. This is because it does not satisfy the typing rule that either `phoneNumber` or `email` are required. The error message does not help us by telling that we could also set `phoneNumber` it simply picks the first of the required properties. Why this happens will hopefully become more apparent by reading further.

### Disassembling RequireAtLeastOne&lt;T, Keys>

Let's take a closer look at the `RequireAtLeastOne<T, Keys>` type. Starting with the type arguments. `T` is the type we are transforming. `Keys` is a union type of the names of the properties we want to change and it must be assignable to `keyof T` which means that the properties given must belong to the type `T`.

The type itself is an **intersection type** of two types:

```typescript
Pick<T, Exclude<keyof T, Keys>>;
```

and

```typescript
{
  [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys]
```

The first part simply collects all the properties from type `T` that are not included in the given list of properties.

The second part is more complex. It loops over the property names in `Keys` and each iteration results in another intersection type of two types:

```typescript
Required<Pick<T, K>>;
```

and

```typescript
Partial<Record<Exclude<Keys, K>, undefined>>;
```

The first type creates a type with the `K` property from the original type and then `Required<T>` to transform that property to required.

The second type looks more complex but it just makes all the other properties optional. It first uses `Exclude<T>` to get all the given properties from `Keys` except `K`. And with `Record<K, T>` creates a new type having those properties all with type `undefined`. And then it changes all the properties to optional with `Partial<T>`.

After iterating over the properties in `Keys` a lookup type `[Keys]` is used to get the types of the properties from the created type. The property types are returned as a union type.

Looking at the previous example type `PersonWithContact` the type that `RequireAtLeastOne<T, Keys>` creates is the following:

```typescript
type PersonWithContact =
  | (Pick<Person, "name" | "age"> &
      Required<Pick<Person, "phoneNumber">> &
      Partial<Pick<Person, "email">>)
  | (Pick<Person, "name" | "age"> &
      Required<Pick<Person, "email">> &
      Partial<Pick<Person, "phoneNumber">>);
```

Getting to this point requires some simplifying by the TypeScript type system but in the end, the type is not super complicated. It does have some repetition and that is the reason type errors are not as perfect as they maybe could be if TypeScript supported this kind of type natively. However, I think this is a good example of how the powerful type system can be utilized to create even more useful types.

## Conclusion

Both [Part 1](../posts/utility-types-part1) and this second part took me a long time to write. This has been one of the most challenging things I've ever written. I'm still not completely sure if I managed to do a good job or not.

I hope it was worth it. At least I learned a lot in the process. There's so much I could write about TypeScript. The more I learn about it the more I feel like I get sucked in.

And the language keeps constantly evolving. Today version [3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) was released and it contains some long-awaited and cool new features. Maybe I'll write about them next 🙂

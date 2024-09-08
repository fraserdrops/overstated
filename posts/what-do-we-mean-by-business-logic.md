---
title: What Do We Mean by Business Logic?
date: 2024-09-08
---

> We needed to support the ability to swap data sources without impacting business logic, so we knew we needed to keep them decoupled. - Netflix Tech Blog [1]

## Why do we care?

Business Logic is often used in discussions about software architecture, especially when justifying one choice over another. Architectural decisions can be very impactful and hard to undo. It is important to use clear and precise language so that everyone understands the arguments being made and can arrive at the right decision.

I also take an empirical position and argue that its very usage is enough to show that it's worth defining. People are trying to express _something_ when they use the term, and given software concepts are hard to talk about due to their abstractness, it's perhaps not surprising the usage of the term is muddled.

## Etymology

### Blame the Hogs

The very first academic usage of business logic that I could find was in 'The Determination of Hog Prices at Public Markets' from 1927.

> It is generally accepted as a fact that the quantity of livestock offered for sale (receipts), influences the quotations, and business logic suggests that the price which buyers are willing to pay, must be influenced by the wholesale selling prices obtainable for the products derived from the livestock [2]

### Information Systems and The Business Rules Group

In 1980s and 90s, businesses began a significant shift from manual systems and processes to digital information systems. This demanded a more formal approach to defining business functions so that they could be encoded into computer systems [3].

In 1993, the Business Rules Group began work on standardising approaches to information systems with a focus on 'business rules', which they define as "the rules which define the structure and control the operation of an enterprise"[4].

> The Business Rules Group began as a project team within the user group, *GUIDE International*.  Our initial focus was on business rules that could be implemented directly in information technology — the kinds of rules that would be defined formally in specifications of the information system

> It is hoped that, as the task of **defining business rules** is better understood, techniques and tools will be developed to support the missing elements of the task. Techniques would include formal methods for describing rules rigorously, with tools translating these formalisms directly into **program code** or other implementation constructs.

Business rules are high-level and implementation independent. They could be implemented by different systems. Business logic is the code that implements the business rules in a software system.

![The term 'business rules' trending - Google Books Ngram Viewer](/assets/“what-do-we-mean-by-business-logic”/s2.png)
_The term 'business rules' trending - Google Books Ngram Viewer_
![The term 'business logic' trending - Google Books Ngram Viewer](/assets/“what-do-we-mean-by-business-logic”/s1.png)
_The term 'business logic' trending - Google Books Ngram Viewer_

Notice how the usage of business logic lags that of business rules, demonstrating the progression from defining business rules to implementing them with business logic.

### OOP carries the torch

Alongside this period of rapid digitisation, programming languages and paradigms were evolving to support the larger, more complicated systems being required.

Object Oriented Programming, popularised by Smalltalk's commercial release in the 1980s, was an attractive paradigm for constructing digital information systems because it allowed developers to model complex systems. Major software vendors played a large part as well, with Oracle and Java being the obvious example of how enterprise software was being built on or supported by OOP languages.

These forces combined in an explosion of literature on design patterns and methodologies for large-scale software systems:

- "Object-Oriented Analysis and Design with Applications" by Grady Booch (1994)
- "Design Patterns: Elements of Reusable Object-Oriented Software" by Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides (1994)
- "Object-Oriented Software Construction" by Bertrand Meyer (1997, second edition)

## Analysis of Present Day Usage

### 1. Well-defined Usage

Business logic can be used in a specific, defined way in the context of Domain-Driven Design or similar historically OOP-based architectural methods:

> The Application is the core of the system, it contains the Application Services which orchestrate the functionality or the use cases. It also contains the Domain Model, which is the business logic embedded in Aggregates, Entities, and Value Objects - Hexagonal Architecture, there are always two sides to every story [5]

> Business validation logic should primarily be placed within the domain layer of your application. The domain layer is responsible for modeling the core business concepts, rules, and behaviors. [6]

### 2. Colloquial Usage

Business logic can also be used a colloquial, ad-hoc manner in order to refer to ‘core’ logic that is a fundamental part of the application.

Some examples of colloquial usage:

> Kotlin & Compose-friendly Firebase extensions designed to help you focus on your business logic [7]

> One of the underrated benefits of business logic existing independently of UI: you can switch UI frameworks without changing the business logic [8]

> entire categories of bugs can be eliminated just by moving business logic back across the network and keeping it next to the data it's operating on [9]

## Commonalities

Well-defined modelling approaches explicitly place the business logic in the architecture. In a colloquial usage, it may not be so explicit or it may be architected in an ad-hoc manner. What’s common in both of these usages is they are ultimately concerned with dealing with change in software, and layering software so that more ‘core’ logic is placed at a lower pace layer where it is expected to change less.

## Definition

Business logic:

1. The part of the program that implements the Business Rules, in the context of Domain-Driven Design or similar software design methodologies.
2. The part of the program that is fundamental, aka 'core' logic.

Synonyms: domain logic, core logic

## Summary

The term business logic came from needing to express business rules in code. It has two types of usage today:

1. In a specific, defined way in the context of Domain-Driven Design or similar historically OOP-based architectural methods.
2. In a colloquial, ad-hoc manner in order to refer to ‘core’ logic that is a fundamental part of the application.

Regardless of the context, business logic ultimately expresses the idea that certain parts of applications are more fundamental to the problem domain and should be explicitly reflected in the code.

To quote myself:

> By dividing code into clear layers, we create a conceptual stratification that reflects the level of commitment we have to the concepts we are expressing with our code.

## References

[1] Ready for changes with Hexagonal Architecture - https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749
[2]Edward N. Wentworth and Tage U. Ellinger (1924). The Determination of Hog Prices at Public Markets - https://www.jstor.org/stable/pdf/3180246.pdf
[3] John Zachman (1987). A Framework for Information Systems Architecture.
[4] Business Rules Group - https://www.businessrulesgroup.org/
[5] Hexagonal Architecture, there are always two sides to every story - https://medium.com/ssense-tech/hexagonal-architecture-there-are-always-two-sides-to-every-story-bc0780ed7d9c
[6] DDD Discussion: Business logic validation- https://techyexito.medium.com/ddd-discussion-business-logic-validation-265ae22abd58
[7] Firebase Android KTX- https://github.com/skydoves/firebase-android-ktx
[8] https://x.com/grow_love/status/1389202553750106115
[9] https://x.com/jacobmparis/status/1439974215663431681

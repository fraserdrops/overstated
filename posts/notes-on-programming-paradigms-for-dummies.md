---
title: Notes on Programming Paradigms for Dummies
date: 2024-04-09
---

#research-paper #research-notes

## Bibliography

Roy, Peter Van. “Programming paradigms for dummies: what every programmer should know.” (2009).

## tl;dr

Programming languages can be categorised by the paradigms they implement. It's important to consider how the paradigm supports non-determinism and named state. Paradigms are packages of concepts. Four important concepts are: Records, Lexically scoped closures, concurrency, named state. Concurrency is important, but non-determinism is hard to handle. Approaches like FRP and Discrete Synchronous Programming (Esterel, Lustre) allow deterministic concurrency

## Context

Peter Van Roy has written a book on Programming Paradigms. This is a taster.

## What

An introduction to the main programming paradigms, the concepts within them and the relationships between them.

## Why

Solving programming problems requires choosing the right concepts.

## For Developers

Understanding the different paradigms and how languages support them (or not) will help the developer choose the right language. Even if the language doesn't directly support the concepts, understanding the right concepts can help improve programming style

## For Language Designers

Languages must choose the paradigms they support.

## Definitions

- programming paradigm - an approach to programming a computer based on a mathematical theory or a coherent set of principles
- modularity - updates can be done to part of the system without changing the rest of the system
- named state - a sequence of values in time that has a single name
- parallel - they execute simultaneously on multiple processors
- concurrent - independent parts of a program
- procedural data abstraction (PDA) - data abstraction where data and operations are bundled together
- abstract data type (ADT) - data abstraction where data and operations are separate

## How

## Languages, Paradigms and Concepts

A language implements 1 or more paradigms. Paradigms contain a set of concepts.

language --implements--> paradigm--contains--> concepts

There are more languages than paradigms

### Taxonomy

![](/assets/notes-on-programming-paradigms-for-dummies/taxonomy-of-programming-paradigms.png)

Concepts are the primitive elements used to construct paradigms. Paradigms that seem different can differ by just one concept (FP and OOP)
A paradigm almost always has to be Turing complete to be practical.
Two important properties of paradigms:

1. do they have observable non determinism?
2. How strongly do they support state?

#### Observable Non-determinism

Non determinism is when the program execution is not completely decided by its specification.

It's _observable_ if the user can see different results from the same internal configuration.

It's no desirable, but it can be powerful to model real-world situations and program independent activities.

It should be supported **only if needed** . Esp true for concurrent programming, which is easier in paradigms (e.g. declarative concurrent) where programs are deterministic.

#### Named State

State is the ability to store and recall information.

Paradigms can express state more or less powerfully.

### Expressiveness

![](/assets/notes-on-programming-paradigms-for-dummies/state-matrix.png)

3 axis of expressiveness

1. named/unnamed
2. deterministic/nondeterministic
3. sequential/concurrent

### Computer programming and system design

Uses Weinberg's diagram of system design.
![](/assets/notes-on-programming-paradigms-for-dummies/computer-programming-and-system-design.png)
Two main properties of systems:

1. Complexity (number of interacting components)
2. randomness (how nondeterministic it is)

> computer programs can act as highly complex machines and also as aggregates through simulation.

Science understands two types of systems

1. Aggregates (e.g. gas molecules) with statistical mechanics
2. machines (clocks, small number of derministic components)

We don't understand systems that have a mix of randomness and complexity.

Modern programs are pushing the boundaries of complexity. The authors believe scaleable languages capture something essential about complexity, they explore it in an objective way.

### Creative Extension Principle

- Can we just throw some concepts in a bag and call it a paradigm?
- How can we navigate the vast set of possible paradigms?

Enter creative extension principle.

If a program is complicated for technical reasons that aren't related to the specific problem being solved, it's a sign that a new concept could be applied.

e.g.

> - If we need to model error detection and correction, in which any function can detect an error at any time and transfer control to an error correction routine, then we need to add error codes to all function outputs and conditionals to test all function calls for returned error codes. All this complexity is unnecessary if we add one concept to the language: exceptions. Figure 5 shows how this works.

## Designing a language and it's programs

Each problem has a paradigm that is best for it. Not all paradigms are best for all problems

### Languages that support two paradigms

Usually one paradigm for the problem domain the language targets, the second supports abstraction and modularity for writing large languages:
e.g.
Solving libraries like gecode support

1. a solver (constraint programming)
2. OOP

### A definite programming language

- Some levels of abstraction get 'solved' aka the solution is good enough that we can move to higher levels e.g .assembly language or parsing algorithms.
- In the 70s, a student taking a compiler course would study parsing algorithms, today they would study higher-level concepts like dataflow analysis, type systems etc.
- Van Roy thinks this is happening for high-level languagues, that we'll find a definitive language that 'solves' (something, a paradigm?)

What could a definitive language look like?

Four research projects into very different problems treated the language used as fundamental. **They chose languages with very similar structures**

![table-definitive-programming-language](/assets/notes-on-programming-paradigms-for-dummies/table-definitive-programming-language.png)

Extracting the common structure reveals a 4-layered structure

1. functional programming
2. deterministic concurrency
3. message-passing concurrency
4. shared-state concurrecny

### Architecture of self-sufficient system

> The ultimate software system is one that does not require any human assistance, i.e., it can provide for every software modification that it needs, including maintenance, error detection and correction, and adaptation to changing requirement

These are robust systems e.g. peer-to-peer.

Proposed architecture:

1. first-class components (using closures)
2. Components are isolated agents communicating through message passing
3. Named state and transaction for system config and maintenance

Feedback loops are needed for the program to adapt to it's environment.

**Simple feedback loop**
![](/assets/notes-on-programming-paradigms-for-dummies/feedback-loop.png)

Real systems contain many feedback loops that interact. Two main interactions are:

1. Stimergy: Two loops sharing a subsystem
2. Management: One loop directly controlling another

TCP can be modelled as a feedback loop structure
![](/assets/notes-on-programming-paradigms-for-dummies/tcp-feedback-loop.png)

## Programming Concepts

Paradigms are built of concepts. There are 4 important concepts

1. Record
2. Lexically scoped closures
3. concurrency
4. named state

### Record

A record is a data structure that has indexed access to data items.

**Records are the foundation of symbolic programming**

- calculate with records
- create records
- decompose records
- inspect records
  _Records are the basis for important data structures like arrays and lists_

Records + closures = component-based programming

### Lexically Scoped Closure

Closures are at the heart of functional programming (and therefore programming)

- combines a procedure with it's arguments
- closures can be created and deferred to execute later
- seperates definition from exectution
- objects, procedures, objects, classes, components are all closures

Closures have many abilities (some would consider unnatural) that are associated with specific paradigms

- **Instantiation and genericit**y - functions (class) returning functions (object). associated with OOP.
- **Separation of concerns** (Dependency injection?) - function takes function as arguments. Preserves correctness because source code is not changed
- **Component-based programming** - component instance created by a function (component) that takes it's dependent modules as inputs

### Concurrency (independence)

It's important to be able to describe a program as consisting of independent parts.
Concurrency not equal to parallelism.

- parallel means they execute simultaneously on different processors
- Concurrency is language level description
- A concurrent program can be scheduled on a single processor, and a sequential program can be scheduled on multiple processors

Two popular concurrency paradigms (in order from most difficult to least)

1. shared-start concurrency
   1. monitor-managed data access
   2. transactions
2. message-passing concurrency

All three paradigms can express non determinism, which makes it hard to reason about correctness.

**Concurrency is easier if the nondeterminism is controlled!**

### Named state (identity)

Named state introduces time to programs. Pure functions are timeless, they don't change. Same inputs, same outputs.

We need **identity** to track an entity whose behaviour changes over time

**a sequence of values in time that has a single name**

Named state has tradeoffs

- Allows growth, adaption, learning
- Behaviour can become erratic, hard to proves correctness
  A good rule of thumb is that named state should always be accessible from the outside (why?)

Named stae is important for modularity

> a system (function, procedure, component, etc.) is modular if updates can be done to part of the system without changing the rest of the system

The problem with named state is the program can become incorrect. How to solve this dilemma?

Isolate the named state to a small part of the program
![](/assets/notes-on-programming-paradigms-for-dummies/program-as-state-transformer.png)

If named state is used to provide adaptive behaviours

> Having named state is both a blessing and a curse. It is a blessing because it allows the component to adapt to its environment. It can grow and learn.

> Named state is important for a system’s modularity

Is it useful for both these things or are component with adaptive behaviours required for modularity? e.g. lets the same component do different things depending on configuration, which means changes can be isolated?

> If F does not have named state then it cannot change its behaviour. In particular, it cannot keep a counter of how many times it is called. The only solution in a program without named state is to change F’s interface (its arguments):

The example of modularity seems to rely on a module changing it's behaviour

## Data abstraction

Outside - Interface - inside
inside hidden from the outside, all operations must pass through the interface

advantages

1. Correctness by only allowing authorised operations on data structures
2. Easier to understand, hide implementation detail, compose abstractions together
3. Programming against interfaces allows division of labour

There are four ways to organise data abstractions, along two axes

1. state - named state or not
2. bundling - are data and operations bundled together (object or procedural data abstraction PDA) or not (abstract data type ADT)
   ![](/assets/notes-on-programming-paradigms-for-dummies/organising-data-abstraction.png)
   Stateful Objects and Stateless ADTs are popular in modern languages

e.g. In Java Objects in are stateful and combine data and methods. Integers in Java are ADTs without named state

### Polymorphism and the responsibility principle

Polymorphism - the same message can be handled differently. The caller doesn't have to know, it just knows the interface of the message.

### Inheritance and the substitution principle

Inheritance allows incremental abstraction.

Use with care! Any extension to a class can be seen as an interface to B.
![](/assets/notes-on-programming-paradigms-for-dummies/inheritance-vs-composition.png)

The substitution principle: If class Child inherits from class Parent, any procedure that works with objects class Child must also work with of class Parent. Conservative extension.

## Deterministic concurrent programming

Concurrent programming naturally implies nondeterminism, but nondeterminism is hard to handle if it is observable by the user e.g. race conditions.

### Avoiding nondeterminism in a concurrent language

How can we avoid the ill effects of non- determinism and still have concurrency?

differentiate between

1. nondeterminism \*inside systems (not avoidable)
2. observable nondeterminism (avoidable)

then apply

1. limit observable nondeterminism in the program
2. define a language that can write concurrent programs without observable nondeterminism
   There are (at least) four concurrent paradigms that have no observable nondeterminism

- declarative concurrency
- functional reactive programming
- discrete synchronous programming
- constraint programming
  ![](/assets/notes-on-programming-paradigms-for-dummies/concurrent-paradigms.png)

#### Functional reactive programming

- programs are functional, but functional arguments can be changed and propogated to the output
- usually only recompute values when they change and are needed
- arguments are **continuous** functions of a totally ordered variable

#### Discrete synchronous programming

> a program waits for input events, does internal calculations, and emits output events #reactive-system-definition

Difference with FRP is time is discrete, advances in steps from input event to the next

### Declarative concurrency

functional programming extended to allow concurrency.

All evaluation orders give the same result (confluence)

- threads - sequence of instructions executed independently
- dataflow variable - a single-assignment variable used for synchronisation

Declarative concurrency has nice properties that make it good for parallel programming

- mathematical functions, stays correct now matter how it is called (unlike objects)
- no race conditions
- easy to parallelise
- e.g. concurrent agents connected by streams

## Constraint Programming

Express the problem as a constrain satisfaction problem CSP

> given a set of variables ranging over well-defined domains and a set of constraints (logical relations) on those variables, find an assignment of values to the variables that satisfies all the constraints. #constraint-satisfaction-problem-definition

Declaritive: dev specifices the result, system searches for it. Model the program, instead of writing instructions to be executed.

- represent the problem using variables
- define the problem as constraints on the variables
- choose propagators that implement the constraints
- define the distribution and search strategies
  > The art of constraint programming consists in designing a model that makes big problems tractable.

> Constraint programming is closely related to declarative concurrency. Semantically, both are applications of Saraswat’s [[Concurrent constraint programming framework]]]

### How the constraint solver works

Naive: enumerate all possible variable values and test if it's a solution.

In practice, advanced techniques are needed to reduce the search space

Propagate distribute algorithm

1. propagate step: reduce domains of the variables. Propagator is a concurrent agent that implements a constraint, they trigger each other reducing domains of each others arguments resulting in a solution, failure, or incomplete solution
2. For each incomplete solution, split the Problem P into two subproblems using constraint C (P and C, and P and not C)

## Notable References

18 Felleisen M., “On the Expressive Power of Programming Languages”, in 3rd Euro- pean Symposium on Programming (ESOP 1990), May 1990, pp. 134-151

creative extension principle

16  Elliott C., Simply Efficient Functional Reactivity, LambdaPix technical report 2008-01, April 2008

FRP

## Notable Quotes

> For example, object-oriented programming is best for problems with a large number of related data abstractions organized in a hierarchy. Logic programming is best for transforming or navigating complex symbolic structures according to logical rules. Discrete synchronous programming is best for reactive problems, i.e., problems that consist of reactions to sequences of external events

Isn't this tautological? "OOP aka data abstractions organized in a hierarchy is best for problems involving data abstractions organized in a hierarchy"
"Logic programming ak transforming symbolic structures according to logical rules is best for problems involving transforming symbolic structures according to logical rules"

> A paradigm almost always has to be Turing complete to be practical.

Is this true? e.g. Statecharts aren't Turing complete. Are they even a paradigm though?

> A paradigm almost always has to be Turing complete to be practical. This explains why functional programming is so important: it is based on the concept of first-class function, or closure, which makes it equivalent to the λ-calculus which is Turing complete.

FP is important because it's Turing complete. But it's not the only way to be Turing complete. So what makes it important? It's the simplest way to be Turing complete?

> Often two paradigms that seem quite different (for example, functional programming and object-oriented pro- gramming) differ by just one concept.

Interesting observation

> We recall that nondeterminism is when the execution of a program is not completely determined by its specification, i.e., at some point during the execution the specification allows the program to choose what to do next. During the execution, this choice is made by a part of the run-time system called the scheduler. The nondeterminism is observable if a user can see different results from executions that start at the same internal configuration.

Interesting way of defining it

> State is the ability to remember information, or more precisely, to store a sequence of values in time.

> The point is to pick a paradigm with just the right concepts. Too few and programs become complicated. Too many and reasoning becomes complicated.

I like this quote. I think there's a wider point about the tradeoff between the program being complicated vs reasoning about the program being complicated

> computer programs can act as highly complex machines and also as aggregates through simulation.

How does this work? Is it because when you're simulating them you are giving 'random' inputs into the program

> The main advantage of named state is that the program becomes modular. The main disadvantage is that a program can become incorrect. It seems that we need to have and not have named state at the same time. How do we solve this dilemma? One solution is to concentrate the use of named state in one part of the program and to avoid named state in the rest.

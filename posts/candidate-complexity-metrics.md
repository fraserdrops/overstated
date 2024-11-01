---
title: Candidate Complexity Metrics
date: 2023-12-21
---

Comparing apps:

- If I add more buttons to an application, is it more complex?
  - Yes, in some cases. Some buttons add more complexity
  - Does adding an interactive element ever make it simpler?
- Is it just buttons?
  - No, if it's a way of interacting with the app
    - could be keyboard inputs
    - clicking
- Complexity for who? The dev or the user?
  - Is something more complicated for the user ever simpler for the dev?
  - is something more complicated for the dev ever simpler for the user?

Are we talking about complexity in the problem (requirements) domain or complexity in the solution domain?
I think problem domain

- More complex solutions can be created solving the same essential problem (just add dead code etc)
  But it's not simple, because I ultimately want to know how complex the solution is. Maybe problem complexity is a lower bound on solution complexity? The solution has to be at least as complex as the problem aka no solution can remove the essential complexity of the problem. But then if two solutions tackle the same problem from different angles, one can be a simpler solution than the other. But that style of solution applied to a more complex problem would have to be more complex, that's the key

If we take it we're talking about the problem domain, then that means when I say 'this app' it's really shorthand for "the requirements demonstrated by this app". It's assuming the implementation is 100% faithful to the requirements and it's not got anything unnecessary. This works so long as the app is defined by externally observable features, not internal implementation details

- Complexity in the problem domain
- A more complex problem is always more complex to build a solution for, even though for the same level of complexity different solutions can be differently complex
- Therefore being able to measure problem complexity allows us to make statements about implementation complexity, which is ultimately what we want

Although, why don't we measure implementation complexity directly?

- Need to know app internals
- It's trivial to make an app more complicated. But does it need to be that complicated? Depends on the problem complexity! But couldn't we keep the problem complexity constant and then try and minimise how complicated the implementation is?

Two approaches:

- measure problem complexity, infer implementation complexity
  - This framework works(is a good solution) well for these types of problems. That would mean it's a good solution because its simpler than other solutions for the same problem?
- Keeping the same problem, measure the implementation complexity
- A combination? Measure problem complexity, then measure the complexity of the solutions solving the problem, then specify which solutions are good which problem
  Maybe the answer will emerge via examples

It's almost in between because we're not asking "why does this app need a complex screen", assuming we've agreed what we're building how complex is that? It's like specification complexity.

Requirements -> Spec -> Implementation

The Spec meets the requirements and the implementation implements the spec

If the requirement is 'help companies manage their carbon savings' then the spec is "A web app with an opportunities tab that has the ability to add a list of opportunities...." and the implementation is the actual code that brings the spec to life.

Example problem metrics:

- Interaction Complexity
- Layout Complexity

## Interaction Complexity

States, modes, options, interactions
Complexity statements (an app is more complex if, all else equal, it has):

- More states
- More interactions (can choose a, b or c, more fields in a form)

## Layout Complexity

More screens, shifting
Complexity statements

- More UI components
- More layout shift
- Dynamic elements

## Service Complexity

More services to deal with

Complexity statements:

- More external services to interact with
- More events to send between services

## Data complexity

More data, faster data
Complexity statements:

- more data to consume/display
  - size of data
  - frequency
- higher refresh rate
- More complicated data graph

If I took a stock market app that displayed data updated daily and said it had to be updated every second, it would be more complex
If I took that app that had a max of 10 stocks subscribed and made that max 100, it would be more complex

This brings up the idea of thresholds. Going from 99-100 stocks may be trivial. But there may be some threshold such as bandwidth that means going from 100-101 is a step change increase in complexity. Where are the thresholds?

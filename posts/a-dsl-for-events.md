---
title: A DSL for Events
date: 2023-10-05
---

Statecharts are an amazing tool for managing complex states, but there have problems as they grow and require orthogonal regions:

- orthogonal regions are static (have to be known ahead of time). You need to know _exactly_ how many you want.
- Broadcast events are **hard to trace through the different regions**. A statechart is a static snapshot that doesn’t show the ‘flow’ of events that are triggering things to happen.

One way to solve the static problem is to embed the statechart inside something, like how XState gets wrapping statecharts in actor. The actor is then the unit that spawns dynamically. This works reasonably well, but it doesn’t address the event broadcast issue at all, and it introduces more challenges:

- **Shared state** - Actors draw a hard boundary around their local state. Parallel states don’t do this, they share context. So now if you want to pull out a parallel state into an actor, it’s asymmetrical with trade-offs you have to navigate such as ‘I want dynamic spawns, but now I have to configure all these messages to sync state between the actors’
- **Loss of information** - We’ve gone from full static to full dynamic. With the actor model we have no knowledge about how many actors there are or what type of events they may implement. In reality, \*\*we usually know what of entity we have, even if not how many. Take a game with a randomly generated number of bots. Those bots are are all of a particular class.

There’s a place for the actor model, but I believe that at some level of granularity the actor is too small benefits of isolation get lost and there’s a high cost to dividing the state.

> I chose not to use the actor model for same-process state management in Clojure for several reasons:
>
> - It is a much more complex programming model, requiring 2-message conversations for the simplest data reads, and forcing the use of blocking message receives, which introduce the potential for deadlock. Programming for the failure modes of distribution means utilizing timeouts etc. It causes a bifurcation of the program protocols, some of which are represented by functions and others by the values of messages.
> - - It doesn’t let you fully leverage the efficiencies of being in the same process. It is quite possible to efficiently directly share a large immutable data structure between threads, but the actor model forces intervening conversations and, potentially, copying. Reads and writes get serialized and block each other, etc.

A bit more on the problem of tracing broadcast events, because it’s the primary problem eventcharts are trying to solve.

The great thing about statecharts is that you can look at one and instantly see the current state, what events can be handled in that state and what next states/actions might result from those events. It’s like a little map, showing where you are and possible direction you might take.

As you add functionality though, you inevitably need orthogonal regions to handle different concerns. These communicate via event broadcasting for orthogonal states, and messages (basically event broadcasting) between actors. **Statecharts don’t make it very clear how events are flowing around**, you have to dig right into the actions to figure out what’s sending an event.

Actors can tell you what events have happened already, but crucially can’t do this _ahead of time_. No problem you say, I still have my nice state statechart and hese little bits in between are not a big problem. Ah! Well, I argue as the orthogonal regions grow in number, it’s precisely the inter-regional interactions that begin to dominate the behaviour. nstead of a nice map with directions fitting on one section, we have to constantly hop between sections of the map without any guidance about how to join the connections together. Does understanding a single neuron let you predict how the brain will behave?

Harel’s Citizen watch is a great example of this. Have a look at the statechart visual, and try work out the behaviour of the watch. Can you do it without simulating the watch and clicking stuff to observe the behaviour? I can’t!

There is room for simulation, and playing around. **I think we can do better.** I think we can give events the attention they deserve, rather than leaving them implicit. If statecharts are a DSL for finite states, why not a DSL for events?

---
title: The Switchboard Approach to Actor Composition
date: 2024-06-12
---

> The act of composing is one of contextualising, making concrete. Potential is turned into actual. A composed entity is by definition less generic than the individual parts composing it. Four lego blocks can be combined in many different ways. Once they are combined, they are in one and only one specific arrangement.

A common point of discussion in the XState community is about how to compose actors together, so that independent units of functionality can reused in different contexts. However, it's surprisingly tricky due to the nature of actors and sending events. What composition exists is typically achieved in a bespoke manner, rather than building up a system using a library of generic actors.

## Example system

For example purposes, an actor is defined as a function that receives the current state, the event, and then system context such as `sendTo` which allows the actor to send messages to other actors it has a reference to.

Initially, the system has `Log` , `Debounce` and `SomeActor` actors. All events get sent to `Log`, then to `Debounce` and then on to `SomeActor`

```js
const Debounce = (actor) => (state, event, sendTo) => {
  state.events.push(event)

  afterADebouncePeriod(() => {
    sendTo(actor, state.events.unshift())
  })

  return state
}

const Log = (actor) => (state, event, sendTo) => {
  console.log(event)
  sendTo(actor, event)
}

const composedActor = Log(Debounce(SomeActor))
```

It's not likely that all events need to be debounced. Let's change the requirements so that `API_REQUEST` events get debounced, but all other events don't.
![Only API_REQUEST events need to be debounced](/assets/the-switchboard-approach-to-actor-composition/ExampleSystem.png)
_Only API_REQUEST events need to be debounced_

`Debounce` can check the event type and skip debouncing unless it's an `API_REQUEST` event:

```js
// change Debounce so it only debounces API_REQUESTS
const Debounce = (actor) => (state, event, sendTo) => {
  if (event.type === 'API_REQUEST') {
    // debounce
  } else {
    // don't debounce
  }
  return state
}

const Log = (actor) => (state, event, sendTo) => {
  console.log(event)
  sendTo(actor, event)
}

const composedActor = Log(Debounce(SomeActor))
```

However, there's a problem. `Debounce` should be generic so that it can be used in lots of different situations, but now it's coupled to the specific context it's being used in. The system requirements changed, and to support the new requirements the generic module was changed.

## What went wrong?

**The problem is the actors being aware of the wider structure that they are participating in**

The higher-order style of actor composition `const composedActor = Log(Debounce(SomeActor));` works quite well if events flow through in a single stream, from one to the next. But the new requirements introduced branching - some events go straight through while others skip a step. This exposed the problem of each actor being **responsible** for sending events to the next one.

> The problem of coordinated branching streams of events is quite general. I've observed problems in composing Observables where it's extremely difficult to follow the flow of events.

In a parent-child relationship, the parent has some responsibility for the child, because it exists in the parents context. In processes for example, if the parent is closed/exited then all descendants are as well.

By composing with `const composedActor = Log(Debounce(SomeActor))`, `log` is responsible for the events going to `Debounce`, and `debounce` for the events going to `SomeActor`. But `Log`
and `Debounce` are unrelated, so this arrangement is undesirable and the that `Debounce` couldn't stay generic.

## How to fix it?

**Control should return to the parent so that it can direct events to children**

For inspiration, let's consider a similar system of plain JS functions:

```js
function log(toLog) {
  console.log(toLog)
}

function debounce(func, delay) {
  let timeout = null
  return () => {
    timeout = setTimeout(() => {
      func()
    }, delay)
  }
}

function someFunction(event) {
  // do domething
}

function processEvent(event) {
  log(event)
  if (event.type === 'API_REQUEST') {
    debounce(() => someFunction(event))
  } else {
    someFunction(event)
  }
}
```

Interestingly, the plain function implementation doesn't suffer from the problem of messing with generic components to direct events differently. `Debounce` remains untainted - it's the outer `processEvent` function that directs events. This is fine, because `processEvent` is not a generic module - it is expected that nodes further away from the leaves are more aware of wider context.

When a function completes execution, control is returned to the caller. In this example, control starts with `processEvent`, goes into `log`, then back up to `processEvent`.

In the actor example, the control flow isn't going back out each time, it's continuing through to the next actor in the chain. After `log`, `debounce` takes control. It's this difference in control flow that means that in one case `Debounce` needs to change and in the other case it can remain generic.

## Switchboard

**Switchboards split logic from wiring, and prevent children referencing the outer context**

I propose a solution I call Switchboard:

```js
const SwitchboardSystem = (state, event, sendTo) => {
  const wires = {
    // '' = external event
    "": {
      // * = catch all
      "*": 'debounce'
    },
    debounce: {
      API_REQUEST: 'someActor'
    },
    someActor: {},
  };
  const target = wires[event.origin][event.type]
  sendTo(target, event);
};


const Debounce = (state, event, emit) => {
  afterADebouncePeriod(() => {
    emit(event)
  })
}

const Log = (state, event, emit) => {
  console.log(state, event)
  emit(event)
}

const SomeActor = (state, event) {
  //...
}
```

The Switchboard approach makes every actor to be responsible for directing events downwards to children. Events flowing upwards cannot be directed to a particular destination, to prevent the problem of modules referencing the wider structure and breaking composition. Instead, events are emitted and then handled by the parent.

With Switchboard, the wiring is declared separately from the processing logic. To route events differently, only a small change in the wiring is needed.

```js
const Switchboard = (state, event, { origin, sendTo }) => {
  const wires = {
    // '' = external event
    '': {
      // change to the wiring
      API_REQUEST: 'debounce',
      '*': 'someActor'
    },
    debounce: {
      API_REQUEST: 'someActor'
    },
    someActor: {}
  }
  const target = wires[origin][event]
  sendTo(target, event)
}
```

## Summary

- actors are hard to compose because they can directly reference each other
- references upwards need to be restricted
- Switchboard separates wires from logic, and only allows actors to reference children

---
title: Modelling a Backlog Application with Statecharts
date: 2023-10-04
---

## Introduction

This is my attempt at the [Backlog Modelling Exercise](./posts/modelling-a-backlog-app-with-statecharts.md). I created the exercise to try and address the lack of example applications to serve as reference for software modelling discussions.

To serve as a comparison alongside my model, I called upon the services of my AIssistant to develop their own model. Their model is extremely representative of statechart models I see in the wild.

Modelling is subjective, and it's hard to compare different models. The Backlog Modelling Exercise helps by subjecting the designs to changing requirements. Given two models that fulfil the current requirements, the one that can adapt to new requirements better is generally preferable.

## AIssistant's v0 model

![AIssistant v0](/assets/modelling-a-backlog-app-with-statecharts/aissistantv0.png)

### Key features

I would describe this model as 'hierarchical' - there are no parallel states used at all. The most deeply-nested state is `backlog.success.ticketDetails.viewingDetails.updatingTitle`. This state reveals that updating the title in this model can only occur when:

1. The backlog list has loaded successfully
2. A ticket has been selected to view
3. the ticket details have loaded successfully

## My v0 Model

![My v0](/assets/modelling-a-backlog-app-with-statecharts/myv0.png)

### Key features

My approach utilises parallel states, as opposed to AIssistant's hierarchical structure. I've split out `core` and `view` at the top level. `core` deals with the API states, containing parallel states for each service, `loadBacklog` and `loadDetails`. `view` deals with the visual UI behaviour, with child states for `list` and `details`, also parallel to each other.

Coordination is required between the parallel states. For example, when the list is loading both `view.list` and `core.loadBacklog` are interested: `view.list` needs to transition to `loading` so the UI can show a loading indicator, and `core.loadBacklog` also needs to start `loading` so that it can begin fetching the list.

I've used event broadcasting to achieve this coordination, sending internal events such as `__internal__LIST_LOAD_SUCCESS`.

In the case of loading the list, the UI sends the event `LOAD_LIST` which `core.loadBacklog` listens to and responds by:

1. raising `__internal__START_LOADING_LIST`
2. transitioning to `core.loadBacklog.loading` which starts the service which fetches the list

3. UI sends `LOAD_LIST`
4. `core.loadBacklog` receives `LOAD_LIST`, responding by raising `__internal__START_LOADING_LIST` transitioning to `core.loadBacklog.loading` which starts the service which fetches the list
5. `view.list` receives `__internal__START_LOADING_LIST` and transitions to loading

Communicating through raised events isn't perfect. It adds overheads to each state, and it can be hard to think through the flow of events (a big reason I'm working on Eventcharts).

## Feature request 1

> The URL should reflect ticket selection state, so that the user can navigate to the page directly with a ticket already selected e.g. `url?selectedTicketId=abc`

### Changes to AIssistants v0 model

Right away, AIssistant's model has a problem. It assumes that the ticket details can only load _after_ the backlog list. With this feature request, they can both load _at the same time_.

The solution to allow for parallel loading is, unsurprisingly, to use parallel states - `details` needs to be put in parallel with `list`

![AIssistant v1](/assets/modelling-a-backlog-app-with-statecharts/aissistantv1.png)

Instead of a deep hierarchical structure it's now a shallower and more parallel.

### Changes to my v0 model

No changes required.

## Feature request 2

> The user should be able to edit ticket properties (currently just `title` ) directly from the table.

### Changes to AIssistant's v1 model

AIssistant's v1 model assumes that updating the ticket details only happens when the user is viewing ticket details. Similar to the previous feature request, this new feature breaks that assumption because the user can update details from the list or the details. To accomodate this new feature the `updateDetails` state needs to be moved into parallel with `details` and `list`.

![AIssistant v2](/assets/modelling-a-backlog-app-with-statecharts/aissistantv2.png)

### Changes to my v1 model

No changes required. The `update` state is already parallel.

## Feature Request 3

> When the user retries loading the list or details after an API error, instead of showing the loading indicator should show a custom retrying indicator.

### Changes to my v2 model

This time I do need to make some changes to my statechart. Instead of transitioning to `loading` after `RETRY_LOAD_LIST` or `RETRY_LOAD_DETAILS` in the `view` region, the statechart should transition to a `retrying` state.

Overall, this is a fairly small addition to my model that only required a change in the `view` state, leaving `core` unchanged throughout the feature requests.

### Changes to AIssistant's v2 Model

This feature request forces the model to be able to load the details/list from different UI states (`error` and `retrying`). A model that assumes the state `loading` could handle both the UI loading and the API loading will have to change, as is the case with AIssistant's v2 model.

There are several possible solutions:

1. Add a `retrying` state which duplicates the `invoke` logic for fetching data from `loading`.
2. Keep the machine state structure unchanged, but save a `boolean` value in context for each API to track if it's currently in an error state. Then the UI can check if it's retrying `const isListRetrying = state.matches(loading) && context.listError`
3. The UI state can be split out into a parallel section of the machine. I won't provide the actual code for this because once this step is applied to AIssistant's v2 model, the result is almost identical to my model.

I don't like option 1 on principle. Duplicating the `invoke` means any time an action or anything in one of the invokes changes, we need to remember to update the other one. But conceptually, I believe that if the invoke can occur in multiple states, modelling it in parallel reflects the underlying nature of the system better.

Options 2 and 3 are similar in that they both add a parallel element to track the error state separate from the API fetching. I find explicitly tracking the UI state in a machine to be cleaner, so my preference is for 3.

## Discussion

### Model Comparison

To fulfil the feature requests, AIssistants model required significant changes while mine needed minimal changes. The key difference between our v0 models is the use of hierarchy by AIssistant compared to my use of parallel states. Each feature request required AIssistant's model to become more parallel and less hierarchical, until it was left resembling my initial model.

The subsequent feature requests demonstrate that AIssistant's use of hierarchy is overzealous. The model, whilst producing external behaviour specified in the initial requirements, does not generalise and may break down if the requirements change. This can be thought of as 'structural overfitting'. The configuration works for this specific, narrow set of requirements, but is not good at adapting to unseen requirements.

There are several features of AIssistant's v0 model that are red flags for structural overfitting:

1. Deep state hierarchies - more chance that a state will need to be rearranged
2. Total absence of parallel states, - orthogonality provides degrees of freedom
3. State-name vs hierarchy - `listReady.viewingDetails.updatingTitle` . These states feel like they're at a similar level of abstraction, rather than becoming more specialised e.g. `app.sidebar.loading`

### Hierarchy in Statechart Models

Relating states through hierarchy is a strong claim about their relationship - that the child state is _only_ active when the parent is active state. If there are any exceptions then the hierarchy may need to be reconfigured, but because hierarchy gets embedded in the heart of a statechart structure this can be difficult. See 'The Rubiks Cube Effect' https://mbreen.com/breenStatecharts.pdf

### Modelling Requirements

It would seem that the conclusion then is to make all the things parallel. Yet, surely there must be some structure, some hierarchy, and some constraints encoded in the model.

One way to think of modelling requirements is to consider requirements in pace-layers. Foundational requirements (AKA core logic / business logic) sit at the bottom layer and change very slowly. Screen rules sit somewhere higher and can change quicker.

In this context, the statechart model actually needs to reflect multiple pace layers given it is trying to model both the API requests and the UI. The current requirements for the frontend could vary, but they need to satisfy the limitations of the API. Therefore, the model should represent the system as defined by the APIs, which is what the `core` region of my model does. On top of the `core` are screen rules which might vary between requirements but still satisfy the core rules, which is what the `view` section of my model describes.

Notice that I never once had to change my `core` model, only the `view` for the last feature request.

> By dividing code into clear layers, we create a conceptual stratification that reflects the level of commitment we have to the concepts we are expressing with our code.

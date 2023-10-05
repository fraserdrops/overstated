---
title: Modelling a Backlog Application with Statecharts
date: 2023-10-04
---

## Introduction

This is my attempt at the Backlog Modelling Exercise. I created the exercise to try and address the lack of example applications to serve as reference for software modelling discussions.

To serve as a comparison alongside my model, I called upon the services of my AIssistant to develop their own model. Their model is extremely representative of statechart models I see in the wild.

Modelling is subjective, and it's hard to compare different models. The Backlog Modelling Exercise helps by subjecting the designs to changing requirements. Given two models that fulfil the current requirements, the one that can adapt to new requirements better is generally preferable.

## AIssistant's v0 model

```js
interface Context {
  tickets: Ticket[];
  selectedTicket?: Ticket;
  selectedTicketId?: string;
}

type Event =
  | { type: "LOAD_LIST" }
  | { type: "SELECT_TICKET"; ticketId: string }
  | { type: "CLOSE_DETAILS" }
  | { type: "RETRY_LOAD_DETAILS" }
  | { type: "RETRY_LOAD_LIST" };

const backlogMachine = createMachine<Context, Event>(
  {
    id: "backlog",
    initial: "idle",
    context: {
      tickets: [],
      selectedTicket: undefined,
      selectedTicketId: undefined,
    },
    states: {
      idle: {
        on: {
          LOAD_LIST: "loading",
        },
      },
      loading: {
        tags: ["listLoading"],
        invoke: {
          id: "loadBacklog",
          src: "loadBacklogService",
          onDone: {
            target: "success",
            actions: ["setLoadedTickets"],
          },
          onError: {
            target: "#error",
          },
        },
      },
      success: {
        tags: ["listReady"],
        initial: "idle",
        on: {
          SELECT_TICKET: {
            target: ".ticketDetails",
            actions: ["setSelectedTicketId"],
          },
          CLOSE_DETAILS: {
            target: "#backlog.success",
            internal: false,
          },
        },
        states: {
          idle: {
            tags: ["sidebarClosed"],
          },
          ticketDetails: {
            initial: "loading",
            states: {
              loading: {
                tags: ["detailsLoading"],
                invoke: {
                  id: "loadTicketDetail",
                  src: "loadTicketDetailService",
                  onDone: {
                    target: "viewingDetails",
                    actions: ["setSelectedTicket"],
                  },
                  onError: {
                    target: "error",
                  },
                },
              },
              viewingDetails: {
                initial: "idle",
                states: {
                  idle: {
                    tags: ["sidebarOpen"],
                    on: {
                      UPDATE_TITLE: "updatingTitle",
                    },
                  },
                  updatingTitle: {
                    invoke: {
                      id: "updateTicketTitle",
                      src: "updateTicketService",
                      onDone: {
                        target: "idle",
                        actions: "updateTicketDetails",
                      },
                    },
                  },
                },
              },
              error: {
                tags: ["detailsError"],
                on: {
                  RETRY_LOAD_DETAILS: "loading",
                },
              },
            },
          },
        },
      },
      error: {
        id: "error",
        on: {
          RETRY_LOAD_LIST: "loading",
        },
      },
    },
  }
);
```

### Key features

I would describe this model as 'hierarchical' - there are no parallel states used at all. The most deeply-nested state is `backlog.success.ticketDetails.viewingDetails.updatingTitle`. This state reveals that updating the title in this model can only occur when:

1. The backlog list has loaded successfully
2. A ticket has been selected to view
3. the ticket details have loaded successfully

## My v0 Model

```js

interface Ticket {
  id: string;
  title: string;
  description?: string;
}

interface Context {
  tickets: Ticket[];
  selectedTicket?: Ticket;
  selectedTicketId?: string;
}

type Events =
  | { type: "LOAD_LIST" }
  | { type: "SELECT_TICKET"; id: string }
  | { type: "RETRY_LOAD_DETAILS" }
  | { type: "RETRY_LOAD_LIST" }
  | { type: "CLOSE_DETAILS" }
  | { type: "UPDATE_TITLE"; id: string; title: string }
  | { type: "__internal__LIST_LOAD_SUCCESS" }
  | { type: "__internal__LIST_LOAD_ERROR" }
  | { type: "__internal__DETAILS_LOAD_SUCCESS" }
  | { type: "__internal__DETAILS_LOAD_ERROR" }
  | { type: "__internal__START_LOADING_DETAILS" }
  | { type: "__internal__START_LOADING_LIST" };

const backlogMachine = createMachine<Context, Events>(
  {
    id: "backlog",
    initial: "idle",
    context: {
      tickets: [],
      selectedTicket: undefined,
      selectedTicketId: undefined,
    },
    type: "parallel",
    states: {
      core: {
        type: "parallel",
        states: {
          loadBacklog: {
            initial: "idle",
            states: {
              idle: {
                on: {
                  __internal__START_LOADING_LIST: "loading",
                },
              },
              loading: {
                invoke: {
                  id: "loadBacklog",
                  src: "loadBacklogService",
                  onDone: {
                    target: "idle",
                    actions: [
                      "setLoadedTickets",
                      raise("__internal__LIST_LOAD_SUCCESS"),
                    ],
                  },
                  onError: {
                    target: "idle",
                    actions: [
                      raise("__internal__LIST_LOAD_ERROR"),
                    ],
                  },
                },
              },
            },
          },
          loadDetails: {
            initial: "idle",
            states: {
              idle: {
                on: {
                  __internal__START_LOADING_DETAILS: {
                    target: "loading",
                  },
                },
              },
              loading: {
                invoke: {
                  id: "loadTicketDetail",
                  src: "loadTicketDetailService",
                  onDone: {
                    target: "idle",
                    actions: [
                      "setSelectedTicket",
                      raise("__internal__DETAILS_LOAD_SUCCESS"),
                    ],
                  },
                  onError: {
                    target: "idle",
                    actions: [
                      raise("__internal__DETAILS_LOAD_ERROR"),
                    ],
                  },
                },
              },
            },
          },
          updateDetails: {
            initial: "idle",
            states: {
              idle: {
                on: {
                  UPDATE_TITLE: "updatingDetails",
                },
              },
              updatingDetails: {
                invoke: {
                  id: "updateTicketTitle",
                  src: "updateTicketService",
                  onDone: {
                    target: "idle",
                    actions: "updateTicketDetails",
                  },
                },
              },
            },
          },
        },
      },
      view: {
        type: "parallel",
        states: {
          list: {
            initial: "idle",
            on: {
              __internal__LIST_LOAD_SUCCESS: ".ready",
              __internal__LIST_LOAD_ERROR: ".error",
            },
            states: {
              idle: {
                on: {
                  LOAD_LIST: {
                    target: "loading",
                    actions: [raise("__internal__START_LOADING_LIST")],
                  },
                },
              },
              loading: {
                tags: ["listLoading"],
              },
              ready: {
                tags: ["listReady"],
              },
              error: {
                tags: ["listError"],
                on: {
                  RETRY_LOAD_LIST: {
                    target: "loading",
                    actions: [raise("__internal__START_LOADING_LIST")],
                  },
                },
              },
            },
          },
          details: {
            initial: "idle",
            on: {
              __internal__DETAILS_LOAD_SUCCESS: ".ready",
              __internal__DETAILS_LOAD_ERROR: ".error",
              CLOSE_DETAILS: ".idle",
              SELECT_TICKET: {
                target: ".loading",
                actions: [
                  "setSelectedTicketId",
                  raise("__internal__START_LOADING_DETAILS"),
                ],
              },
            },
            states: {
              idle: {},
              loading: {
                tags: ["detailsLoading"],
              },
              ready: {
                tags: ["detailsReady"],
              },
              error: {
                tags: ["detailsError"],
                on: {
                  RETRY_LOAD_DETAILS: {
                    target: "loading",
                    actions: [raise("__internal__START_LOADING_DETAILS")],
                  },
                },
              },
            },
          },
        },
      },
    },
  }
);
```

### Key features

My approach utilises parallel states, as opposed to AIssistant's hierarchical structure. I've split out `core` and `view` at the top level. `core` deals with the API states, containing parallel states for each service, `loadBacklog` and `loadDetails`. `view` deals with the visual UI behaviour, with child states for `list` and `details`, also parallel to each other.

Coordination is required between the parallel states. For example, when the list is loading both `view.list` and `core.loadBacklog` are interested: `view.list` needs to transition to `loading` so the UI can show a loading indicator, and `core.loadBacklog` also needs to start `loading` so that it can begin fetching the list.

The way I've handled this coordination is by raising events. The internal events such as `__internal__LIST_LOAD_SUCCESS` are. (I'm experimenting with this `__internal__` naming convention to distinguish between internal and external events. It can be helpful in building a mental model of the workings of the statechart). In the case of loading the list, the UI sends the event `LOAD_LIST` which `core.loadBacklog` listens to and responds by:

1. raising `__internal__START_LOADING_LIST`
2. transitioning to `core.loadBacklog.loading` which starts the service which fetches the list

3. UI sends `LOAD_LIST`
4. `core.loadBacklog` receives `LOAD_LIST`, responding by raising `__internal__START_LOADING_LIST` transitioning to `core.loadBacklog.loading` which starts the service which fetches the list
5. `view.list` receives `__internal__START_LOADING_LIST` and transitions to loading

Communicating through raised events isn't perfect. It adds overheads to each state, and it can be hard to think through the flow of events (a big reason I'm working on Eventcharts). One idea is to be consistent about a 'one-way-event-flow' of `UI` -> `view` -> `core` . However, there are still events that need to originate from `core` such as `__internal__DETAILS_LOAD_SUCCESS` .

## Feature request 1

> The URL should reflect ticket selection state, so that the user can navigate to the page directly with a ticket already selected e.g. `url?selectedTicketId=abc`

### Changes to AIssistants v0 model

Right away, AIssistant's model has a problem. It assumes that the ticket details can only load _after_ the backlog list. With this feature request, they can both load _at the same time_.

The solution to allow for parallel loading is, unsurprisingly, to use parallel states.

Here is the original structure for v0 after removing the noise from the machine definition:

```js
states: {
  idle: {},
  loading: {},
  listReady: {
	states: {
	  idle: {},
	  ticketDetails: {
		states: {
		  loading: {},
		  viewingDetails: {
			states: {
			  idle: {},
			  updatingTitle: {},
			},
		  },
		  error: {},
		},
	  },
	},
  },
  error: {},
}

```

And here is the changed structure to accommodate the feature request in v1:

```js
type: 'parallel',
states: {
  details: {
	states: {
	  idle: {},
	  loading: {},
	  viewingDetails: {
		states: {
	      idle: {},
	      updatingTitle: {},
		},
	  },
	  error: {},
	},
  },
  list: {
	states: {
	  idle: {},
	  loading: {},
	  listReady: {},
	  error: {},
	},
  },
}

```

Instead of a deep hierarchical structure it's now a shallower and more parallel.

### Changes to my v0 model

No changes required.

## Feature request 2

> The user should be able to edit ticket properties (currently just `title` ) directly from the table.

### Changes to AIssistant's v1 model

AIssistant's v1 model assumes that updating the ticket details only happens when the user is viewing ticket details. Similar to the previous feature request, this new feature breaks that assumption because the user can update details from the list or the details.

v1 looked like:

```js
type: 'parallel',
states: {
  details: {
	states: {
	  idle: {},
	  loading: {},
	  viewingDetails: {
		states: {
	      idle: {},
	      updatingTitle: {},
		},
	  },
	  error: {},
	},
  },
  list: {
	states: {
	  idle: {},
	  loading: {},
	  listReady: {},
	  error: {},
	},
  },
}
```

to accomodate this new feature the `updatingTitle` state needs to be moved into parallel with `details` and `list`.

v2:

```js
type: 'parallel',
states: {
  updatingTitle: {
  	states: {
	  idle: {},
	  loading: {},
	},
  },
  details: {
	states: {
	  idle: {},
	  loading: {},
	  viewingDetails: {},
	  error: {},
	},
  },
  list: {
	states: {
	  idle: {},
	  loading: {},
	  listReady: {},
	  error: {},
	},
  },
}
```

### Changes to my v1 model

No changes required. The `update` state is already parallel.

## Feature Request 3

> When the user retries loading the list or details after an API error, instead of showing the loading indicator should show a custom retrying indicator.

### Changes to my v2 model

This time I do need to make some changes to my statechart.

Here is the structure of what I started with in v0:

```js
type: "parallel",
states: {
  core: {
	type: "parallel",
	states: {
	  loadBacklog: {
		states: {
		  idle: {},
		  loading: {},
		},
	  },
	  loadDetails: {
		states: {
		  idle: {},
		  loading: {},
		},
	  },
	  updateDetails: {
		states: {
		  idle: {},
		  loading: {},
		},
	  },
	},
  },
  view: {
	type: "parallel",
	states: {
	  list: {
		states: {
		  loading: {},
		  ready: {},
		  error: {
			on: {
			  RETRY_LOAD_LIST: {
				target: "loading",
				actions: [raise("__internal__START_LOADING_LIST")],
			  },
			},
		  },
		},
	  },
	  details: {
		states: {
		  idle: {},
		  loading: {},
		  ready: {},
		  error: {
			on: {
			  RETRY_LOAD_DETAILS: {
				target: "loading",
				actions: [raise("__internal__START_LOADING_DETAILS")],
			  },
			},
		  },
		},
	  },
	},
  },
}

```

For this feature request, instead of transitioning to `loading` after `RETRY_LOAD_LIST` or `RETRY_LOAD_DETAILS` in the `view` region, the statechart should transition to a `retrying` state.

```js
type: "parallel",
states: {
  core: {...},
  view: {
	type: "parallel",
	states: {
	  list: {
		states: {
		  loading: {},
		  ready: {},
		  error: {
			states: {
			  idle: {
				on: {
				  RETRY_LOAD_LIST: {
					target: "retrying",
					actions: [raise("__internal__START_LOADING_LIST")],
				  },
				},
			  },
			  retrying: {},
			},
		  },
		},
	  },
	  details: {
		states: {
		  idle: {},
		  loading: {},
		  ready: {},
		  error: {
			states: {
			  idle: {
				on: {
				  RETRY_LOAD_DETAILS: {
					target: "retrying",
					actions: [raise("__internal__START_LOADING_DETAILS")],
				  },
				},
			  },
			  retrying: {},
			},
		  },
		},
	  },
	},
  },
}

```

As an aside, it would have been possible to create `retrying` as a sibling of `error` rather than as a child.

Overall, this is a fairly small addition to my model that only required a change in the `view` state, leaving `core` unchanged throughout the feature requests.

### Changes to AIssistant's v2 Model

This feature request forces the model to be able to load the details/list from different UI states (`error` and `retrying`). A model that assumes the state `loading` could handle both the UI loading and the API loading will have to change, as is the case with AIssistant's v2 model.

Here is the previous model:

```js
type: 'parallel',
states: {
  updatingTitle: {
  	states: {
	  idle: {},
	  loading: {},
	},
  },
  details: {
	states: {
	  idle: {},
	  loading: {
	    invoke: {...}
	  },
	  viewingDetails: {},
	  error: {
		on: {
		  RETRY_LOAD_DETAILS: "loading",
		},
	  },
	},
  },
  list: {
	states: {
	  idle: {},
	  loading: {
	    invoke: {...}
	  },
	  listReady: {},
	  error: {
		on: {
		  RETRY_LOAD_LIST: "loading",
		},
	  },
	},
  },
}
```

There are several possible solutions:

1. Add a `retrying` state and duplicate the `invoke` logic for fetching data inside that state

```js
states: {
  idle: {},
  loading: {
	invoke: {...}
  },
  listReady: {},
  error: {
    states: {
       idle: {
	     on: {
		  RETRY_LOAD_LIST: "retrying",
		},
       },
       retrying: {
         invoke: {...}
       }
    }
  },
},
```

2. Keep the machine state structure unchanged, but save a `boolen` value in context for each API to track if it's currently in an error state. Then the UI can check if it's retrying `const isListRetrying = state.matches(loading) && context.listError`
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

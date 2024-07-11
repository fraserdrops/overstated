---
title: Notes on A Visual Perception Account of Programming Languages
date: 2024-07-11
---

## tl;dr

A framework for analysing and generating code representations optimised for visual perception

## My Response

- Some interesting insights, such as circle-and-arrows not necessarily being explicit for all reading tasks.
- Breaking down the reading tasks like ScanVis does was new to me and seems valuable.
- Hard to really evaluate representations myself from small out-of-context snippets

## Why

- no framework to guide language designers
- lack of foundation for understanding code perception and representation

## Notable Quotes

> An implicit but important aspect of programming languages is that they must support the production of readable programs

and

> Programs must be written for people to read, and only incidentally for machines to execute.

It feels that today programs are only incidentally for people to read.
An example of tension when the same artefact needs to fulfill different functions that can conflict (making code to run on machines can be opposed to making readable code). Compilers are one way of handling the conflict. It allows the artefact to exist in two forms, one for the function of human readability, the other for the function of machine use.

## Extended Notes

### Intro

- programming languages must support the production of readable programs
- visual features can be aesthetic or syntactical
- paper aims to find the science of code representation

### Proposed Framework

Semiotics of Graphics + ScanVis model

#### Semiotic of graphics

- a theory of abstract drawings e.g. maps and bar charts
- visual variables e.g. xy, color, shape
  - selective: group and differentiate e.g. all red marks
  - ordered: can rank e.g. light to dark
  - quantitative: can quantify differences e.g. twice as large

#### ScanVis

- descriptive modal to help analyse effectiveness of a visualisation with respect to a reading task
- decomposes tasks into elementary visual operations
  - memorising
  - entering and exiting the viz
  - seeking a subset of marks
  - navigating a subset of marks
  - unpacking a mark
  - verifying a predicate
  - Operations are facilitated by visual cues

### Application to Programming Languages

> Assessing a particular visual representation of a program requires identifying the set of reading tasks performed by the programmer

These frameworks are used in graphical area, but haven't been applied to programming languages before.
Even finding examples of reading tasks is hard.

### 4.0 Describing Visual Features of Languages

Explore how conventional wisdom about code can be formalised into concepts and vocabulary of the framework

#### 4.1 Visually structuring the code

> Lots of irritating superfluous parentheses
> ![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-5.png)
> Lisp is hard to read.

- shape is not `selective`
- expression boundaries can't be seen at a glance, it requires `scanning`

> LabViews G language is intuitive

![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-7.png)

- box enclosures are `selective` and `ordered`

#### Understanding instructions control flow

> instruction flow in C is implicit

- programmer `scans` vertically
- finding next instruction is supported by using Y which is `selective, ordered` variable
- function calls are done by shape, which is not `selective`

> Arrows make instruction flow explicit

- task: "figure out the flow" requires `seek` subset of marks, and `navigate` by following arrows
- by default, links are not `selective`, but colouring them can make them so

#### Understanding functionality

> Icons are easier to understand than text

- differentiated by `shape`
- not just shape but other visual variables are important to speed up discrimination

### 5.1 Comparing code representations

Using the framework to compare code representations

#### 5.1 Luminosity, color and position of enclosing symbols

![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-13.png)

- color is `selective`, mapping depth to colour enables `assimilation` at one glance. But it might not be the correct visual variable
- `luminosity` is `selective` and `ordered`, helping perceive deeper vs shallower depths

#### 5.2 Y versus Arrows

![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-14.png)

- arrows are explicit about direction of sequence
- they are no more explicit than Y about order of the sequence

#### comparing with multiple, more demanding tasks

![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-16.png)

- visual operations for "find the out transitions for state x"
- both use `selectivity`, visual via size of circles compared to other shapes, text via indentation
- in the text all transitions are out transitions, with visual differentiating links can be challenging

![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-17.png)

- visual operations for "find all the in transitions for state x"
- dark arrowheads help find in transitions
- scanning the text for the names of the state can be difficult

## Generating New Code Representations

Using the framework to derive principles that can be used to create new code representations

> identify the task and seek selectivity only if needed

- color coding every keyword may not be related to any task the programmer performs
- default to using non-selective variables like shape or typeface, reserving the scarce colour resource
  > try swapping visual variables

![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-19.png)

- explore using size and y position instead of color

> shorten spatial distance

![](/assets/notes-on-a-visual-perception-account-of-programming-languages/figure-21.png)

> Explore and leverage properties of visual variables

- ![[figure-23.png]]

- most languages use Y for ordering but distance has no meaning
- we can use this to preserver semantics but increase readability
- align statements that are conceptually synchronised
- use space to indicate time between execution

## Related work

- formatting has been discussed
- reading performance of languages has been explored in visual designs. Eye tracking testing has occurred
- difference between textual and visual languages has been debated, some claim it's mostly about how representations can support expected conventions
- Analysis frameworks - some metrics have been devised for software readability

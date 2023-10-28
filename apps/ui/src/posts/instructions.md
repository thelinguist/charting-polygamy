---
title: "instructions"
---

# Intro

This is a tool that scans your family tree in search of male ancestors who practiced polygamy.

It will gather your family history details (but will not send the data anywhere) and identify men with concurrent marriages. The goal is to understand and generate statistics around polygamy amongst members of the LDS church during the Joseph Smith movement (Mormonism).

Here is an example of the results:

| ![Plural Family Example](/charting-polygamy/plural-family.svg) |
|:--------------------------------------------:|

## How to read
- The red line indicates the duration of one marriage.
- The start of each marriage is marked with the age and gap. A negative indicates that person was X years younger than their partner
- Blue lines indicates a marriage outside the plural family being displayed.[^1]

[see an actual example of Parley P Pratt](pratt)

# How it works

You can jump in at one of these points:

1. ~~grant access for this app to log into familySearch or ancestry.com~~ (work in progress)
2. upload a file: Gedcom or ~~CSV~~
3. build a chart

The app will scan the info you provide and identify which men practiced polygamy. It will then generate a chart for each
one to the best of its ability.

You can also see stats (TODO) on how many men in your lines practiced polygamy.

[get started](upload)

# Questions

## How do you identify polygamists?

If the data you provide includes families where the man has more than one wife at a time, that family is considered polygamist.

## Why are you only looking at Pioneer Era polygamy? (work in progress)

It's the most likely to contain polygamist families. It's on my list of TODOs to report interesting facts like polygamy practiced outside the LDS Church's "edict," or those not of the mainline mormon movement.

## How do you determine eligible men?

TODO: restrict parsing to only look at men associated with LDS movement.

Currently eligible men are those that have marriages that do not end when another begins.

## How do you process my data

The app runs entirely on your device, in the browser. You provide the data, and it will give you some interesting graphics and stats.

## Do you track me or save any of my data

Nope. Not interested. Maybe later I'll set up some interesting aggregated stats for you to opt into. This is open source so to any data scientists: hit me up.

## Why are you doing this? Are you for/against polygamy?

That's hard to say. Really, the main motivation is to understand the societal picture of the LDS movement. I've heard things like "only 2% of the church practiced polygamy," or, "men could not just pick who they wanted to marry"

In my lines, it's evident that men could choose who they married, and sometimes did so before their existing wives' gave consent. My lines show that 40% of eligible men did practice polygamy. I'm curious if this is because my family is composed of very important men within the movement, or if it was more normalized than people claim today.

# Footnotes
[^1]: Note that some assumptions are made on the marriage end, namely, when one starts the other terminates. For a select group of people around (and including) Joseph Smith, this assumption is invalid, as women in plural marriages could continue to be married to their original partner. This fact is ignored in the web version of this tool.

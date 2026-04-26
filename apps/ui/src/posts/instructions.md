---
title: "instructions"
---

# Intro

This is a tool that scans your family tree in search of male ancestors who practiced polygamy.

It will gather your family history details (but will not send the data anywhere) and identify men with concurrent marriages. The goal is to understand and generate statistics around polygamy amongst members of the LDS church during the Joseph Smith movement (Mormonism).

Here is an example of the results:

| ![Plural Family Example](/charting-polygamy/plural-family.png) |
|:--------------------------------------------------------------:|

## How to read

-   The red line indicates the duration of one marriage.
-   The start of each marriage is marked with the age and gap. A negative indicates that person was X years younger than their partner
-   Blue lines indicates a marriage outside the plural family being displayed.[^1]

[see an actual example of Parley P Pratt](/charting-polygamy/chart/shared?data=jVVdb9sgFP0riGcjAf72W7p1i7plipZJfZj6gBtWe3EgwnRTWuW_T4A_sF01ezUXzrnnnHv9CgUs4Japhp_BlqkDV2CrmNZgp2AATxoWr--XlLCAJMMpwhEiFAZwbz_EKcIxIjEM4BEWP19haz_TFOEc4RwGkMGC4gA-wQIRfAn6itBdjFxF6CrIeB6FCBOESXce2_PMO498hDB198mkgGDHzCuIpwUEYTopWJxTPH0g9AqSCcXMFSRegVWLZq4gcj1SeqWAeF3GExWieM4xjifnHUd8ebgEUDfWEOPqj4qJw6_nBqxZ0_Jzb2eapwiHiGSDnaH9QI1ozdFkYmEnn9ZdJvZZfw3ghqkzWAkBPinZ6jE-uaFrTXd4OUE4QzSa4Xnh4EMaEkRDgyf9oIXUKGgF4POr7QkW8BvTFRNgpzlTooXTgNknB4zIfkj7m3ey5acK7I61rsCdgpcHF-asC3Pf621Tv7CS6wrcKKkrrrQUQ8cksUKlY8eWn5XS79iLO58OllOYJg41myh8L-V-hMoMf8_MPDPYeG6mNzlLqIm4EZ6R8q5aidZcqDP4XJdlO8jTESWDPjumWAXW8rn1haHUOI_DgW2WGBaULtn2Y_y2MLTDi3u8NROCVVxrDnai_sOb8ygRNY9ROpGIIkreAO1Ww5ugYQc6YN7wphZ7BjZM7bnXJEaEunh3eJHBIwv3x1XzH5bELk-jJalryVpyw8VvdqwFWJWl1Bqs68bI3rsTdmqFPfNtJXnJwRjinTxVfNz4NDTv4zFVmd0FJJ23kFwJcO9T0iOb9bB6MuMJ7llz8DFzm2TSY-bYRnuxlrz1eUW2BNtRGBaK_6I_7GumVN2C7_X-iQ-RJm6tIre5u-EztDdSHEbS8UDmfa_fI-0LNYz6F_5Sswp8lH9F60fZ3MIDXJra3TqPcnxlsXQ_nTHKtw1nQipwxwQHm8cP8liCzeNXzrylltpY5yO2HdLFGvf-TtdiTeaV49Vu0zxqqXoinTHdPxnZH94_)

# How it works

You can jump in at one of these points:

1. ~~grant access for this app to log into familySearch or ancestry.com~~ (work in progress)
2. upload a file: Gedcom or CSV
3. build a chart

The app will scan the info you provide and identify which men practiced polygamy. It will then generate a chart for each
one to the best of its ability.

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

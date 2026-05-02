# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Charting Polygamy is a project to visualize polygamous marriages. It scans user's ancestral files, formatted csv data, or other methods.

## Tech Notes

The project utilizes the pnpm-workspace to set up a monorepo. The projects are:

- apps
    - cli: a tool for rendering mermaid.js charts based off of a gedcom or csv file
    - ui: a react SPA hosted on github pages that let's users upload an acceptable file or input data themselves and view the chart(s).
- packages:
    - lib: the core algorithm for parsing inputs, searching for polygamous families, and outputting plural family data
    - plural-family-chart: a react component library to render the chart. Utilizes storybook for prototyping
    - crawlers: a tool for crawling wikiTree (or other sources) to get ancestral family data

## UX Principles

When designing UX, focus on charting and presenting complex information in a visual way. The UI should feel very informative and promote deep dive research, even if that research is off site.

Accommodate for mobile and desktop views.

### Copy

When adding copy to the website, use a Scholarly / neutral historian voice. Point out where facts are sourced from wherever possible.

## Testing

utilize unit testing to get a high percent of code coverage

## Conventions

- use typescript and type things wherever possible
- modularize code into packages and tools so further development is possible
- avoid implementing backend features to protect users' family data
- avoid adding styles to react components directly and instead put them in css or scss files

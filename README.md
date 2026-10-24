# Info

This is a production chain solver for the game Satisfactory. The tool is made to
be simple, fast, and easy to use, and is focused on automating some of the more
tedious calculations that come with planning a factory. It is not a full game
simulator, nor is it intended to model multiple interconnecting factories.

I made this tool primarily for me and one friend, to fit our own needs and not
much more. We just want a tool to do some of the tedious algebra for us and
don't need anything more or less than that.

With that in mind, please don't expect much in terms of additional features or
non-critical maintenance. If this sounds like the simplicity you prefer, great!
If not, there are other community tools much better suited to providing a
full-featured experience.

# Site

Hosted at: [https://satisfactory.lunafox.dev](https://satisfactory.lunafox.dev)

![demo screenshot](https://satisfactory.lunafox.dev/screenshot-1.png)

# Features

- Select production targets, available resources, and allowed recipes, and let
  the solver figure out the production chain.
- Supports targeting either a certain items/min goal, a specific number of
  copies of a recipe, or maximizing production using all available resources
- Multiple optimization targets: minimize resource usage, minimize power usage,
  and minimize build area. Not everything in Satisfactory is strictly about
  resource efficiency, and this gives you some options.
- Sharable links for saving and collaboration.
- Zero bloat, fast solver, no site lag while changing settings.
- Supports all production chains including nuclear, ficsmas, and hand-gathered
  resources.
- Reports tab that shows power usage, points produced, materials
  produced/consumed, and some other statistics.
- Provides a breakdown of the buildings required and their material cost so you
  can more easily estimate the scope of the factory.

# AI Disclosure

LLMs were heavily used during the coding of this app. It's kind of impossible to
avoid these days. Modern LLMs are legitimately a very powerful tool that greatly
augment the coding process even for highly experienced programmers. However that
does not mean this app was "vibe coded". This app was written by a human, for
humans. Not for monetization, or clout, or anything else. Additionally no
"agents" were used, meaning no code was written automatically directly into the
project by an LLM. All AI contributions were taken from a conversational format
and all code was reviewed, understood, edited, and manually added by a human.

No generative AI was used, and no copy (including this README) was written by an
LLM.

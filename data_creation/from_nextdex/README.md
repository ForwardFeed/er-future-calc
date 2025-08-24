# from_nextdex

## Install & Run

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Concept

- The UI needs to have data on how what to show
- The calcs needs to know what is there to know

The UI must say that Ability_A has been chosen.
The Calc must know that "Ability_A", as js cannot communicate to the calc but with string representation, correspond to
The AbilityA enum symbol.

The rest of the data that isn't rust symbols, such as power values stays on the UI,
If you say to the calc that your move has a power of 1 Billion, then enjoy having your app crashing because it's a blind trust.

The UI will likely like if you feed it a file with a version in gzip with all data bundled.
As One big object that has all is much more practical.

The Calc however will moreso like splitting, as It would make the task of codegen much more easy.
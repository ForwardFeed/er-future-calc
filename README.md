# FUTURE CALC

Pokemon Calculators remade


## Plans

- Better multiversionning, total modularity so client don't have to download everything as it is currently.
- Modern tooling, Typescript 2.1 was 10 years ago, a lot of workaround of back then aren't anymore
- UI made with vue, I love vue it's just better than basic html + js
- Integration of wasm, which supports better typing such as unsigned int for less problematic calculations
- Enum / Index based Comparison, no more string comparison, to allow better perfs, hence making possible to do bulk calculation without waiting 10 secs
- Better UI, with more data grouping such as trainers's pokemon or trainer's team.
- Automation to generate the data, from games or other source of data.
- UI and calc must be headless, to allow for others UI to replace over time.


## Some things I'd like to add

- sound effect on clicks, moreover on user interactions



## Code structure.
This project is ambitious, as many of my failed projects are. But regardless:

- /data
Plain data storing, UI will feed onto that, calc will feed onto that

- /data_creation
Automation can be required to update the data, romhacks that are in devellopement absolutely needs this part.

- /ui
At least one UI is needed, eventually everyone could do their own, but if we had to place an UI somewhere, lets place it here

- /calc
The actual calculation machinery

- /scripts
any scripts that links this all beautiful world together


## The RUST + WASM road

Typescript is a glorified linter for javascript and functionnaly doesn't help about the painpoints when doing maths.
But I was rather thinking about going the rust and wasm road so I don't struggle with math in calcs.

It's pretty original, maybe too original. But I have it in my head for years now.

Pros:
- Real types, like real integer
- Access to tree shaking building, for multi versionning


Cons:
- typings is difficult to constraint between two languages.
- People having phones who don't support wasm, 4%, will be excluded.


## Installation

### Requirements

I do everything on linux because linux rocks, maybe you can have it working on windows 

To build the calculator: 

- install [rust](https://www.rust-lang.org/tools/install)
- install [wasm-pack](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Rust_to_Wasm#wasm-pack) with `cargo install wasm-pack`

To build the UI:

- install [bun](https://bun.sh/)



### Building the calc

Open a terminal in calc/
```
wasm-pack build --target web
```

### Building the UI

Open a terminal in ui/
```
bun install
```

### Using the project_helper.sh

Jumping from folders to folders is annoying, here's why I made a project helper in bash

There's even autocomplete if you do `. ./scripts/project_helpers.sh` before executing it normally

But if you execute it normally `./scripts/project_helpers.sh`
You will figure out how to use it


## About The Data Building Pipeline flow

Since There's multiples languages to please here, the pipeline is complex.

First I use a data_creation to automate many part of the process.
From that standpoint which is not an absolute requirement, because if you have sanity to give, you could do it manually too.

Anyway, So I pull data from my dex in the data creation(again this is one way to do it).
Then I create a JSON file (that I will gzip at one point) for the UI
and codegen some rust for enums.


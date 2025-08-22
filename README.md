# FUTURE CALC

Pokemon Calculators remade


## What is there to add?

- Better multiversionning, total modularity so client don't have to download everything as it is currently.
- Modern tooling, Typescript 2.1 was 10 years ago, a lot of workaround of back then aren't anymore
- UI made with vue, I love vue it's just better than basic html + js
- Possible integration of wasm, which supports better typing such as unsigned int for less problematic calculations
- Index Based calculation, no more string comparison, to allow better perfs, hence making possible
- Better UI, with more data grouping such as trainers's pokemon or trainer's team.
- conversion from gamecode of made games into data format for all romhacks and other kind of pokemons unofficial games.
- UI and calc must be headless, to allow for better UI to replace over time.
- 


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

- /future-calc
The actual code machinery

- /scripts
any scripts that links this all beautiful world together


## Should everything be ecmascript based?

Typescript is a glorified linter for javascript.
But I was rather thinking about going the rust and wasm road.

### The RUST + WASM road
It's pretty original, maybe too original. But I have it in my head for years now.

Pros:
- Real types, like real integer
- Access to tree shaking algorithm, for multi versionning


Cons:
- having to transpile types from rust to typescript, as the inverse doesn't exist
- needs a /type folder now.
- People having phones who don't support wasm, 4%, will be excluded.

y'know what fuck it lets ball I want to do that.

## Installation

### Requirements

I do everything on linux because linux rocks, maybe you can have it working on windows 

install [rust](https://www.rust-lang.org/tools/install)
install [wasm-pack](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Rust_to_Wasm#wasm-pack) with `cargo install wasm-pack`

### Buildings the calc

Open a terminal in future-calc/
```
wasm-pack build --target web
```



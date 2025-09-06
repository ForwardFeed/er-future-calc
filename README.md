# FUTURE ER CALC

Pokemon Calculators remade, well at least for pokemon elite redux.

## Why remaking it?

The smogon pokemon calc wasn't made to work with the Elite Redux continuous devellopement fashion.
The ER game updates quite often and there is the lastest public version and the latest upcomming version for beta testers.
So multiversionning without code duplication was my aim in this project.

Alongside it I wanted to get past the limitation of the smogon calc. Its slow, each calculation does hundreds of string comparison as javascript doesn't have enums, unless you want to go down some impractical roads. WASM is unlikely to be 50% faster than the most optimised js code for a calculator
But It will definitively go at least 5000% faster from the current implementation.

JS doesn't have integer. Pokemon calculation is based on ints, so in order to imitate the calculation system of pokemon, you have to do some really impractical schemes.

Wasm also is compact in size and can be loaded as a module, each version is its own wasm file and loaded dynamically.

Rust is also a good language to make a calculator in for various reasons, I enjoy coding in that language for ergonomic reasons,
for technical reason it's also the most fitting for wasm, and the metaprogrammign aspect of it in a boilerplate heavy codebase is important.

About the UI, the smogon UI is just bad, I tried to revamped it 2 years ago, and made it much better than the original, but it's still is terrible code
that only I can still manage to code with, making it with vue will make it possible for a much wider range of dev to be able to modify it.

Including a vast build system will allow to be more serene about the CI/CD pipeline, even if it's not going to be a masterpiece.
I'll be using the nextdex dex as my source of truth for the data of this project as well as some assets.

## Compatibility with vanilla pokemon.

I won't do any effort in that direction, if you want that to happen, fork this project, you can still open an issue to discuss about it.

## If you want to help

I don't play Pokemon much anymore, let alone ER, for some reason I still persist in working around it despite leaving the dev team.
But my motivation is rather low compared to what it has been in the past, so any help is welcomed and the simple fact of someone
being interested in the project

## Installation

### Requirements

I do everything on linux because linux rocks, probably you can have it working on windows 

To build the calculator: 

- install [rust](https://www.rust-lang.org/tools/install)
- install [wasm-pack](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Rust_to_Wasm#wasm-pack) with `cargo install wasm-pack`

To build the UI & to run the building process:

- install [bun](https://bun.sh/)


## Project structure

There 3 poles in this project.

- The calc (in rust) in calc/
- The ui (TS + VUE3) in ui/
- The building process & configuration in /build and in the root.


### The building of the project

Due to the constraints of the project, a lot of effort is also within the build process.
while both the ui and the building uses bun.js they don't share the configuration and virtually shouldn't interact.
When I build my UI from the build, I'll do it using a subshell inside the ui/ folder and execute as it I was doing it with a shell
or makefile script.

## Code Style.

For the rust part, keep it as it standart, it's great and important.

For the typescript / ecmascript / vue / html part. I kinda don't care except that if you could use
const keyword whenever possible. If I feel bored I may just do the effort myself of reformatting.

I use 4 spaces as indentations, If you use 2 spaces as identations I don't really care, 
if an active contributor really want to switch to 2 spaces I could make the effort.

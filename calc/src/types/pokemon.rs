use wasm_bindgen::{prelude::*};
use ts_rs::TS;
use serde::{Serialize, Deserialize};

use crate::types::species::Species;

#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize)]
#[ts(export, export_to="pokemon.ts")]
pub enum Nature {
    Adamant,
    Bashful,
    Bold,
    Brave,
    Calm,
    Careful,
    Docile,
    Gentle,
    Hardy,
    Hasty,
    Impish,
    Jolly,
    Lax,
    Lonely,
    Mild,
    Modest,
    Naive,
    Naughty,
    Quiet,
    Quirky,
    Rash,
    Relaxed,
    Sassy,
    Serious,
    Timid,
}
#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize)]
#[ts(export, export_to="pokemon.ts")]
pub enum PokemonStatus {
    Sleep,
    Poison,
    Burn,
    Freeze,
    Paralyz,
    Toxic,
}
#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize)]
#[ts(export, export_to="pokemon.ts")]
pub enum PokemonType {
    Normal,
    Fighting,
    Flying,
    Poison,
    Ground,
    Rock,
    Bug,
    Ghost,
    Steel,
    Fire,
    Water,
    Grass,
    Electric,
    Psychic,
    Ice,
    Dragon,
    Dark,
    Fairy,
    Unknown
}

#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize)]
#[ts(export, export_to="pokemon.ts")]

pub struct Pokemon{
    pub specie: Species,
    pub hp: u16,
    pub hp_max: u16,
}

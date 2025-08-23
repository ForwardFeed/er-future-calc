use wasm_bindgen::{prelude::*};
use serde::{Serialize, Deserialize};
use ts_rs::TS;

#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize)]
#[ts(export, export_to="field.ts")]
pub enum Weather {
    None,
    Sand,
    Sun,
    Rain,
    Hail,
    Snow,
    HarshSunshine,
    HeavyRain,
    StrongWings
}
#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize, Clone, Copy)]
#[ts(export, export_to="field.ts")]
pub enum Terrain {
    None,
    Electric,
    Grassy,
    Psychic,
    Misty,
}
#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize, Clone, Copy)]
#[ts(export, export_to="field.ts")]
pub enum GameType {
    Single,
    Double
}

#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize)]
#[ts(export, export_to="field.ts")]
pub struct Field{
    pub terrain: Terrain,
    pub game_type: GameType,
}
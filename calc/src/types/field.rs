use wasm_bindgen::{prelude::*};
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
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
#[derive(Serialize, Deserialize, Clone, Copy)]
pub enum Terrain {
    None,
    Electric,
    Grassy,
    Psychic,
    Misty,
}
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Copy)]
pub enum GameType {
    Single,
    Double
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Field{
    pub terrain: Terrain,
    pub game_type: GameType,
}
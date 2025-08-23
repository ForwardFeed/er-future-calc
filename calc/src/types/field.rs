use wasm_bindgen::{prelude::*};

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

pub enum Terrain {
    None,
    Electric,
    Grassy,
    Psychic,
    Misty,
}

pub enum GameType {
    Single,
    Double
}

#[wasm_bindgen]
pub struct Field{
    game_type: GameType,

}
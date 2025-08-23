use wasm_bindgen::{prelude::*};

#[wasm_bindgen]
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
pub enum Terrain {
    None,
    Electric,
    Grassy,
    Psychic,
    Misty,
}
#[wasm_bindgen]
pub enum GameType {
    Single,
    Double
}

#[wasm_bindgen]
pub struct Field{
    terrain: Terrain,
    game_type: GameType,
}
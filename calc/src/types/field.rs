use wasm_bindgen::{prelude::*};
use ts_rs::TS;

#[wasm_bindgen]
#[derive(TS)]
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
#[derive(TS)]
#[ts(export, export_to="field.ts")]
pub enum Terrain {
    None,
    Electric,
    Grassy,
    Psychic,
    Misty,
}
#[wasm_bindgen]
#[derive(TS)]
#[ts(export, export_to="field.ts")]
pub enum GameType {
    Single,
    Double
}

#[wasm_bindgen]
#[derive(TS)]
#[ts(export, export_to="field.ts")]
pub struct Field{
    terrain: Terrain,
    game_type: GameType,
}
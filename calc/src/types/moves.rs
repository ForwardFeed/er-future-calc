use wasm_bindgen::prelude::*;
use ts_rs::TS;

#[wasm_bindgen]
#[derive(TS)]
#[ts(export, export_to="moves.ts")]
pub enum MoveTarget{
    AdjacentAlly,
    AdjacentAllyOrSelf,
    AdjacentFoe,
    All,
    AllAdjacent,
    AllAdjacentFoes,
    Allies,
    AllySide,
    AllyTeam,
    Any,
    FoeSide,
    Normal,
    RandomNormal,
    Scripted,
    SSelf,
}
#[wasm_bindgen]
#[derive(TS)]
#[ts(export, export_to="moves.ts")]
pub enum MoveCategory{
    Physical,
    Special,
    Status,
}
#[wasm_bindgen]
#[derive(TS)]
#[ts(export, export_to="moves.ts")]
pub struct MoveFlags{
    contact: bool,
    bite: bool,
    sound: bool,
    kick: bool,
    horn: bool,
    bone: bool,
    punch: bool,
    bullet: bool,
    pulse: bool,
    slicing: bool,
    wind: bool,
    field: bool,
    air: bool,
    weather: bool,
}
#[wasm_bindgen]
#[derive(TS)]
#[ts(export, export_to="moves.ts")]
pub struct Move{
    name: &'static str,
}
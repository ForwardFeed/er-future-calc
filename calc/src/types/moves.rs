use wasm_bindgen::prelude::*;

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

pub enum MoveCategory{
    Physical,
    Special,
    Status,
}

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

pub struct Move{
    name: &'static str,
}
use wasm_bindgen::prelude::*;

use crate::{types::pokemon::Pokemon, web_functions::{alert, log, log_many, log_u32}};

mod web_functions;
mod types{
    pub mod pokemon;
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    log("Hello from Rust!");
    log_u32(42);
    log_many("Logging", "many values!");
    alert(&format!("Hello, {}!", name));
}


fn has_defender_more_hp(attacker: Pokemon, defender: Pokemon) -> bool{
    attacker.hp < defender.hp
}

#[wasm_bindgen]
pub fn calc_gen_redux(attacker: Pokemon, defender: Pokemon){
    has_defender_more_hp(attacker, defender);
}
use wasm_bindgen::prelude::*;

use crate::{calc::calc::calc_entrypoint, types::{field::{Field, Terrain}, pokemon::Pokemon}, web_functions::{alert, error, log, log_many, log_u32}};

mod web_functions;
mod types{
    pub mod pokemon;
    pub mod field;
    pub mod moves;
}

mod calc{
    pub mod calc;
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
pub fn calc_gen_redux(js_attacker: JsValue, js_defender: JsValue, js_field: JsValue){
    let mut attacker: Pokemon = match serde_wasm_bindgen::from_value(js_attacker) {
        Ok(x) => x,
        Err(e) => {
            error(format!("Failed to parse the attacker as a pokemon: {}", e).as_str());
            return;
        },
    };
    let mut defender: Pokemon = match serde_wasm_bindgen::from_value(js_defender) {
        Ok(x) => x,
        Err(e) => {
            error(format!("Failed to parse the defender as a pokemon: {}", e).as_str());
            return;
        },
    };
    let mut field: Field = match serde_wasm_bindgen::from_value(js_field) {
        Ok(x) => x,
        Err(e) => {
            error(format!("Failed to parse the terrain as a terrain: {}", e).as_str());
            return;
        },
    };
    calc_entrypoint(&mut attacker, &mut defender, &mut field);
}
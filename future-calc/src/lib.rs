use wasm_bindgen::prelude::*;

use crate::web_functions::{alert, log, log_many, log_u32};

mod web_functions;

#[wasm_bindgen]
pub fn greet(name: &str) {
    log("Hello from Rust!");
    log_u32(42);
    log_many("Logging", "many values!");
    alert(&format!("Hello, {}!", name));
}

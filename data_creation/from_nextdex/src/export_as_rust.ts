import { export_rust_codegen } from "./filesystem_integration"
import type { GameData } from "../../../ui/src/types/gamedata"

const WARNING_AUTO_EXPORT = `\
// WARNING THIS FILE HAS BEEN AUTO GENERATED AND WILL LIKELY BE AUTOGEN AGAIN LATER
// COMPLETELY OVERWRITING ANY CHANGE MADE
// for more info check the data_creation/from_nextdex
`
const ENUM_FIELD_REGEX = /^[A-Z][a-zA-Z0-9_]*$/


function upper_case_first_letter(str: string): string{
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

export function correct_rust_casing(str: string): string{
    const no_underscore = str.split('_')
    const correct_str = no_underscore.map(upper_case_first_letter).join('')
    if (! ENUM_FIELD_REGEX.test(correct_str))
        throw `string ${str} would be corrected as ${correct_str} which is not a fitting Casing`
    return correct_str
}

function generate_starting_file(): string{
    return `${WARNING_AUTO_EXPORT}
use wasm_bindgen::{prelude::*};
use serde::{Serialize, Deserialize};
use ts_rs::TS;
`
}

function generate_enum({enum_name, enum_content}:{
    enum_name: string,
    enum_content: string[]
}){
    return`
#[wasm_bindgen]
#[derive(TS, Serialize, Deserialize, Clone, Copy)]
pub enum ${enum_name}{
    ${enum_content.join(',\n    ')}
}
`
}


export function generate_rust_for_gamedata(gamedata: GameData){
    
    const BASE_FILE = generate_starting_file()

    // species.rs
    const enum_species_text = generate_enum({
        enum_name: "Species",
        enum_content: gamedata.species.map(x => x.name_id)
    })

    export_rust_codegen({
        filename: "species.rs",
        content: BASE_FILE + enum_species_text
    })
    
    // poketypes.rs
    const enum_poketypes_text = generate_enum({
        enum_name: "Poketypes",
        enum_content: gamedata.indexes.types.map(x => correct_rust_casing(x))
    })

    export_rust_codegen({
        filename: "poketypes.rs",
        content: BASE_FILE + enum_poketypes_text
    })


    
}
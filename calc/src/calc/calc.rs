use crate::types::{field::{self, Field}, pokemon::Pokemon};


pub fn calc_entrypoint(attacker: &mut Pokemon, defender: &mut Pokemon, field: &mut Field){

    ability_spread_ability(defender);
    ability_spread_ability(attacker);

    ability_impact_on_field(defender, field);
    ability_impact_on_field(attacker, field);
    
    calculate_final_stats(defender);
    calculate_final_stats(attacker);


}

// for stuff like Big Leaves in redux which adds abilities
fn ability_spread_ability(pokemon: &mut Pokemon){
    // if has big leaves, add innates
}

// stuff like airlock who neutralize all weather
fn ability_impact_on_field(pokemon: &mut Pokemon, field: &mut Field){

}

// calculate final speed and stuff like that
fn calculate_final_stats(pokemon: &mut Pokemon){

}

// compound eyes or keen eye
fn accuracy_interpolation(attacker: &mut Pokemon, defender: &mut Pokemon){
    
}
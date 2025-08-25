import { correct_rust_casing } from "./export_as_rust"
import type { CompactGameData } from "./types/nextdex_gamedata"
import type { GameData, Specie } from "./types/ui_gamedata"

function indexize<T>(table: T[], value: T){
    if (!table.includes(value)) table.push(value)
    return table.indexOf(value)
}

function substring(element: string, to_remove: string){
    return element.replace(to_remove, "")
}
export function convert_nextdex_to_gamedata(nextdex_gamedata: CompactGameData): GameData{
    const gamedata: GameData = {
        species: [],
        moves: [],
        battle_items: [],
        abilities: [],
        indexes: {
            types: nextdex_gamedata.typeT
        }
    }
    
    convert_species(gamedata, nextdex_gamedata)

    return gamedata
}

function convert_species(gamedata: GameData, nextdex_gamedata: CompactGameData){
    gamedata.species = nextdex_gamedata.species.map(x => {
        return {
            name: x.name,
            name_id: correct_rust_casing(substring(x.NAME, "SPECIES_")),
            types: x.stats.types
        } satisfies Specie
    })
}
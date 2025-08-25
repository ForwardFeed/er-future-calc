import { convert_nextdex_to_gamedata } from "./src/convert"
import { generate_rust_for_gamedata } from "./src/export_as_rust"
import { get_nextdex_game_data } from "./src/filesystem_integration"




async function main(){
    console.log('Starting the conversion')
    const nextdex_gamedata = await get_nextdex_game_data()
    const gamedata = convert_nextdex_to_gamedata(nextdex_gamedata)
    generate_rust_for_gamedata(gamedata)
}

main()
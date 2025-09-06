import { get_nextdex_game_data } from "../filesystem_integration"
import { convert_nextdex_to_gamedata } from "./convert"





async function main(){
    console.log('Starting the conversion')
    const nextdex_gamedata = await get_nextdex_game_data()
    const gamedata = convert_nextdex_to_gamedata(nextdex_gamedata)
}

main()
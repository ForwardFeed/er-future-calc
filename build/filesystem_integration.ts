import type { CompactGameData } from "./import_from_nextdex/types/nextdex_gamedata";
import { readdir } from "node:fs/promises";

export async function get_nextdex_game_data(): Promise<CompactGameData>{
    return await Bun.file('./input/gameDataV2.5.json').json()
}

export function export_rust_codegen({filename, content}: {
    filename: string,
    content: string
}){
    // const path = "./output/v2.5/"+ filename
    const path = "../../calc/src/types/"+ filename
    Bun.write(path, content)
    console.log('Wrote some rust codegen at ' + path)
}

export async function doesDirectoryExist(path: string){
    return new Promise((resolve, reject)=>{
        try{
            readdir(path)
            resolve(undefined)
        } catch(e){
            reject(e)
        }
    })
}
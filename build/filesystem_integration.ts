import type { CompactGameData } from "./import_from_nextdex/types/nextdex_gamedata";
import { readdir } from "node:fs/promises";

function nextdex_gamedata_filepath(version: string){
    return `./input/gameData${version}.json`
}

export async function get_nextdex_gamedata(version: string): Promise<CompactGameData>{
    const filepath = nextdex_gamedata_filepath(version)
    return Bun.file(filepath).json()
}

export async function write_nextdex_gamedata_to_file(version: string, data: string) {
    const filepath = nextdex_gamedata_filepath(version)
    return Bun.write(filepath, data)
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
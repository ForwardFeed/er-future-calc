import { download_nextdex_data } from "./import_from_nextdex/download_nextdex_data";
import type { CompactGameData } from "./import_from_nextdex/types/nextdex_gamedata";
import { readdir } from "node:fs/promises";
import type { ProjectConfigurationFile } from "./types/project_configuration";
import verify_config from "./verify_config";

export async function get_nextdex_gamedata_or_download_it(version: string): Promise<CompactGameData> {
    return new Promise((resolve, reject)=>{
        get_nextdex_gamedata(version)
        .then((data)=>{
            resolve(data)
        })
        .catch((err)=>{
            console.log(`failed to get nextdex gamedata from files: ${err}
    downloading the nextdex data from github`)
            download_nextdex_data(version)
            .then((data)=>{
                write_nextdex_gamedata_to_file(version, JSON.stringify(data))
                resolve(data)
            })
            .catch((err)=>{
                reject(err)
            })
        })
    })
}

function nextdex_gamedata_filepath(version: string){
    return `./build/input/gameDataV${version}.json`
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

export async function get_config_file_and_verify(path: string): Promise<ProjectConfigurationFile>{
    return new Promise(async (resolve, reject)=>{
        const file_text = Bun.file(path)
        if (!(await file_text.exists())){
            return reject(`Configuration file wasn't found with path: ${path}`)
        }
        file_text.json()
        .then((data)=>{
            try{
                verify_config(data)
                resolve(data as ProjectConfigurationFile)
            } catch(e){
                reject(`Configuration file wasn't validated as of ProjectConfigurationFile type`)
            }
            
        })
        .catch((err)=>{
            reject(`Configuration file wasn't valid json: ${err}`) 
        })
    })
}


export async function move_wasm_builded_files_to_ui(version_id: string, calc_folder = "./calc/pkg", ui_folder = "./ui/public/wasm"){
    const origin_files_to_target: [string, string][]= [
        [`${calc_folder}/future_calc_bg.wasm`, `${ui_folder}/${version_id}/future_calc_bg.wasm`],
        [`${calc_folder}/future_calc_bg.wasm.d.ts`, `${ui_folder}/${version_id}/future_calc_bg.wasm.d.ts`],
        [`${calc_folder}/future_calc.d.ts`, `${ui_folder}/${version_id}/future_calc.d.ts`],
        [`${calc_folder}/future_calc.js`, `${ui_folder}/${version_id}/future_calc.js`],
    ]
    console.log('moving wasm calc file to UI folder')
    for (const pair of origin_files_to_target){
        await Bun.write(pair[1], Bun.file(pair[0]))
    }
}
import type { CompactGameData } from "./types/nextdex_gamedata"


export async function download_nextdex_data(version: string): Promise<CompactGameData>{
    // get it from my own github 
    const URL = `https://raw.githubusercontent.com/ForwardFeed/ER-nextdex/refs/heads/main/static/js/data/gameDataV${version}.json`
    return new Promise((resolve, reject)=>{
        fetch(URL)
        .then((response)=>{
            if (!response.ok){
                return reject('response was not ok')
            }
            response.json()
            .then((gamedata)=>{
                return resolve(gamedata as CompactGameData)
            })
            .catch((err)=>{
                return reject(`couldn't make nextdex data to json: ${err}`)
            })
        })
        .catch((err)=>{
            return reject(`Failed to get the nextdex data from URL ${URL}\n err: ${err}`)
        })
    })
}
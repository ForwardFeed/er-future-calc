

export async function download_nextdex_data(version: string, target_file: string){
    // get it from my own github 
    const URL = `https://raw.githubusercontent.com/ForwardFeed/ER-nextdex/refs/heads/main/static/js/data/gameDataV${version}.json`
    return new Promise((resolve, reject)=>{
        fetch(URL)
        .then((response)=>{
            if (!response.ok){
                return reject('response was not ok')
            }
            response.text()
            .then((text)=>{
                return resolve(text)
            })
            .catch((err)=>{
                return reject(`couldn't make nextdex data to text: ${err}`)
            })
        })
        .catch((err)=>{
            return reject(`Failed to get the nextdex data from URL ${URL}\n err: ${err}`)
        })
    })
}
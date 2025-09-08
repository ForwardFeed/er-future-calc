
const BUILD_CALC_COMMAND = "bun run build-calc".split(' ')

export async function compile_calculator(){
    const proc = Bun.spawn(BUILD_CALC_COMMAND)
    setTimeout(async ()=>{
        const decoder = new TextDecoder()
        for await (const chunk of proc.stdout) {
            console.log(`>CALC-BUILD: ${decoder.decode(chunk)}`)
        }
    })
    return proc
}

const RUN_UI_DEV = "bun run run-ui".split(' ')

export async function run_ui_dev(){
    const proc = Bun.spawn(RUN_UI_DEV)
    setTimeout(async ()=>{
         const decoder = new TextDecoder()
        for await (const chunk of proc.stdout) {
            console.log(`>UI: ${decoder.decode(chunk)}`)
        }
    })
   
    
    return proc
}
import { compile_calculator } from "./subprocesses";


export async function build_calculator(){
    const proc_calculator_build = (await compile_calculator())
    if (await proc_calculator_build.exited){
        throw`compilation returned non-zero code: ${proc_calculator_build.exitCode}`
    }
}
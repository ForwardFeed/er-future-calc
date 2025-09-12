import { move_wasm_builded_files_to_ui } from "./filesystem_integration";
import { compile_calculator } from "./subprocesses";


export async function build_calculator(version_id: string){
    const proc_calculator_build = (await compile_calculator(version_id))
    if (await proc_calculator_build.exited){
        throw`compilation returned non-zero code: ${proc_calculator_build.exitCode}`
    }
    move_wasm_builded_files_to_ui(version_id)
}


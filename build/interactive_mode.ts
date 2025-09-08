import { compile_calculator, run_ui_dev } from "./subprocesses"


export async function setup_interactive_mode(){

    const proc_ui = await run_ui_dev()
    
    const cleanup_before_exit = async ()=>{
        console.log(`Cleaning up`)
        proc_ui.send("SIGINT")
    }

    // clean up the process launched if:
    process.on('SIGINT', cleanup_before_exit) // Ctrl + C
    process.on('SIGTERM', cleanup_before_exit) // Terminate Program normally
    process.on('SIGKILL', cleanup_before_exit) // Force kill
    process.on('SIGHUP', cleanup_before_exit) // Terminal Connection Broken

    

    const prompt = "Press Enter to recompile the calculator: ";
    process.stdout.write(prompt);
    
    for await (const _line of console) {
        const proc_calculator_build = (await compile_calculator())
        if (await proc_calculator_build.exited){
            console.error(`compilation returned non-zero code: ${proc_calculator_build.exitCode}`)
            process.exit(11)
        }
        process.stdout.write(prompt);
    }
    await Bun.sleep(1000);
}
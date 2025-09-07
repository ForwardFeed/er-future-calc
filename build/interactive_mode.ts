import { compile_calculator } from "./subprocesses"


function cleanup_before_exit(){
    console.log(`Cleaning up`)

    process.exit()
}

export async function setup_interactive_mode(){
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
            console.error(`compilation returned non-zero code: ${await proc_calculator_build.stdout.text()}, with out`)
            process.exit(11)
        } else {
            console.log(await proc_calculator_build.stdout.text())
        }

        process.stdout.write(prompt);
    }
    await Bun.sleep(1000);
}
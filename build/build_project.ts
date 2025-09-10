import { exit } from "process";
import { parse_CLI_args, type ParseCLIArgsErrorStatus } from "./cli_args";
import { get_nextdex_gamedata_or_download_it } from "./filesystem_integration";
import { setup_interactive_mode } from "./interactive_mode";
import { build_calculator } from "./build_pipeline";
import { verify_calc_cargo_toml } from "./verify_config_project";
import type { AppParameters } from "./types/project_configuration";


console.log('Starting the process to build the project')

let cli_arguments: ParseCLIArgsErrorStatus | AppParameters

try{
    cli_arguments = await parse_CLI_args()
} catch(e){
    console.error(e)
    exit(2)
}

if (cli_arguments == "ASKED HELP"){
    exit(0)
} else if (cli_arguments == "ERR"){
    exit(3)
}

// validate, or auto implement features in the cargo.toml
await verify_calc_cargo_toml(cli_arguments.versions_data)

if (cli_arguments.download_nextdex){
    let nextdex_gamedata = await get_nextdex_gamedata_or_download_it(cli_arguments.selected_version)
    console.log(nextdex_gamedata.abilities[1])
}

if (cli_arguments.mode_interactive){
    setup_interactive_mode(cli_arguments.selected_version_data.name_id)
} else {
    try{
        await build_calculator(cli_arguments.selected_version_data.name_id)
    } catch(e){
        process.exit(21)
    }
}

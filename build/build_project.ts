import { exit } from "process";
import { parse_CLI_args } from "./cli_args";
import { get_nextdex_gamedata_or_download_it } from "./filesystem_integration";
import { setup_interactive_mode } from "./interactive_mode";


console.log('Starting the process to build the project')

let cli_arguments = await parse_CLI_args()

if (cli_arguments == "ASKED HELP"){
    exit(0)
} else if (cli_arguments == "ERR"){
    exit(1)
}

if (cli_arguments.download_nextdex){
    let nextdex_gamedata = await get_nextdex_gamedata_or_download_it(cli_arguments.selected_version)
    console.log(nextdex_gamedata.abilities[1])
}


// this true will be replaced by a config specification later

if (cli_arguments.mode_interactive){
    setup_interactive_mode()
}

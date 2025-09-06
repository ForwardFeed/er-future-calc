import { exit } from "process";
import { parseArgs } from "util";
import type { ProjectConfigurationFile } from "./types/project_configuration";
import verify_config from "./verify_config";
import { parse_CLI_args } from "./cli_args";

console.log('Starting the process to build the project')

let cli_arguments = await parse_CLI_args()

if (cli_arguments == "ASKED HELP"){
    exit(0)
} else if (cli_arguments == "ERR"){
    exit(1)
}

console.log(cli_arguments)

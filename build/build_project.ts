import { exit } from "process";
import { parse_CLI_args } from "./cli_args";


console.log('Starting the process to build the project')

let cli_arguments = await parse_CLI_args()

if (cli_arguments == "ASKED HELP"){
    exit(0)
} else if (cli_arguments == "ERR"){
    exit(1)
}





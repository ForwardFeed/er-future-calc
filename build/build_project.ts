import { exit } from "process";
import { parseArgs } from "util";
import type { ProjectConfigurationFile } from "./types/project_configuration";
import verify_config from "./verify_config";
import { parse_CLI_args } from "./cli_args";

console.log('Starting the process to build the project')

console.log(parse_CLI_args())

/* const OPTIONS_ARGS: ParseArgsConfig =  {
        help: {
            type: "boolean",
            short: "h",
            default: false,
            required: false,
        },
        file_configuration: {
            type: "string",
            short: "f",
            default: './project_configuration.json',
            required: false
        },
        project_folder: {
            type: "string",
            short: "p",
            default: "./",
            required: false
        },
        selected_version: {
            type: 'string',
            short: 's',
            default: '',
            required: false,
        }
}
const {values: cli_arguments}  = parseArgs({
    args: Bun.argv,
    options: OPTIONS_ARGS,
    strict: true,
    allowPositionals: true,
})
 */
/* if (cli_arguments.help){

}

const file_configuration = await Bun.file(cli_arguments.file_configuration).json() as ProjectConfigurationFile
try{
    verify_config(file_configuration)
    console.log('successfully verified configuration file: ' + cli_arguments.file_configuration)
} catch(e){
    console.error('failed to verify configuration file: ' + cli_arguments.file_configuration + '\n reasons: ', e)
    exit(1)
}

if (!cli_arguments.selected_version){
    console.error('no versions were selected, available versions: ', file_configuration.versions.map(x => x.name).join(', '))
    exit(2)
} */

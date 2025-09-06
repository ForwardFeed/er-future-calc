import { exit } from "process";
import { parseArgs } from "util";
import type { ProjectConfigurationFile } from "./types/project_configuration";
import verify_config from "./verify_config";

console.log('Starting the process to build the project')

const {values: cli_arguments}  = parseArgs({
    args: Bun.argv,
    options: {
        file_configuration: {
            type: "string",
            short: "f",
            default: './project_configuration.json',
            required: false
        },
        selected_version: {
            type: 'string',
            short: 's',
            default: '',
            required: false,
        }
    },
    strict: true,
    allowPositionals: true,
})
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
    exit(1)
}

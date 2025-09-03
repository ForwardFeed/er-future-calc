import { exit } from "process";
import { parseArgs } from "util";

console.log('Starting the process to build the project')

const {values: cli_arguments}  = parseArgs({
    args: Bun.argv,
    options: {
        file_version: {
            type: "string",
            short: "f",
            default: '../versions.json',
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
const file_versions = await Bun.file(cli_arguments.file_version).json()
if (!cli_arguments.selected_version){
    console.error('no versions were selected, available versions: ', file_versions.versions.map((x: { name: any; }) => x.name).join(', '))
    exit(1)
}

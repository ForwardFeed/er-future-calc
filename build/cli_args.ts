import clc from 'cli-color';
import type { ProjectConfigurationFile } from './types/project_configuration';
import verify_config from './verify_config';

type ParamRules = {
    optional?: boolean,
    long:     string,
    short?:    string,
    desc:      string[],
    example?:  string,
    default:   any,
    // return an error message to say something went wrong as a message of error
    // or return false as it's a valid type
    type_check: (value: any)=> string | false,
    // return an error message if something went wrong
    validity_check:  (value: any, project_configuration: ProjectConfigurationFile)=> string | false,
}


export type AppParameters = {
    file_configuration: string,
    selected_version: string
}

const PARAM_CONFIG_DATA: {[key in keyof AppParameters]: ParamRules} = {
    file_configuration: {
        optional: true,
        long: 'file-configuration',
        short: 'f',
        desc: [],
        example: '',
        default: './project_configuration.json',
        type_check: function (value: any): string | false {
            if (typeof value === "string") 
                return false
            return "Supposed to be a string as it is a file path"
        },
        validity_check: function (value: any): string | false {
            return false
        },
    },
    selected_version: {
        long: 'selected-version',
        short: 's',
        desc: [],
        default: undefined,
        type_check: function (value: any): string | false {
            if (typeof value != "string")
                return `Selected version must be a string`
            return false
        },
        validity_check: function (selected_version: any, project_configuration): string | false {
            if (!selected_version){
                return `no version selected, please chose one of ${project_configuration.versions.map(x => x.name)}`
            }
            if (!~project_configuration.versions.findIndex(x => x.name == selected_version)){
                return `wrong version selected ${selected_version}, please chose one of \`${project_configuration.versions.map(x => x.name).join(', ')}\``
            }
            return false
        }
    }
}

type ParamConfigKey = keyof typeof PARAM_CONFIG_DATA

function printHelp(target_utility?: ParamConfigKey){
    const keyF        = clc.bold.bgBlack.cyan
    const commandF    = clc.bold.bgBlack.green
    const descF       = clc.italic
    const fieldF      = clc.bold.bgBlack.blue
    const spaceKey    = " ".repeat(Math.max(0, 14 - "help".length))
    const tab         = "    "
    const helpText    = `Printing Help
${keyF("help")}:${spaceKey}${commandF("-h")}${tab}${commandF("--help:")}
${tab}${descF("Show this message")}\n`

    function printHelpOne(key: ParamConfigKey){
        const spaceKey = " ".repeat(Math.max(0, 14 - key.length))
        const param = PARAM_CONFIG_DATA[key]
        const descText = param.desc.map((x)=> descF(`${tab}${x}`)).join("\n")
        console.log(
`${keyF(key)}:${spaceKey}${param.short ? commandF("-" + param.short) :"  "}${tab}${commandF("--" + param.long)}\
${descText ? "\n" + descText: ""}
${tab}${fieldF("type:")} ${typeof param.default}
${tab}${fieldF("default:")} ${param.default}\n`)
    }
    if (target_utility){
        console.log('printing help only for: ', PARAM_CONFIG_DATA[target_utility].long)
        printHelpOne(target_utility)
        return
    }
    for (const key in PARAM_CONFIG_DATA){
        printHelpOne(key as keyof typeof PARAM_CONFIG_DATA)
    }
    // print in stdout regardless of the log level
    console.log(helpText)
}

export type ParseCLIArgsErrorStatus =  "ERR" | "ASKED HELP"


function find_param_key(target: string): ParamConfigKey | undefined{
    for (const param_value_key_cringe in PARAM_CONFIG_DATA){
        const param_value_key = param_value_key_cringe as ParamConfigKey
        const param_value = PARAM_CONFIG_DATA[param_value_key]
        if (param_value.short == target)
            return param_value_key
        if (param_value.long  == target)
            return param_value_key
    }
}
/**
 * 
 * @returns true if its a failure (weird I know but it's easier down the line)
 */
function isParameterChecksInvalid(param_config: ParamRules, key: ParamConfigKey, value: any, project_configuration: ProjectConfigurationFile): boolean{
    const typecheck_error_msg_or_none = param_config.type_check(value)
    if (typecheck_error_msg_or_none ){
        console.error(`parameter ${key} has wrong type: ${typecheck_error_msg_or_none}`)
        return true
    }
    const value_validity_error_msg_or_none = param_config.validity_check(value, project_configuration)
    if (value_validity_error_msg_or_none){
        console.error(`parameter ${key} wasn't a valid value ${value_validity_error_msg_or_none} `)
        return true
    }  
    return false
}

export async function parse_CLI_args(): Promise<AppParameters | ParseCLIArgsErrorStatus>{
    const args = require('minimist')(Bun.argv.slice(2))
    // I was lazy, so it auto writes a default object for me.
    // @ts-expect-error
    const parameters: AppParameters = Object.keys(PARAM_CONFIG_DATA).reduce((cumu, curr)=>{
        // @ts-expect-error
        cumu[curr] = PARAM_CONFIG_DATA[curr].default
        return cumu
    }, {})

    // due to the specificity of my program I need to first to valide the configuration file.
    const filepath_configuration = args[PARAM_CONFIG_DATA.file_configuration.long] || 
        args[PARAM_CONFIG_DATA.file_configuration.short || ""] || 
        PARAM_CONFIG_DATA.file_configuration.default
    
    if (!filepath_configuration){
        console.error(`Failed to get the path of the configuration file (${PARAM_CONFIG_DATA.file_configuration.long})`)
        return "ERR"
    }
    if (typeof filepath_configuration != "string"){
        console.error(`the path of the configuration file (${PARAM_CONFIG_DATA.file_configuration.long}) has the wrong type: ${typeof filepath_configuration}`)
        return "ERR"
    }

    const project_configuration = await Bun.file(filepath_configuration).json() as ProjectConfigurationFile
    try{
        verify_config(project_configuration)
        console.log('successfully verified configuration file: ' + filepath_configuration)
    } catch(e){
        console.error('failed to verify configuration file: ' + filepath_configuration + '\n reasons: ', e)
        return "ERR"
    }

    if (args["h"] || args["help"]){
        const value = args["h"] || args["help"]
        // in case of a help for a specific utility
        if (value && typeof value == "string"){
            const target_utility = find_param_key(value)
            if (target_utility){
                printHelp(target_utility)
            } else {
                console.warn(`Unrecognized command ${value}, here's the list`)
                printHelp()
            }
        } else {
            printHelp()
        }
        return "ASKED HELP"
    }
    let error_in_parsing = false
    for (const param_value_key_cringe in PARAM_CONFIG_DATA){
        const param_value_key = param_value_key_cringe as ParamConfigKey
        if (param_value_key == "file_configuration"){
            continue // the check has been done before this loop
        }
        const param_value = PARAM_CONFIG_DATA[param_value_key] 
        let value = args[param_value.long] ||  args[param_value.short || ""]
        if (typeof value == 'number'){
            // typecast all numbers 
            value = value + ""
        }
        if (typeof value != "string" && typeof value != "boolean"){
            console.warn(`type of value for ${ args[param_value.long] ? param_value.long : param_value.short} is ${typeof value}
Which is not a boolean or a string, it will likely cause a bug`)
        }
        if (! value){
            if (! param_value.optional){
                console.error(`parameters --${param_value.long} ${param_value.short ? `(-${param_value.short})` : ''} is mandatory!
\`For more detail you may do ${Bun.argv[1]} --help --${param_value.long}\``)
                error_in_parsing = true
            } 
            continue
        }
        const has_error_checking = isParameterChecksInvalid(param_value, param_value_key, value, project_configuration)
        if (has_error_checking){
            error_in_parsing = true
            continue
        }
        parameters[param_value_key] = value
        
    }
    for (const arg in args){
        const value = args[arg] as string | string[]
        if (Array.isArray(value)){
            if (arg == "_"){
                if (value.length){
                    console.warn(`unsupported positional arguments: ${value.join()}`)
                }
                continue
            }
            console.warn(`unexpected array from value ${arg} with arguments ${value.join()}`)
            continue 
        }
    }
    return error_in_parsing ? "ERR" : parameters
}
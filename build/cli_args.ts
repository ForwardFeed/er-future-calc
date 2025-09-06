import clc from 'cli-color';

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
    validity_check:  (value: any)=> string | false,
}


export type AppParameters = {
    file_configuration: string
}

const PARAM_CONFIG_DATA: {[key in keyof AppParameters]: ParamRules} = {
    file_configuration: {
        optional: undefined,
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
            Bun.file(value).exists()
            .then(()=>{})
            .catch((err)=>{
                console.error(`configuration file with path ${value}, doesn't exist, err: ${err}`)
            })
            return false
        },
    },
}

type ParamConfigKey = keyof typeof PARAM_CONFIG_DATA

function printHelp(print_single_utility?: ParamConfigKey){
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
    if (print_single_utility){
        console.log('printing help only for: ', PARAM_CONFIG_DATA[print_single_utility].long)
        printHelpOne(print_single_utility)
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


export function parse_CLI_args(): ParseCLIArgsErrorStatus | AppParameters{
    const args = require('minimist')(Bun.argv.slice(2))
    const parameters: AppParameters = {
        file_configuration: PARAM_CONFIG_DATA.file_configuration.default
    }
    if (args["h"] || args["help"]){
        const value = args["h"] || args["help"]
        // in case of a help for a specific utility
        if (value && typeof value == "string"){
            const potential_utility = find_param_key(value)
            if (potential_utility){
                printHelp(potential_utility)
            } else {
                console.warn(`Unrecognized command ${value}, cannot give help`)
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
        const param_value = PARAM_CONFIG_DATA[param_value_key]
        const value = args[param_value.long] ||  args[param_value.short || ""] 
        if (! value){
            if (! param_value.optional){
                console.error(`parameters ${param_value_key} is mandatory!`)
                error_in_parsing = true
            } else {
                parameters[param_value_key] = param_value.default
            }
            continue
        }
        const typecheck_error_msg_or_none = param_value.type_check(value)
        if (typecheck_error_msg_or_none ){
            console.error(`parameter ${param_value_key} has wrong type: ${typecheck_error_msg_or_none}`)
            error_in_parsing = true
        }
        const value_validity_error_msg_or_none = param_value.validity_check(value)
        if (value_validity_error_msg_or_none){
            console.error(`parameter ${param_value_key} wasn't a valid value ${value_validity_error_msg_or_none} `)
        } else {
            parameters[param_value_key] = value
        }
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
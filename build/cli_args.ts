import clc from 'cli-color';

type ParamRules = {
    optional?: boolean,
    long:     string,
    short?:    string,
    desc:      string[],
    example?:  string,
    default:   any,
    // return true if it's invalid, or an error message to say something went wrong with a message of error
    // or reaturn false as everything is okay
    typecheck: (value: any)=> string | boolean,
    // return true if it's invalid, so there has been an error
    // or return false as everything is okay
    exec:      (value: any)=> boolean,
    // return true is there has been an error
    // return false as everything is is okay
    postParseCheck?: ()=>boolean,
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
        typecheck: function (value: any): string | boolean {
            throw new Error('Function not implemented.');
        },
        exec: function (value: any): boolean {
            throw new Error('Function not implemented.');
        },
        postParseCheck: undefined,
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
        const param_value = PARAM_CONFIG_DATA[param_value_key ]
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
    let error = false
    for (const arg in args){
        const value = args[arg] as string | string[]
        if (arg == "h" || arg == "help"){
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
        const param_key= find_param_key(arg)
        if (!param_key){
            console.warn(`argument: ${arg} wasn't expected, ignoring`)
            continue
        }
        const param = PARAM_CONFIG_DATA[param_key]
    }
    return error ? "ERR" : parameters
}
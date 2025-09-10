import clc from 'cli-color';
import type { AppParameters, CLIParameters, CLIParamRule, ProjectConfigurationFile, TypeOfSupportedString } from './types/project_configuration';
import { get_config_file_and_verify } from './filesystem_integration';

function simple_type_check(value: any, type: TypeOfSupportedString, error_text: string) : string | false{
    if (typeof value == type){
        return false
    }
    return error_text
}

const CLI_PARAM_RULES: {[key in keyof CLIParameters]: CLIParamRule} = {
    file_configuration: {
        optional: true,
        long: 'file-configuration',
        short: 'f',
        desc: [],
        example: '',
        default: './project_configuration.json',
        type_check: function (value: any): string | false {
            return simple_type_check(value, "string", "Supposed to be a string as it is a file path");
        },
        validity_check: function (value: any): string | false {
            return false;
        },
    },
    selected_version: {
        long: 'selected-version',
        short: 's',
        desc: [],
        default: "none, you have to provide it",
        type_check: function (value: any): string | false {
            return simple_type_check(value, "string", "Selected version must be a string");
        },
        validity_check: function (selected_version: any, project_configuration): string | false {
            if (!selected_version) {
                return `no version selected, please chose one of ${project_configuration.versions.map(x => x.name)}`;
            }
            if (!~project_configuration.versions.findIndex(x => x.name == selected_version)) {
                return `wrong version selected ${selected_version}, please chose one of \`${project_configuration.versions.map(x => x.name).join(', ')}\``;
            }
            return false;
        },
        optional: false
    },
    download_nextdex: {
        optional: true,
        long: 'download-nextdex',
        short: 'd',
        desc: [],
        default: false,
        type_check: function (value: any): string | false {
            return simple_type_check(value, "boolean", "please do no give arguments to that one, unless =false");
        },
        validity_check: function (value: any, project_configuration: ProjectConfigurationFile): string | false {
            return false;
        }
    },
    mode_interactive: {
        optional: true,
        long: 'mode-interactive',
        short: 'm',
        desc: [],
        example: undefined,
        default: false,
        type_check: function (value: any): string | false {
            return simple_type_check(value, "boolean", "please do no give arguments to that one, unless =false");
        },
        validity_check: function (value: any, project_configuration: ProjectConfigurationFile): string | false {
            return false;
        }
    }
}

type ParamConfigKey = keyof typeof CLI_PARAM_RULES

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
        const param = CLI_PARAM_RULES[key]
        const descText = param.desc.map((x)=> descF(`${tab}${x}`)).join("\n")
        console.log(
`${keyF(key)}:${spaceKey}${param.short ? commandF("-" + param.short) :"  "}${tab}${commandF("--" + param.long)}\
${descText ? "\n" + descText: ""}
${tab}${fieldF("type:")} ${typeof param.default}
${tab}${fieldF("default:")} ${param.default}\n`)
    }
    if (target_utility){
        console.log('Printing help only for: ', CLI_PARAM_RULES[target_utility].long)
        printHelpOne(target_utility)
        return
    }
    for (const key in CLI_PARAM_RULES){
        printHelpOne(key as keyof typeof CLI_PARAM_RULES)
    }
    // print in stdout regardless of the log level
    console.log(helpText)
}

export type ParseCLIArgsErrorStatus =  "ERR" | "ASKED HELP"


function find_param_key(target: string): ParamConfigKey | undefined{
    for (const param_value_key_cringe in CLI_PARAM_RULES){
        const param_value_key = param_value_key_cringe as ParamConfigKey
        const param_value = CLI_PARAM_RULES[param_value_key]
        if (param_value.short == target)
            return param_value_key
        if (param_value.long  == target)
            return param_value_key
    }
}

function typecast_argument_value_to_string_boolean_only(value: any, arg: string): any{
    // typecast 
    if (typeof value == "number")
        return value + ""
    // non-typecast
    if (typeof value == "string")
        return value
    if (typeof value == "boolean")
        return value
    console.warn(`Typecasted argument: ${arg}, with value; ${value} was type of ${typeof value}
Which is something that may turn out to be a bug`)
    return value
}

function get_parameter_value<T>(args: any, rule: CLIParamRule, project_configuration: ProjectConfigurationFile): T{
    const value_in_args_raw = args[rule.long] || (rule.short && args[rule.short])
    if (value_in_args_raw){
        const param_used = args[rule.long] ? "--"  + rule.long : "-" + rule.short
        const value_in_args = typecast_argument_value_to_string_boolean_only(value_in_args_raw, param_used)
        const typecheck = rule.type_check(value_in_args)
        if (typecheck)
            throw `TypeCheck error on CLI parameter ${param_used} : ${typecheck}`
        const valuecheck = rule.validity_check(value_in_args, project_configuration)
        if (valuecheck)
            throw `Validity Error on CLI parameter ${param_used} : ${valuecheck}`
        return value_in_args
    }
    if (rule.optional){
        return rule.default as T
    }
    throw `CLI parameter: --${rule.long} ${rule.short ? `-${rule.short}` : ''} is mandatory`
}

export async function parse_CLI_args(): Promise<AppParameters | ParseCLIArgsErrorStatus>{
    const args = require('minimist')(Bun.argv.slice(2))
   
    // First I look if the user checked help
    const help_rule: CLIParamRule = {
        optional: true,
        long: 'help',
        short: 'h',
        desc: [],
        default: false,
        type_check: function (): string | false {
            return false
        },
        validity_check: function (): string | false {
            return false
        }
    }
    const value_of_help = get_parameter_value(args, help_rule, {} as ProjectConfigurationFile)
    if (value_of_help){
        if (value_of_help && typeof value_of_help == "string"){
            const target_utility = find_param_key(value_of_help)
            if (target_utility){
                printHelp(target_utility)
            } else {
                console.warn(`Unrecognized command ${value_of_help}, here's the list`)
                printHelp()
            }
        } else {
            printHelp()
        }
        return "ASKED HELP"
    }
    // Then I check for the positionnal arguments in case the user is confused by this custom made CLI argument
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
    // due to the specificity of my program I need to first to valide the configuration file.
    // so I can get a ProjectConfigurationFile, which I cheat here
    const filepath_configuration = get_parameter_value(args, CLI_PARAM_RULES.file_configuration, {} as ProjectConfigurationFile)

    if (!filepath_configuration){
        console.error(`Failed to get the path of the configuration file (${CLI_PARAM_RULES.file_configuration.long})`)
        return "ERR"
    }
    if (typeof filepath_configuration != "string"){
        console.error(`the path of the configuration file (${CLI_PARAM_RULES.file_configuration.long}) has the wrong type: ${typeof filepath_configuration}`)
        return "ERR"
    }

    const project_configuration = await get_config_file_and_verify(filepath_configuration)

    const app_parameters: AppParameters = {
        file_configuration: filepath_configuration,
        selected_version: get_parameter_value(args, CLI_PARAM_RULES.selected_version, project_configuration),
        download_nextdex: get_parameter_value(args, CLI_PARAM_RULES.download_nextdex, project_configuration),
        mode_interactive: get_parameter_value(args, CLI_PARAM_RULES.mode_interactive, project_configuration),

        versions_data: project_configuration.versions,
        
    }

    return app_parameters
}
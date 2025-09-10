export type VersionConfig = {
    name: string,
    name_id: string,
    build_id: number
}

export type ProjectConfigurationFile = {
    versions: VersionConfig[]
}

export type TypeOfSupported = string | boolean 
export type TypeOfSupportedString = "string" | "boolean"

export type CLIParamRule = {
    optional: boolean,
    long:     string,
    short?:    string,
    desc:      string[],
    example?:  string,
    default:   TypeOfSupported,
    // return an error message to say something went wrong as a message of error
    // or return false as it's a valid type
    type_check: (value: any)=> string | false,
    // return an error message if something went wrong
    validity_check:  (value: any, project_configuration: ProjectConfigurationFile)=> string | false,
}


export type CLIParameters = {
    file_configuration: string,
    selected_version: string,
    download_nextdex: boolean,
    mode_interactive: boolean
}

export type AppParameters = CLIParameters & {

    versions_data: VersionConfig[],
}
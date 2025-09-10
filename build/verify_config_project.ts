import Ajv,  {type JSONSchemaType} from "ajv"
import type { ProjectConfigurationFile, VersionConfig } from "./types/project_configuration"
import type { JTDDataType } from "ajv/dist/core"
import { get_calc_cargo_toml } from "./filesystem_integration"
import { TOML } from "bun"

const config_file_schema: JSONSchemaType<ProjectConfigurationFile> = {
    type: "object",
    properties: {
        versions: {
        type: "array",
        items: {
            type: "object",
            properties: {
            "name": {
                type: "string"
            },
            "name_id": {
                type: "string"
            },
            "build_id": {
                type: "number"
            }
            },
            required: [
            "name",
            "name_id",
            "build_id"
            ]
        }
        }
    },
    required: [
        "versions"
    ]
}

type ProjectConfigurationFileSchema = JTDDataType<typeof config_file_schema>


export function verify_config_project(json_data: ProjectConfigurationFile): ProjectConfigurationFile{
    const ajv = new Ajv()
    const validate = ajv.compile<ProjectConfigurationFileSchema>(config_file_schema)

    if (validate(json_data)){
        return json_data
    }
    throw validate.errors
}

export async function verify_calc_cargo_toml(version_config: VersionConfig[]){
    const cargo_file = await get_calc_cargo_toml()
    const cargo_toml = TOML.parse(cargo_file) as any
    const features = Object.keys(cargo_toml.features)

    const missing_features_version = version_config.reduce((cumu, curr)=>{
        if (!~features.indexOf(curr.name_id))
            cumu.push(curr.name_id)
        return cumu
    }, [] as string[])
    
    if (missing_features_version.length){
        throw `Missing version as features in the calc cargo toml: ${missing_features_version}`
    }
}
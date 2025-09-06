import Ajv,  {type JSONSchemaType} from "ajv"
import type { ProjectConfigurationFile } from "./types/project_configuration"
import type { JTDDataType } from "ajv/dist/core"

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


export function verify_config(json_data: ProjectConfigurationFile): ProjectConfigurationFile{
    const ajv = new Ajv()
    const validate = ajv.compile<ProjectConfigurationFileSchema>(config_file_schema)

    if (validate(json_data)){
        return json_data
    }
    throw validate.errors
}


export default verify_config
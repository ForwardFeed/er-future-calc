export type VersionConfig = {
    name: string,
    name_id: string,
    build_id: number
}

export type VersionConfigFile = {
    versions: VersionConfig[]
}

export interface CompactedScripted {
    how: number, // indexed from CompactGameData.ScriptedEncoutersHowT
    map: number, // index from CompactGameData.maps.
}

export interface CompactLocations {
    maps: CompactLocation[],
    landRate: number[],
    waterRate: number[],
    fishRate: number[],
    honeyRate: number[],
    rockRate: number[],
    hiddenRate: number[],
    rodGrade: number[],
}

export interface CompactLocation {
    id: number,
    land: CompactEncounter[] | undefined,
    landR: number | undefined,
    water: CompactEncounter[] | undefined,
    waterR: number | undefined,
    fish: CompactEncounter[] | undefined,
    fishR: number | undefined,
    honey: CompactEncounter[] | undefined,
    honeyR: number | undefined,
    rock: CompactEncounter[] | undefined,
    rockR: number | undefined,
    hidden: CompactEncounter[] | undefined,
    hiddenR: number | undefined,
}

export type CompactEncounter = [
    number, //min
    number, //max
    number, //specie ID
]

export interface CompactEvolution {
    kd: number,
    rs: string,
    in: number,
}

export interface CompactLevelUpMove {
    lv: number,
    id: number,
}

export interface CompactBaseStats {
    base: number[]
    types: number[],
    catchR: number,
    exp: number,
    EVY: number[],
    items: string[] | undefined,
    gender: number,
    eggC: number,
    fren: number,
    grow: number,
    eggG: number[],
    abis: number[],
    inns: number[],
    col: number,
    noFlip: boolean,
    flags: string,
}

export interface compactMove {
    name: string,
    NAME: string, // i could compactify this even more by string | undefined where undefined mean you can reconstruct the NAME by the name
    sName: string,
    eff: number,
    pwr: number,
    types: number[],
    acc: number,
    pp: number,
    chance: number,
    target: number,
    prio: number,
    flags: number[],
    split: number,
    arg: string,
    desc: string,
    lDesc: string,
    id: number,
}

export interface CompactPokePokedex {
    id: number,
    desc: string,
    hw: [number, number]
}

export interface CompactSpecie {
    NAME: string,
    name: string,
    stats: CompactBaseStats,
    evolutions: CompactEvolution[],
    eggMoves: number[],
    levelUpMoves: CompactLevelUpMove[],
    TMHMMoves: number[],
    tutor: number[],
    forms: number[],
    SEnc: CompactedScripted[], // scripted encounters
    dex: CompactPokePokedex,
    id: number,
}

export interface CompactTrainers {
    name: string,
    tclass: number
    db: boolean,
    party: CompactTrainerPokemon[],
    insane: CompactTrainerPokemon[],
    rem: CompactTrainerRematch[],
    map: number,
}

export interface CompactTrainerPokemon {
    spc: number,
    abi: number,
    ivs: number[],
    evs: number[],
    item: number,
    nature: number,
    moves: number[]
}

export interface CompactTrainerRematch {
    db: boolean,
    party: CompactTrainerPokemon[]
}

export interface CompactBattleItems {
    name: string,
    NAME: string,
    id: number,
    //could add it? desc: string,
}

export interface CompactAbility {
    name: string,
    desc: string,
    id: number
}

export interface CompactGameData {
    abilities: CompactAbility[],
    moves: compactMove[],
    species: CompactSpecie[],
    locations: CompactLocations,
    trainers: CompactTrainers[],
    items: CompactBattleItems[],
    typeT: string[], //types tabes
    targetT: string[], //targets table
    flagsT: string[],
    effT: string[], // effect table
    splitT: string[],
    eggT: string[], // egg group table
    growT: string[]; // Growth Table
    colT: string[], //color table
    evoKindT: string[],
    natureT: string[],
    scriptedEncoutersHowT: string[],
    mapsT: string[],
    MAPST: string[],
    tclassT: string[],
    creationDate: number,
}
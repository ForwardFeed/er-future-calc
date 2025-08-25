
export type index = number

export type Specie = {
    name: string
    name_id: string,
    types: index[]
}

export type Move = {
    name: string
    types: index

}

export type BattleItem = {
    name: string
}

export type Ability = {
    name: string
}

export type GameData = {
    species: Specie[]
    moves: Move[]
    battle_items: BattleItem[]
    abilities: Ability[]


    indexes: {
        types: string[]
    }
}
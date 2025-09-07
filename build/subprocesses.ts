
const BUILD_CALC_COMMAND = "bun run build-calc".split(' ')

export async function compile_calculator(){
    const proc = Bun.spawn(BUILD_CALC_COMMAND)
    return proc
}
#/usr/bin/env bash


ARGS="build-calc run-ui full-setup data-create build-run"

# I like autocomplete, so if you source this script, it will add some nice autocomplete
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    complete -W "$ARGS" "${BASH_SOURCE[0]}"
    echo "setuped the autocomplete"
else


function showArgs(){
    # I like colors!
    NC="\033[0m"
    COLORS=("\033[0;31m" "\033[0;32m" "\033[0;33m" "\033[0;34m" "\033[0;35m" "\033[0;36m" "\033[0;37m")
    COLORS_MAX="${#COLORS[@]}"
    # split string into array
    read -r -a ARGS_ARRAY <<< "$ARGS"
    MAX="${#ARGS_ARRAY[@]}"
    for(( i=0; i<MAX; i++ )); {
        COLOR_I=$(($i % $COLORS_MAX))
        echo -ne "${COLORS[$COLOR_I]}${ARGS_ARRAY[$i]}${NC}"
        
        # just some formating
        [ $i -eq $((MAX - 1)) ] && echo "" || echo -ne ", "
    }
}

[[ -z "$1" ]] && echo "missing argument, here's the list: " && showArgs && exit 1

function build_calc(){
    (cd calc/ && wasm-pack build --dev --target web --features v2_5 ) ||
    echo "error packing the wasm from the calc"
}

function run_ui(){
    (cd ui/ && bun dev) ||
    echo "error trying to run the ui"
}

case "$1" in

    build-calc)
        build_calc
    ;;
    run-ui)
       run_ui
    ;;
    full-setup)
        echo "installing ui stuff" &&
        (cd ui/ && bun install) &&
        echo "installing calc stuff" && 
        (cd calc/ && cargo build) && 
        echo "it should be good now" ||
        echo "something went wrong in the setup"
    ;;
    data-create)
        (cd data_creation/from_nextdex/ && bun run ./index.ts) ||
        echo "something went wrong when creating the data"
    ;;
    build-run)
        # -O1 is low optimization
        build_calc --dev &&
        run_ui || 
        echo "something in build-run failed"
    ;;
    *)
    echo "unknown argument $1, here's the list" 
    showArgs
    exit 2

esac
fi

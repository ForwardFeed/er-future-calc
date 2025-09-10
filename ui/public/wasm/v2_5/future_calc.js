let wasm;

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error(`expected a string argument, found ${typeof(arg)}`);

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
 * @param {string} name
 */
export function greet(name) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.greet(ptr0, len0);
}

/**
 * @param {any} js_attacker
 * @param {any} js_defender
 * @param {any} js_field
 */
export function calc(js_attacker, js_defender, js_field) {
    wasm.calc(js_attacker, js_defender, js_field);
}

/**
 * @enum {0 | 1}
 */
export const GameType = Object.freeze({
    Single: 0, "0": "Single",
    Double: 1, "1": "Double",
});
/**
 * @enum {0 | 1 | 2}
 */
export const MoveCategory = Object.freeze({
    Physical: 0, "0": "Physical",
    Special: 1, "1": "Special",
    Status: 2, "2": "Status",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14}
 */
export const MoveTarget = Object.freeze({
    AdjacentAlly: 0, "0": "AdjacentAlly",
    AdjacentAllyOrSelf: 1, "1": "AdjacentAllyOrSelf",
    AdjacentFoe: 2, "2": "AdjacentFoe",
    All: 3, "3": "All",
    AllAdjacent: 4, "4": "AllAdjacent",
    AllAdjacentFoes: 5, "5": "AllAdjacentFoes",
    Allies: 6, "6": "Allies",
    AllySide: 7, "7": "AllySide",
    AllyTeam: 8, "8": "AllyTeam",
    Any: 9, "9": "Any",
    FoeSide: 10, "10": "FoeSide",
    Normal: 11, "11": "Normal",
    RandomNormal: 12, "12": "RandomNormal",
    Scripted: 13, "13": "Scripted",
    SSelf: 14, "14": "SSelf",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24}
 */
export const Nature = Object.freeze({
    Adamant: 0, "0": "Adamant",
    Bashful: 1, "1": "Bashful",
    Bold: 2, "2": "Bold",
    Brave: 3, "3": "Brave",
    Calm: 4, "4": "Calm",
    Careful: 5, "5": "Careful",
    Docile: 6, "6": "Docile",
    Gentle: 7, "7": "Gentle",
    Hardy: 8, "8": "Hardy",
    Hasty: 9, "9": "Hasty",
    Impish: 10, "10": "Impish",
    Jolly: 11, "11": "Jolly",
    Lax: 12, "12": "Lax",
    Lonely: 13, "13": "Lonely",
    Mild: 14, "14": "Mild",
    Modest: 15, "15": "Modest",
    Naive: 16, "16": "Naive",
    Naughty: 17, "17": "Naughty",
    Quiet: 18, "18": "Quiet",
    Quirky: 19, "19": "Quirky",
    Rash: 20, "20": "Rash",
    Relaxed: 21, "21": "Relaxed",
    Sassy: 22, "22": "Sassy",
    Serious: 23, "23": "Serious",
    Timid: 24, "24": "Timid",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const PokemonStatus = Object.freeze({
    Sleep: 0, "0": "Sleep",
    Poison: 1, "1": "Poison",
    Burn: 2, "2": "Burn",
    Freeze: 3, "3": "Freeze",
    Paralyz: 4, "4": "Paralyz",
    Toxic: 5, "5": "Toxic",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18}
 */
export const PokemonType = Object.freeze({
    Normal: 0, "0": "Normal",
    Fighting: 1, "1": "Fighting",
    Flying: 2, "2": "Flying",
    Poison: 3, "3": "Poison",
    Ground: 4, "4": "Ground",
    Rock: 5, "5": "Rock",
    Bug: 6, "6": "Bug",
    Ghost: 7, "7": "Ghost",
    Steel: 8, "8": "Steel",
    Fire: 9, "9": "Fire",
    Water: 10, "10": "Water",
    Grass: 11, "11": "Grass",
    Electric: 12, "12": "Electric",
    Psychic: 13, "13": "Psychic",
    Ice: 14, "14": "Ice",
    Dragon: 15, "15": "Dragon",
    Dark: 16, "16": "Dark",
    Fairy: 17, "17": "Fairy",
    Unknown: 18, "18": "Unknown",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255 | 256 | 257 | 258 | 259 | 260 | 261 | 262 | 263 | 264 | 265 | 266 | 267 | 268 | 269 | 270 | 271 | 272 | 273 | 274 | 275 | 276 | 277 | 278 | 279 | 280 | 281 | 282 | 283 | 284 | 285 | 286 | 287 | 288 | 289 | 290 | 291 | 292 | 293 | 294 | 295 | 296 | 297 | 298 | 299 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 309 | 310 | 311 | 312 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 326 | 327 | 328 | 329 | 330 | 331 | 332 | 333 | 334 | 335 | 336 | 337 | 338 | 339 | 340 | 341 | 342 | 343 | 344 | 345 | 346 | 347 | 348 | 349 | 350 | 351 | 352 | 353 | 354 | 355 | 356 | 357 | 358 | 359 | 360 | 361 | 362 | 363 | 364 | 365 | 366 | 367 | 368 | 369 | 370 | 371 | 372 | 373 | 374 | 375 | 376 | 377 | 378 | 379 | 380 | 381 | 382 | 383 | 384 | 385 | 386 | 387 | 388 | 389 | 390 | 391 | 392 | 393 | 394 | 395 | 396 | 397 | 398 | 399 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 427 | 428 | 429 | 430 | 431 | 432 | 433 | 434 | 435 | 436 | 437 | 438 | 439 | 440 | 441 | 442 | 443 | 444 | 445 | 446 | 447 | 448 | 449 | 450 | 451 | 452 | 453 | 454 | 455 | 456 | 457 | 458 | 459 | 460 | 461 | 462 | 463 | 464 | 465 | 466 | 467 | 468 | 469 | 470 | 471 | 472 | 473 | 474 | 475 | 476 | 477 | 478 | 479 | 480 | 481 | 482 | 483 | 484 | 485 | 486 | 487 | 488 | 489 | 490 | 491 | 492 | 493 | 494 | 495 | 496 | 497 | 498 | 499 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 509 | 510 | 511 | 512 | 513 | 514 | 515 | 516 | 517 | 518 | 519 | 520 | 521 | 522 | 523 | 524 | 525 | 526 | 527 | 528 | 529 | 530 | 531 | 532 | 533 | 534 | 535 | 536 | 537 | 538 | 539 | 540 | 541 | 542 | 543 | 544 | 545 | 546 | 547 | 548 | 549 | 550 | 551 | 552 | 553 | 554 | 555 | 556 | 557 | 558 | 559 | 560 | 561 | 562 | 563 | 564 | 565 | 566 | 567 | 568 | 569 | 570 | 571 | 572 | 573 | 574 | 575 | 576 | 577 | 578 | 579 | 580 | 581 | 582 | 583 | 584 | 585 | 586 | 587 | 588 | 589 | 590 | 591 | 592 | 593 | 594 | 595 | 596 | 597 | 598 | 599 | 600 | 601 | 602 | 603 | 604 | 605 | 606 | 607 | 608 | 609 | 610 | 611 | 612 | 613 | 614 | 615 | 616 | 617 | 618 | 619 | 620 | 621 | 622 | 623 | 624 | 625 | 626 | 627 | 628 | 629 | 630 | 631 | 632 | 633 | 634 | 635 | 636 | 637 | 638 | 639 | 640 | 641 | 642 | 643 | 644 | 645 | 646 | 647 | 648 | 649 | 650 | 651 | 652 | 653 | 654 | 655 | 656 | 657 | 658 | 659 | 660 | 661 | 662 | 663 | 664 | 665 | 666 | 667 | 668 | 669 | 670 | 671 | 672 | 673 | 674 | 675 | 676 | 677 | 678 | 679 | 680 | 681 | 682 | 683 | 684 | 685 | 686 | 687 | 688 | 689 | 690 | 691 | 692 | 693 | 694 | 695 | 696 | 697 | 698 | 699 | 700 | 701 | 702 | 703 | 704 | 705 | 706 | 707 | 708 | 709 | 710 | 711 | 712 | 713 | 714 | 715 | 716 | 717 | 718 | 719 | 720 | 721 | 722 | 723 | 724 | 725 | 726 | 727 | 728 | 729 | 730 | 731 | 732 | 733 | 734 | 735 | 736 | 737 | 738 | 739 | 740 | 741 | 742 | 743 | 744 | 745 | 746 | 747 | 748 | 749 | 750 | 751 | 752 | 753 | 754 | 755 | 756 | 757 | 758 | 759 | 760 | 761 | 762 | 763 | 764 | 765 | 766 | 767 | 768 | 769 | 770 | 771 | 772 | 773 | 774 | 775 | 776 | 777 | 778 | 779 | 780 | 781 | 782 | 783 | 784 | 785 | 786 | 787 | 788 | 789 | 790 | 791 | 792 | 793 | 794 | 795 | 796 | 797 | 798 | 799 | 800 | 801 | 802 | 803 | 804 | 805 | 806 | 807 | 808 | 809 | 810 | 811 | 812 | 813 | 814 | 815 | 816 | 817 | 818 | 819 | 820 | 821 | 822 | 823 | 824 | 825 | 826 | 827 | 828 | 829 | 830 | 831 | 832 | 833 | 834 | 835 | 836 | 837 | 838 | 839 | 840 | 841 | 842 | 843 | 844 | 845 | 846 | 847 | 848 | 849 | 850 | 851 | 852 | 853 | 854 | 855 | 856 | 857 | 858 | 859 | 860 | 861 | 862 | 863 | 864 | 865 | 866 | 867 | 868 | 869 | 870 | 871 | 872 | 873 | 874 | 875 | 876 | 877 | 878 | 879 | 880 | 881 | 882 | 883 | 884 | 885 | 886 | 887 | 888 | 889 | 890 | 891 | 892 | 893 | 894 | 895 | 896 | 897 | 898 | 899 | 900 | 901 | 902 | 903 | 904 | 905 | 906 | 907 | 908 | 909 | 910 | 911 | 912 | 913 | 914 | 915 | 916 | 917 | 918 | 919 | 920 | 921 | 922 | 923 | 924 | 925 | 926 | 927 | 928 | 929 | 930 | 931 | 932 | 933 | 934 | 935 | 936 | 937 | 938 | 939 | 940 | 941 | 942 | 943 | 944 | 945 | 946 | 947 | 948 | 949 | 950 | 951 | 952 | 953 | 954 | 955 | 956 | 957 | 958 | 959 | 960 | 961 | 962 | 963 | 964 | 965 | 966 | 967 | 968 | 969 | 970 | 971 | 972 | 973 | 974 | 975 | 976 | 977 | 978 | 979 | 980 | 981 | 982 | 983 | 984 | 985 | 986 | 987 | 988 | 989 | 990 | 991 | 992 | 993 | 994 | 995 | 996 | 997 | 998 | 999 | 1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008 | 1009 | 1010 | 1011 | 1012 | 1013 | 1014 | 1015 | 1016 | 1017 | 1018 | 1019 | 1020 | 1021 | 1022 | 1023 | 1024 | 1025 | 1026 | 1027 | 1028 | 1029 | 1030 | 1031 | 1032 | 1033 | 1034 | 1035 | 1036 | 1037 | 1038 | 1039 | 1040 | 1041 | 1042 | 1043 | 1044 | 1045 | 1046 | 1047 | 1048 | 1049 | 1050 | 1051 | 1052 | 1053 | 1054 | 1055 | 1056 | 1057 | 1058 | 1059 | 1060 | 1061 | 1062 | 1063 | 1064 | 1065 | 1066 | 1067 | 1068 | 1069 | 1070 | 1071 | 1072 | 1073 | 1074 | 1075 | 1076 | 1077 | 1078 | 1079 | 1080 | 1081 | 1082 | 1083 | 1084 | 1085 | 1086 | 1087 | 1088 | 1089 | 1090 | 1091 | 1092 | 1093 | 1094 | 1095 | 1096 | 1097 | 1098 | 1099 | 1100 | 1101 | 1102 | 1103 | 1104 | 1105 | 1106 | 1107 | 1108 | 1109 | 1110 | 1111 | 1112 | 1113 | 1114 | 1115 | 1116 | 1117 | 1118 | 1119 | 1120 | 1121 | 1122 | 1123 | 1124 | 1125 | 1126 | 1127 | 1128 | 1129 | 1130 | 1131 | 1132 | 1133 | 1134 | 1135 | 1136 | 1137 | 1138 | 1139 | 1140 | 1141 | 1142 | 1143 | 1144 | 1145 | 1146 | 1147 | 1148 | 1149 | 1150 | 1151 | 1152 | 1153 | 1154 | 1155 | 1156 | 1157 | 1158 | 1159 | 1160 | 1161 | 1162 | 1163 | 1164 | 1165 | 1166 | 1167 | 1168 | 1169 | 1170 | 1171 | 1172 | 1173 | 1174 | 1175 | 1176 | 1177 | 1178 | 1179 | 1180 | 1181 | 1182 | 1183 | 1184 | 1185 | 1186 | 1187 | 1188 | 1189 | 1190 | 1191 | 1192 | 1193 | 1194 | 1195 | 1196 | 1197 | 1198 | 1199 | 1200 | 1201 | 1202 | 1203 | 1204 | 1205 | 1206 | 1207 | 1208 | 1209 | 1210 | 1211 | 1212 | 1213 | 1214 | 1215 | 1216 | 1217 | 1218 | 1219 | 1220 | 1221 | 1222 | 1223 | 1224 | 1225 | 1226 | 1227 | 1228 | 1229 | 1230 | 1231 | 1232 | 1233 | 1234 | 1235 | 1236 | 1237 | 1238 | 1239 | 1240 | 1241 | 1242 | 1243 | 1244 | 1245 | 1246 | 1247 | 1248 | 1249 | 1250 | 1251 | 1252 | 1253 | 1254 | 1255 | 1256 | 1257 | 1258 | 1259 | 1260 | 1261 | 1262 | 1263 | 1264 | 1265 | 1266 | 1267 | 1268 | 1269 | 1270 | 1271 | 1272 | 1273 | 1274 | 1275 | 1276 | 1277 | 1278 | 1279 | 1280 | 1281 | 1282 | 1283 | 1284 | 1285 | 1286 | 1287 | 1288 | 1289 | 1290 | 1291 | 1292 | 1293 | 1294 | 1295 | 1296 | 1297 | 1298 | 1299 | 1300 | 1301 | 1302 | 1303 | 1304 | 1305 | 1306 | 1307 | 1308 | 1309 | 1310 | 1311 | 1312 | 1313 | 1314 | 1315 | 1316 | 1317 | 1318 | 1319 | 1320 | 1321 | 1322 | 1323 | 1324 | 1325 | 1326 | 1327 | 1328 | 1329 | 1330 | 1331 | 1332 | 1333 | 1334 | 1335 | 1336 | 1337 | 1338 | 1339 | 1340 | 1341 | 1342 | 1343 | 1344 | 1345 | 1346 | 1347 | 1348 | 1349 | 1350 | 1351 | 1352 | 1353 | 1354 | 1355 | 1356 | 1357 | 1358 | 1359 | 1360 | 1361 | 1362 | 1363 | 1364 | 1365 | 1366 | 1367 | 1368 | 1369 | 1370 | 1371 | 1372 | 1373 | 1374 | 1375 | 1376 | 1377 | 1378 | 1379 | 1380 | 1381 | 1382 | 1383 | 1384 | 1385 | 1386 | 1387 | 1388 | 1389 | 1390 | 1391 | 1392 | 1393 | 1394 | 1395 | 1396 | 1397 | 1398 | 1399 | 1400 | 1401 | 1402 | 1403 | 1404 | 1405 | 1406 | 1407 | 1408 | 1409 | 1410 | 1411 | 1412 | 1413 | 1414 | 1415 | 1416 | 1417 | 1418 | 1419 | 1420 | 1421 | 1422 | 1423 | 1424 | 1425 | 1426 | 1427 | 1428 | 1429 | 1430 | 1431 | 1432 | 1433 | 1434 | 1435 | 1436 | 1437 | 1438 | 1439 | 1440 | 1441 | 1442 | 1443 | 1444 | 1445 | 1446 | 1447 | 1448 | 1449 | 1450 | 1451 | 1452 | 1453 | 1454 | 1455 | 1456 | 1457 | 1458 | 1459 | 1460 | 1461 | 1462 | 1463 | 1464 | 1465 | 1466 | 1467 | 1468 | 1469 | 1470 | 1471 | 1472 | 1473 | 1474 | 1475 | 1476 | 1477 | 1478 | 1479 | 1480 | 1481 | 1482 | 1483 | 1484 | 1485 | 1486 | 1487 | 1488 | 1489 | 1490 | 1491 | 1492 | 1493 | 1494 | 1495 | 1496 | 1497 | 1498 | 1499 | 1500 | 1501 | 1502 | 1503 | 1504 | 1505 | 1506 | 1507 | 1508 | 1509 | 1510 | 1511 | 1512 | 1513 | 1514 | 1515 | 1516 | 1517 | 1518 | 1519 | 1520 | 1521 | 1522 | 1523 | 1524 | 1525 | 1526 | 1527 | 1528 | 1529 | 1530 | 1531 | 1532 | 1533 | 1534 | 1535 | 1536 | 1537 | 1538 | 1539 | 1540 | 1541 | 1542 | 1543 | 1544 | 1545 | 1546 | 1547 | 1548 | 1549 | 1550 | 1551 | 1552 | 1553 | 1554 | 1555 | 1556 | 1557 | 1558 | 1559 | 1560 | 1561 | 1562 | 1563 | 1564 | 1565 | 1566 | 1567 | 1568 | 1569 | 1570 | 1571 | 1572 | 1573 | 1574 | 1575 | 1576 | 1577 | 1578 | 1579 | 1580 | 1581 | 1582 | 1583 | 1584 | 1585 | 1586 | 1587 | 1588 | 1589 | 1590 | 1591 | 1592 | 1593 | 1594 | 1595 | 1596 | 1597 | 1598 | 1599 | 1600 | 1601 | 1602 | 1603 | 1604 | 1605 | 1606 | 1607 | 1608 | 1609 | 1610 | 1611 | 1612 | 1613 | 1614 | 1615 | 1616 | 1617 | 1618 | 1619 | 1620 | 1621 | 1622 | 1623 | 1624 | 1625 | 1626 | 1627 | 1628 | 1629 | 1630 | 1631 | 1632 | 1633 | 1634 | 1635 | 1636 | 1637 | 1638 | 1639 | 1640 | 1641 | 1642 | 1643 | 1644 | 1645 | 1646 | 1647 | 1648 | 1649 | 1650 | 1651 | 1652 | 1653 | 1654 | 1655 | 1656 | 1657 | 1658 | 1659 | 1660 | 1661 | 1662 | 1663 | 1664 | 1665 | 1666 | 1667 | 1668 | 1669 | 1670 | 1671 | 1672 | 1673 | 1674 | 1675 | 1676 | 1677 | 1678 | 1679 | 1680 | 1681 | 1682 | 1683 | 1684 | 1685 | 1686 | 1687 | 1688 | 1689 | 1690 | 1691 | 1692 | 1693 | 1694 | 1695 | 1696 | 1697 | 1698 | 1699 | 1700 | 1701 | 1702 | 1703 | 1704 | 1705 | 1706 | 1707 | 1708 | 1709 | 1710 | 1711 | 1712 | 1713 | 1714 | 1715}
 */
export const Species = Object.freeze({
    None: 0, "0": "None",
    Bulbasaur: 1, "1": "Bulbasaur",
    Ivysaur: 2, "2": "Ivysaur",
    Venusaur: 3, "3": "Venusaur",
    VenusaurMega: 4, "4": "VenusaurMega",
    VenusaurMegaX: 5, "5": "VenusaurMegaX",
    Charmander: 6, "6": "Charmander",
    Charmeleon: 7, "7": "Charmeleon",
    Charizard: 8, "8": "Charizard",
    CharizardMegaX: 9, "9": "CharizardMegaX",
    CharizardMegaY: 10, "10": "CharizardMegaY",
    CharizardMegaZ: 11, "11": "CharizardMegaZ",
    Squirtle: 12, "12": "Squirtle",
    Wartortle: 13, "13": "Wartortle",
    Blastoise: 14, "14": "Blastoise",
    BlastoiseMega: 15, "15": "BlastoiseMega",
    BlastoiseMegaX: 16, "16": "BlastoiseMegaX",
    Caterpie: 17, "17": "Caterpie",
    Metapod: 18, "18": "Metapod",
    Butterfree: 19, "19": "Butterfree",
    ButterfreeMega: 20, "20": "ButterfreeMega",
    Weedle: 21, "21": "Weedle",
    Kakuna: 22, "22": "Kakuna",
    Beedrill: 23, "23": "Beedrill",
    BeedrillMega: 24, "24": "BeedrillMega",
    WeedleRedux: 25, "25": "WeedleRedux",
    KakunaRedux: 26, "26": "KakunaRedux",
    BeedrillRedux: 27, "27": "BeedrillRedux",
    BeedrillMegaRedux: 28, "28": "BeedrillMegaRedux",
    Pidgey: 29, "29": "Pidgey",
    Pidgeotto: 30, "30": "Pidgeotto",
    Pidgeot: 31, "31": "Pidgeot",
    PidgeotMega: 32, "32": "PidgeotMega",
    Rattata: 33, "33": "Rattata",
    Raticate: 34, "34": "Raticate",
    RattataAlolan: 35, "35": "RattataAlolan",
    RaticateAlolan: 36, "36": "RaticateAlolan",
    Spearow: 37, "37": "Spearow",
    Fearow: 38, "38": "Fearow",
    Ekans: 39, "39": "Ekans",
    Arbok: 40, "40": "Arbok",
    ArbokMega: 41, "41": "ArbokMega",
    Sandshrew: 42, "42": "Sandshrew",
    Sandslash: 43, "43": "Sandslash",
    SandslashMega: 44, "44": "SandslashMega",
    SandshrewAlolan: 45, "45": "SandshrewAlolan",
    SandslashAlolan: 46, "46": "SandslashAlolan",
    NidoranF: 47, "47": "NidoranF",
    Nidorina: 48, "48": "Nidorina",
    Nidoqueen: 49, "49": "Nidoqueen",
    NidoqueenMega: 50, "50": "NidoqueenMega",
    NidoranM: 51, "51": "NidoranM",
    Nidorino: 52, "52": "Nidorino",
    Nidoking: 53, "53": "Nidoking",
    NidokingMega: 54, "54": "NidokingMega",
    Vulpix: 55, "55": "Vulpix",
    Ninetales: 56, "56": "Ninetales",
    VulpixAlolan: 57, "57": "VulpixAlolan",
    NinetalesAlolan: 58, "58": "NinetalesAlolan",
    Jigglypuff: 59, "59": "Jigglypuff",
    Wigglytuff: 60, "60": "Wigglytuff",
    WigglytuffMega: 61, "61": "WigglytuffMega",
    WigglytuffMegaX: 62, "62": "WigglytuffMegaX",
    WigglytuffApex: 63, "63": "WigglytuffApex",
    WigglytuffPrimal: 64, "64": "WigglytuffPrimal",
    Zubat: 65, "65": "Zubat",
    Golbat: 66, "66": "Golbat",
    Crobat: 67, "67": "Crobat",
    CrobatMega: 68, "68": "CrobatMega",
    Oddish: 69, "69": "Oddish",
    Gloom: 70, "70": "Gloom",
    Vileplume: 71, "71": "Vileplume",
    Paras: 72, "72": "Paras",
    Parasect: 73, "73": "Parasect",
    Venonat: 74, "74": "Venonat",
    Venomoth: 75, "75": "Venomoth",
    Diglett: 76, "76": "Diglett",
    Dugtrio: 77, "77": "Dugtrio",
    DiglettAlolan: 78, "78": "DiglettAlolan",
    DugtrioAlolan: 79, "79": "DugtrioAlolan",
    Meowth: 80, "80": "Meowth",
    Persian: 81, "81": "Persian",
    MeowthAlolan: 82, "82": "MeowthAlolan",
    PersianAlolan: 83, "83": "PersianAlolan",
    MeowthGalarian: 84, "84": "MeowthGalarian",
    MeowthPartner: 85, "85": "MeowthPartner",
    MeowthPartnerMega: 86, "86": "MeowthPartnerMega",
    Psyduck: 87, "87": "Psyduck",
    PsyduckRedux: 88, "88": "PsyduckRedux",
    Golduck: 89, "89": "Golduck",
    Mankey: 90, "90": "Mankey",
    Primeape: 91, "91": "Primeape",
    Growlithe: 92, "92": "Growlithe",
    Arcanine: 93, "93": "Arcanine",
    GrowlitheRedux: 94, "94": "GrowlitheRedux",
    ArcanineRedux: 95, "95": "ArcanineRedux",
    ArcanineMegaRedux: 96, "96": "ArcanineMegaRedux",
    GrowlitheHisuian: 97, "97": "GrowlitheHisuian",
    ArcanineHisuian: 98, "98": "ArcanineHisuian",
    Poliwag: 99, "99": "Poliwag",
    Poliwhirl: 100, "100": "Poliwhirl",
    Poliwrath: 101, "101": "Poliwrath",
    Abra: 102, "102": "Abra",
    Kadabra: 103, "103": "Kadabra",
    Alakazam: 104, "104": "Alakazam",
    AlakazamMega: 105, "105": "AlakazamMega",
    AbraRedux: 106, "106": "AbraRedux",
    KadabraRedux: 107, "107": "KadabraRedux",
    AlakazamRedux: 108, "108": "AlakazamRedux",
    AlakazamMegaRedux: 109, "109": "AlakazamMegaRedux",
    Machop: 110, "110": "Machop",
    Machoke: 111, "111": "Machoke",
    Machamp: 112, "112": "Machamp",
    MachampMega: 113, "113": "MachampMega",
    MachopRedux: 114, "114": "MachopRedux",
    MachokeRedux: 115, "115": "MachokeRedux",
    MachampRedux: 116, "116": "MachampRedux",
    MachampMegaRedux: 117, "117": "MachampMegaRedux",
    Bellsprout: 118, "118": "Bellsprout",
    Weepinbell: 119, "119": "Weepinbell",
    Victreebel: 120, "120": "Victreebel",
    Tentacool: 121, "121": "Tentacool",
    Tentacruel: 122, "122": "Tentacruel",
    Geodude: 123, "123": "Geodude",
    Graveler: 124, "124": "Graveler",
    Golem: 125, "125": "Golem",
    GeodudeAlolan: 126, "126": "GeodudeAlolan",
    GravelerAlolan: 127, "127": "GravelerAlolan",
    GolemAlolan: 128, "128": "GolemAlolan",
    Ponyta: 129, "129": "Ponyta",
    Rapidash: 130, "130": "Rapidash",
    RapidashMega: 131, "131": "RapidashMega",
    PonytaGalarian: 132, "132": "PonytaGalarian",
    RapidashGalarian: 133, "133": "RapidashGalarian",
    RapidashMegaGalarian: 134, "134": "RapidashMegaGalarian",
    Slowpoke: 135, "135": "Slowpoke",
    Slowbro: 136, "136": "Slowbro",
    Slowking: 137, "137": "Slowking",
    SlowbroMega: 138, "138": "SlowbroMega",
    SlowkingMega: 139, "139": "SlowkingMega",
    SlowpokeGalarian: 140, "140": "SlowpokeGalarian",
    SlowkingGalarian: 141, "141": "SlowkingGalarian",
    SlowbroGalarian: 142, "142": "SlowbroGalarian",
    Magnemite: 143, "143": "Magnemite",
    Magneton: 144, "144": "Magneton",
    Magnezone: 145, "145": "Magnezone",
    MagnezoneMega: 146, "146": "MagnezoneMega",
    Farfetchd: 147, "147": "Farfetchd",
    FarfetchdGalarian: 148, "148": "FarfetchdGalarian",
    Doduo: 149, "149": "Doduo",
    Dodrio: 150, "150": "Dodrio",
    DoduoRedux: 151, "151": "DoduoRedux",
    DodrioRedux: 152, "152": "DodrioRedux",
    Seel: 153, "153": "Seel",
    Dewgong: 154, "154": "Dewgong",
    DewgongMega: 155, "155": "DewgongMega",
    Kecleong: 156, "156": "Kecleong",
    SeelRedux: 157, "157": "SeelRedux",
    DewgongRedux: 158, "158": "DewgongRedux",
    Grimer: 159, "159": "Grimer",
    Muk: 160, "160": "Muk",
    GrimerAlolan: 161, "161": "GrimerAlolan",
    MukAlolan: 162, "162": "MukAlolan",
    Shellder: 163, "163": "Shellder",
    Cloyster: 164, "164": "Cloyster",
    Gastly: 165, "165": "Gastly",
    Haunter: 166, "166": "Haunter",
    Gengar: 167, "167": "Gengar",
    GengarMega: 168, "168": "GengarMega",
    GengarMegaX: 169, "169": "GengarMegaX",
    Onix: 170, "170": "Onix",
    Steelix: 171, "171": "Steelix",
    SteelixMega: 172, "172": "SteelixMega",
    Drowzee: 173, "173": "Drowzee",
    Hypno: 174, "174": "Hypno",
    Krabby: 175, "175": "Krabby",
    Kingler: 176, "176": "Kingler",
    KinglerMega: 177, "177": "KinglerMega",
    Voltorb: 178, "178": "Voltorb",
    Electrode: 179, "179": "Electrode",
    VoltorbHisuian: 180, "180": "VoltorbHisuian",
    ElectrodeHisuian: 181, "181": "ElectrodeHisuian",
    Exeggcute: 182, "182": "Exeggcute",
    Exeggutor: 183, "183": "Exeggutor",
    ExeggutorAlolan: 184, "184": "ExeggutorAlolan",
    Cubone: 185, "185": "Cubone",
    Marowak: 186, "186": "Marowak",
    MarowakAlolan: 187, "187": "MarowakAlolan",
    Lickitung: 188, "188": "Lickitung",
    Koffing: 189, "189": "Koffing",
    Weezing: 190, "190": "Weezing",
    WeezingGalarian: 191, "191": "WeezingGalarian",
    Rhyhorn: 192, "192": "Rhyhorn",
    Rhydon: 193, "193": "Rhydon",
    Tangela: 194, "194": "Tangela",
    Kangaskhan: 195, "195": "Kangaskhan",
    KangaskhanMega: 196, "196": "KangaskhanMega",
    Horsea: 197, "197": "Horsea",
    Seadra: 198, "198": "Seadra",
    Kingdra: 199, "199": "Kingdra",
    KingdraMega: 200, "200": "KingdraMega",
    KingdraMegaY: 201, "201": "KingdraMegaY",
    Goldeen: 202, "202": "Goldeen",
    Seaking: 203, "203": "Seaking",
    Staryu: 204, "204": "Staryu",
    Starmie: 205, "205": "Starmie",
    Scyther: 206, "206": "Scyther",
    Jynx: 207, "207": "Jynx",
    Electabuzz: 208, "208": "Electabuzz",
    Magmar: 209, "209": "Magmar",
    Pinsir: 210, "210": "Pinsir",
    PinsirMega: 211, "211": "PinsirMega",
    Tauros: 212, "212": "Tauros",
    TaurosPaldeanCombatBreed: 213, "213": "TaurosPaldeanCombatBreed",
    TaurosPaldeanBlazeBreed: 214, "214": "TaurosPaldeanBlazeBreed",
    TaurosPaldeanAquaBreed: 215, "215": "TaurosPaldeanAquaBreed",
    Magikarp: 216, "216": "Magikarp",
    Gyarados: 217, "217": "Gyarados",
    Gyaradeath: 218, "218": "Gyaradeath",
    GyaradosMega: 219, "219": "GyaradosMega",
    GyaradeathMegaX: 220, "220": "GyaradeathMegaX",
    GyaradosMegaY: 221, "221": "GyaradosMegaY",
    GyaradeathMegaY: 222, "222": "GyaradeathMegaY",
    Lapras: 223, "223": "Lapras",
    LaprasMega: 224, "224": "LaprasMega",
    LaprasMegaX: 225, "225": "LaprasMegaX",
    Ditto: 226, "226": "Ditto",
    Eevee: 227, "227": "Eevee",
    Espeon: 228, "228": "Espeon",
    EspeonGalaxy: 229, "229": "EspeonGalaxy",
    EeveePartner: 230, "230": "EeveePartner",
    EeveePartnerMega: 231, "231": "EeveePartnerMega",
    Vaporeon: 232, "232": "Vaporeon",
    Jolteon: 233, "233": "Jolteon",
    Flareon: 234, "234": "Flareon",
    Porygon: 235, "235": "Porygon",
    Omanyte: 236, "236": "Omanyte",
    Omastar: 237, "237": "Omastar",
    Kabuto: 238, "238": "Kabuto",
    Kabutops: 239, "239": "Kabutops",
    Aerodactyl: 240, "240": "Aerodactyl",
    AerodactylMega: 241, "241": "AerodactylMega",
    Articuno: 242, "242": "Articuno",
    ArticunoGalarian: 243, "243": "ArticunoGalarian",
    Zapdos: 244, "244": "Zapdos",
    ZapdosGalarian: 245, "245": "ZapdosGalarian",
    Moltres: 246, "246": "Moltres",
    MoltresGalarian: 247, "247": "MoltresGalarian",
    Dratini: 248, "248": "Dratini",
    Dragonair: 249, "249": "Dragonair",
    Dragonite: 250, "250": "Dragonite",
    DragoniteMega: 251, "251": "DragoniteMega",
    DragoniteDelivery: 252, "252": "DragoniteDelivery",
    Mewtwo: 253, "253": "Mewtwo",
    MewtwoMegaX: 254, "254": "MewtwoMegaX",
    MewtwoMegaY: 255, "255": "MewtwoMegaY",
    Mew: 256, "256": "Mew",
    Chikorita: 257, "257": "Chikorita",
    Bayleef: 258, "258": "Bayleef",
    Meganium: 259, "259": "Meganium",
    MeganiumMega: 260, "260": "MeganiumMega",
    Cyndaquil: 261, "261": "Cyndaquil",
    Quilava: 262, "262": "Quilava",
    Typhlosion: 263, "263": "Typhlosion",
    TyphlosionMega: 264, "264": "TyphlosionMega",
    TyphlosionHisuian: 265, "265": "TyphlosionHisuian",
    TyphlosionHisuianMega: 266, "266": "TyphlosionHisuianMega",
    Totodile: 267, "267": "Totodile",
    Croconaw: 268, "268": "Croconaw",
    Feraligatr: 269, "269": "Feraligatr",
    FeraligatrMegaX: 270, "270": "FeraligatrMegaX",
    FeraligatrMegaY: 271, "271": "FeraligatrMegaY",
    Sentret: 272, "272": "Sentret",
    Furret: 273, "273": "Furret",
    Hoothoot: 274, "274": "Hoothoot",
    Noctowl: 275, "275": "Noctowl",
    Ledyba: 276, "276": "Ledyba",
    Ledian: 277, "277": "Ledian",
    LedianParadox: 278, "278": "LedianParadox",
    Spinarak: 279, "279": "Spinarak",
    Ariados: 280, "280": "Ariados",
    Chinchou: 281, "281": "Chinchou",
    Lanturn: 282, "282": "Lanturn",
    LanturnMega: 283, "283": "LanturnMega",
    Pichu: 284, "284": "Pichu",
    Pikachu: 285, "285": "Pikachu",
    Raichu: 286, "286": "Raichu",
    RaichuAlolan: 287, "287": "RaichuAlolan",
    PikachuPartner: 288, "288": "PikachuPartner",
    PikachuPartnerMega: 289, "289": "PikachuPartnerMega",
    PikachuOriginalCap: 290, "290": "PikachuOriginalCap",
    PikachuHoennCap: 291, "291": "PikachuHoennCap",
    PikachuSinnohCap: 292, "292": "PikachuSinnohCap",
    PikachuUnovaCap: 293, "293": "PikachuUnovaCap",
    PikachuKalosCap: 294, "294": "PikachuKalosCap",
    PikachuAlolaCap: 295, "295": "PikachuAlolaCap",
    PikachuWorldCap: 296, "296": "PikachuWorldCap",
    PikachuCosplay: 297, "297": "PikachuCosplay",
    PikachuRockStar: 298, "298": "PikachuRockStar",
    PikachuBelle: 299, "299": "PikachuBelle",
    PikachuPopStar: 300, "300": "PikachuPopStar",
    PikachuPhD: 301, "301": "PikachuPhD",
    PikachuLibre: 302, "302": "PikachuLibre",
    PikachuPartnerCap: 303, "303": "PikachuPartnerCap",
    PichuSpikyEared: 304, "304": "PichuSpikyEared",
    Cleffa: 305, "305": "Cleffa",
    Clefairy: 306, "306": "Clefairy",
    Clefable: 307, "307": "Clefable",
    CleffaRedux: 308, "308": "CleffaRedux",
    ClefairyRedux: 309, "309": "ClefairyRedux",
    ClefableRedux: 310, "310": "ClefableRedux",
    ClefableReduxMega: 311, "311": "ClefableReduxMega",
    Igglybuff: 312, "312": "Igglybuff",
    Togepi: 313, "313": "Togepi",
    Togetic: 314, "314": "Togetic",
    Natu: 315, "315": "Natu",
    Xatu: 316, "316": "Xatu",
    Mareep: 317, "317": "Mareep",
    Flaaffy: 318, "318": "Flaaffy",
    Ampharos: 319, "319": "Ampharos",
    AmpharosMega: 320, "320": "AmpharosMega",
    Bellossom: 321, "321": "Bellossom",
    Marill: 322, "322": "Marill",
    Azumarill: 323, "323": "Azumarill",
    Sudowoodo: 324, "324": "Sudowoodo",
    Politoed: 325, "325": "Politoed",
    Hoppip: 326, "326": "Hoppip",
    Skiploom: 327, "327": "Skiploom",
    Jumpluff: 328, "328": "Jumpluff",
    Aipom: 329, "329": "Aipom",
    Sunkern: 330, "330": "Sunkern",
    Sunflora: 331, "331": "Sunflora",
    Yanma: 332, "332": "Yanma",
    Wooper: 333, "333": "Wooper",
    Quagsire: 334, "334": "Quagsire",
    QuagsireMega: 335, "335": "QuagsireMega",
    WooperPaldean: 336, "336": "WooperPaldean",
    Umbreon: 337, "337": "Umbreon",
    Murkrow: 338, "338": "Murkrow",
    Misdreavus: 339, "339": "Misdreavus",
    Unown: 340, "340": "Unown",
    UnownRevelation: 341, "341": "UnownRevelation",
    UnownB: 342, "342": "UnownB",
    UnownC: 343, "343": "UnownC",
    UnownD: 344, "344": "UnownD",
    UnownE: 345, "345": "UnownE",
    UnownF: 346, "346": "UnownF",
    UnownG: 347, "347": "UnownG",
    UnownH: 348, "348": "UnownH",
    UnownI: 349, "349": "UnownI",
    UnownJ: 350, "350": "UnownJ",
    UnownK: 351, "351": "UnownK",
    UnownL: 352, "352": "UnownL",
    UnownM: 353, "353": "UnownM",
    UnownN: 354, "354": "UnownN",
    UnownO: 355, "355": "UnownO",
    UnownP: 356, "356": "UnownP",
    UnownQ: 357, "357": "UnownQ",
    UnownR: 358, "358": "UnownR",
    UnownS: 359, "359": "UnownS",
    UnownT: 360, "360": "UnownT",
    UnownU: 361, "361": "UnownU",
    UnownV: 362, "362": "UnownV",
    UnownW: 363, "363": "UnownW",
    UnownX: 364, "364": "UnownX",
    UnownY: 365, "365": "UnownY",
    UnownZ: 366, "366": "UnownZ",
    UnownEmark: 367, "367": "UnownEmark",
    UnownQmark: 368, "368": "UnownQmark",
    Wobbuffet: 369, "369": "Wobbuffet",
    Girafarig: 370, "370": "Girafarig",
    Pineco: 371, "371": "Pineco",
    Forretress: 372, "372": "Forretress",
    Dunsparce: 373, "373": "Dunsparce",
    Dudunsparce: 374, "374": "Dudunsparce",
    DudunsparceThreeSegment: 375, "375": "DudunsparceThreeSegment",
    Gligar: 376, "376": "Gligar",
    Gliscor: 377, "377": "Gliscor",
    GligarRedux: 378, "378": "GligarRedux",
    GliscorRedux: 379, "379": "GliscorRedux",
    Snubbull: 380, "380": "Snubbull",
    Granbull: 381, "381": "Granbull",
    GranbullMega: 382, "382": "GranbullMega",
    Qwilfish: 383, "383": "Qwilfish",
    QwilfishHisuian: 384, "384": "QwilfishHisuian",
    Shuckle: 385, "385": "Shuckle",
    ShuckleMega: 386, "386": "ShuckleMega",
    Heracross: 387, "387": "Heracross",
    HeracrossMega: 388, "388": "HeracrossMega",
    Sneasel: 389, "389": "Sneasel",
    Weavile: 390, "390": "Weavile",
    WeavileRedux: 391, "391": "WeavileRedux",
    WeavileReduxMega: 392, "392": "WeavileReduxMega",
    SneaselHisuian: 393, "393": "SneaselHisuian",
    Teddiursa: 394, "394": "Teddiursa",
    Ursaring: 395, "395": "Ursaring",
    Ursaluna: 396, "396": "Ursaluna",
    UrsalunaMega: 397, "397": "UrsalunaMega",
    UrsalunaBloodmoon: 398, "398": "UrsalunaBloodmoon",
    Slugma: 399, "399": "Slugma",
    Magcargo: 400, "400": "Magcargo",
    Escarginite: 401, "401": "Escarginite",
    SlugmaRedux: 402, "402": "SlugmaRedux",
    MagcargoRedux: 403, "403": "MagcargoRedux",
    EscarginiteRedux: 404, "404": "EscarginiteRedux",
    Swinub: 405, "405": "Swinub",
    Piloswine: 406, "406": "Piloswine",
    Corsola: 407, "407": "Corsola",
    CorsolaGalarian: 408, "408": "CorsolaGalarian",
    Remoraid: 409, "409": "Remoraid",
    Octillery: 410, "410": "Octillery",
    Delibird: 411, "411": "Delibird",
    Mantine: 412, "412": "Mantine",
    Skarmory: 413, "413": "Skarmory",
    SkarmoryMega: 414, "414": "SkarmoryMega",
    SkarmoryRedux: 415, "415": "SkarmoryRedux",
    SkarmoryMegaRedux: 416, "416": "SkarmoryMegaRedux",
    Houndour: 417, "417": "Houndour",
    Houndoom: 418, "418": "Houndoom",
    HoundoomMega: 419, "419": "HoundoomMega",
    HoundourRedux: 420, "420": "HoundourRedux",
    HoundoomRedux: 421, "421": "HoundoomRedux",
    HoundoomMegaRedux: 422, "422": "HoundoomMegaRedux",
    Phanpy: 423, "423": "Phanpy",
    Donphan: 424, "424": "Donphan",
    Porygon2: 425, "425": "Porygon2",
    Stantler: 426, "426": "Stantler",
    Smeargle: 427, "427": "Smeargle",
    Tyrogue: 428, "428": "Tyrogue",
    Hitmonlee: 429, "429": "Hitmonlee",
    Hitmonchan: 430, "430": "Hitmonchan",
    Hitmontop: 431, "431": "Hitmontop",
    HitmonchanMega: 432, "432": "HitmonchanMega",
    HitmonleeMega: 433, "433": "HitmonleeMega",
    HitmontopMega: 434, "434": "HitmontopMega",
    Smoochum: 435, "435": "Smoochum",
    Elekid: 436, "436": "Elekid",
    Magby: 437, "437": "Magby",
    Miltank: 438, "438": "Miltank",
    Raikou: 439, "439": "Raikou",
    Entei: 440, "440": "Entei",
    Suicune: 441, "441": "Suicune",
    Larvitar: 442, "442": "Larvitar",
    Pupitar: 443, "443": "Pupitar",
    Tyranitar: 444, "444": "Tyranitar",
    TyranitarMega: 445, "445": "TyranitarMega",
    LarvitarRedux: 446, "446": "LarvitarRedux",
    PupitarRedux: 447, "447": "PupitarRedux",
    TyranitarRedux: 448, "448": "TyranitarRedux",
    TyranitarMegaRedux: 449, "449": "TyranitarMegaRedux",
    Lugia: 450, "450": "Lugia",
    HoOh: 451, "451": "HoOh",
    Celebi: 452, "452": "Celebi",
    Treecko: 453, "453": "Treecko",
    Grovyle: 454, "454": "Grovyle",
    Sceptile: 455, "455": "Sceptile",
    SceptileMega: 456, "456": "SceptileMega",
    Torchic: 457, "457": "Torchic",
    Combusken: 458, "458": "Combusken",
    Blaziken: 459, "459": "Blaziken",
    BlazikenMega: 460, "460": "BlazikenMega",
    Mudkip: 461, "461": "Mudkip",
    Marshtomp: 462, "462": "Marshtomp",
    Swampert: 463, "463": "Swampert",
    SwampertMega: 464, "464": "SwampertMega",
    Poochyena: 465, "465": "Poochyena",
    Mightyena: 466, "466": "Mightyena",
    Zigzagoon: 467, "467": "Zigzagoon",
    Linoone: 468, "468": "Linoone",
    ZigzagoonGalarian: 469, "469": "ZigzagoonGalarian",
    LinooneGalarian: 470, "470": "LinooneGalarian",
    Wurmple: 471, "471": "Wurmple",
    Cascoon: 472, "472": "Cascoon",
    CascoonPrimal: 473, "473": "CascoonPrimal",
    Silcoon: 474, "474": "Silcoon",
    Beautifly: 475, "475": "Beautifly",
    Dustox: 476, "476": "Dustox",
    Lotad: 477, "477": "Lotad",
    Lombre: 478, "478": "Lombre",
    Ludicolo: 479, "479": "Ludicolo",
    Seedot: 480, "480": "Seedot",
    Nuzleaf: 481, "481": "Nuzleaf",
    Shiftry: 482, "482": "Shiftry",
    Taillow: 483, "483": "Taillow",
    Swellow: 484, "484": "Swellow",
    Wingull: 485, "485": "Wingull",
    Pelipper: 486, "486": "Pelipper",
    Ralts: 487, "487": "Ralts",
    Kirlia: 488, "488": "Kirlia",
    Gardevoir: 489, "489": "Gardevoir",
    Gallade: 490, "490": "Gallade",
    GardevoirMega: 491, "491": "GardevoirMega",
    GalladeMega: 492, "492": "GalladeMega",
    Surskit: 493, "493": "Surskit",
    Masquerain: 494, "494": "Masquerain",
    Shroomish: 495, "495": "Shroomish",
    Breloom: 496, "496": "Breloom",
    BreloomMega: 497, "497": "BreloomMega",
    Slakoth: 498, "498": "Slakoth",
    Vigoroth: 499, "499": "Vigoroth",
    Slaking: 500, "500": "Slaking",
    SlakingMega: 501, "501": "SlakingMega",
    SlakingMegaApeShift: 502, "502": "SlakingMegaApeShift",
    Nincada: 503, "503": "Nincada",
    Shedinja: 504, "504": "Shedinja",
    ShedinjaMega: 505, "505": "ShedinjaMega",
    Ninjask: 506, "506": "Ninjask",
    Whismur: 507, "507": "Whismur",
    Loudred: 508, "508": "Loudred",
    Exploud: 509, "509": "Exploud",
    WhismurRedux: 510, "510": "WhismurRedux",
    LoudredRedux: 511, "511": "LoudredRedux",
    ExploudRedux: 512, "512": "ExploudRedux",
    Makuhita: 513, "513": "Makuhita",
    Hariyama: 514, "514": "Hariyama",
    Azurill: 515, "515": "Azurill",
    Nosepass: 516, "516": "Nosepass",
    Skitty: 517, "517": "Skitty",
    Delcatty: 518, "518": "Delcatty",
    Sableye: 519, "519": "Sableye",
    SableyeMega: 520, "520": "SableyeMega",
    SableyeRedux: 521, "521": "SableyeRedux",
    SableyeMegaRedux: 522, "522": "SableyeMegaRedux",
    Mawile: 523, "523": "Mawile",
    MawileMega: 524, "524": "MawileMega",
    MawileRedux: 525, "525": "MawileRedux",
    MawileMegaRedux: 526, "526": "MawileMegaRedux",
    MawileReduxB: 527, "527": "MawileReduxB",
    MawileReduxBMega: 528, "528": "MawileReduxBMega",
    Aron: 529, "529": "Aron",
    Lairon: 530, "530": "Lairon",
    Aggron: 531, "531": "Aggron",
    AggronMega: 532, "532": "AggronMega",
    Meditite: 533, "533": "Meditite",
    Medicham: 534, "534": "Medicham",
    MedichamMega: 535, "535": "MedichamMega",
    Electrike: 536, "536": "Electrike",
    Manectric: 537, "537": "Manectric",
    ManectricMega: 538, "538": "ManectricMega",
    Plusle: 539, "539": "Plusle",
    Minun: 540, "540": "Minun",
    Volbeat: 541, "541": "Volbeat",
    Illumise: 542, "542": "Illumise",
    Roselia: 543, "543": "Roselia",
    Roserade: 544, "544": "Roserade",
    RoseradeMega: 545, "545": "RoseradeMega",
    Gulpin: 546, "546": "Gulpin",
    Swalot: 547, "547": "Swalot",
    SwalotMega: 548, "548": "SwalotMega",
    Carvanha: 549, "549": "Carvanha",
    Sharpedo: 550, "550": "Sharpedo",
    SharpedoMega: 551, "551": "SharpedoMega",
    Wailmer: 552, "552": "Wailmer",
    Wailord: 553, "553": "Wailord",
    Numel: 554, "554": "Numel",
    Camerupt: 555, "555": "Camerupt",
    CameruptMega: 556, "556": "CameruptMega",
    Torkoal: 557, "557": "Torkoal",
    Spoink: 558, "558": "Spoink",
    Grumpig: 559, "559": "Grumpig",
    Spinda: 560, "560": "Spinda",
    Trapinch: 561, "561": "Trapinch",
    Vibrava: 562, "562": "Vibrava",
    Flygon: 563, "563": "Flygon",
    FlygonReduxB: 564, "564": "FlygonReduxB",
    FlygonReduxBMega: 565, "565": "FlygonReduxBMega",
    FlygonMega: 566, "566": "FlygonMega",
    TrapinchRedux: 567, "567": "TrapinchRedux",
    VibravaRedux: 568, "568": "VibravaRedux",
    FlygonRedux: 569, "569": "FlygonRedux",
    FlygonReduxMega: 570, "570": "FlygonReduxMega",
    Cacnea: 571, "571": "Cacnea",
    Cacturne: 572, "572": "Cacturne",
    Swablu: 573, "573": "Swablu",
    Altaria: 574, "574": "Altaria",
    AltariaMega: 575, "575": "AltariaMega",
    Zangoose: 576, "576": "Zangoose",
    Seviper: 577, "577": "Seviper",
    Lunatone: 578, "578": "Lunatone",
    Solrock: 579, "579": "Solrock",
    SolrockSystem: 580, "580": "SolrockSystem",
    Barboach: 581, "581": "Barboach",
    Whiscash: 582, "582": "Whiscash",
    Corphish: 583, "583": "Corphish",
    Crawdaunt: 584, "584": "Crawdaunt",
    Baltoy: 585, "585": "Baltoy",
    Claydol: 586, "586": "Claydol",
    Lileep: 587, "587": "Lileep",
    Cradily: 588, "588": "Cradily",
    Anorith: 589, "589": "Anorith",
    Armaldo: 590, "590": "Armaldo",
    Feebas: 591, "591": "Feebas",
    Milotic: 592, "592": "Milotic",
    MiloticMega: 593, "593": "MiloticMega",
    Castform: 594, "594": "Castform",
    CastformSandy: 595, "595": "CastformSandy",
    CastformSunny: 596, "596": "CastformSunny",
    CastformRainy: 597, "597": "CastformRainy",
    CastformSnowy: 598, "598": "CastformSnowy",
    CastformFoggy: 599, "599": "CastformFoggy",
    Kecleon: 600, "600": "Kecleon",
    Shuppet: 601, "601": "Shuppet",
    Banette: 602, "602": "Banette",
    BanetteMega: 603, "603": "BanetteMega",
    Duskull: 604, "604": "Duskull",
    Dusclops: 605, "605": "Dusclops",
    Tropius: 606, "606": "Tropius",
    Chimecho: 607, "607": "Chimecho",
    Absol: 608, "608": "Absol",
    AbsolMega: 609, "609": "AbsolMega",
    Wynaut: 610, "610": "Wynaut",
    Snorunt: 611, "611": "Snorunt",
    Glalie: 612, "612": "Glalie",
    Froslass: 613, "613": "Froslass",
    GlalieMega: 614, "614": "GlalieMega",
    FroslassMega: 615, "615": "FroslassMega",
    SnoruntRedux: 616, "616": "SnoruntRedux",
    GlalieRedux: 617, "617": "GlalieRedux",
    FroslassRedux: 618, "618": "FroslassRedux",
    GlalieReduxMega: 619, "619": "GlalieReduxMega",
    FroslassReduxMega: 620, "620": "FroslassReduxMega",
    Spheal: 621, "621": "Spheal",
    Sealeo: 622, "622": "Sealeo",
    Walrein: 623, "623": "Walrein",
    Clamperl: 624, "624": "Clamperl",
    Huntail: 625, "625": "Huntail",
    Gorebyss: 626, "626": "Gorebyss",
    Relicanth: 627, "627": "Relicanth",
    RelicanthMega: 628, "628": "RelicanthMega",
    Luvdisc: 629, "629": "Luvdisc",
    Bagon: 630, "630": "Bagon",
    Shelgon: 631, "631": "Shelgon",
    Salamence: 632, "632": "Salamence",
    SalamenceMega: 633, "633": "SalamenceMega",
    Beldum: 634, "634": "Beldum",
    Metang: 635, "635": "Metang",
    Metagross: 636, "636": "Metagross",
    MetagrossMega: 637, "637": "MetagrossMega",
    Regirock: 638, "638": "Regirock",
    Regice: 639, "639": "Regice",
    Registeel: 640, "640": "Registeel",
    Latias: 641, "641": "Latias",
    LatiasMega: 642, "642": "LatiasMega",
    Latios: 643, "643": "Latios",
    LatiosMega: 644, "644": "LatiosMega",
    Kyogre: 645, "645": "Kyogre",
    KyogrePrimal: 646, "646": "KyogrePrimal",
    Groudon: 647, "647": "Groudon",
    GroudonPrimal: 648, "648": "GroudonPrimal",
    Rayquaza: 649, "649": "Rayquaza",
    RayquazaMega: 650, "650": "RayquazaMega",
    Jirachi: 651, "651": "Jirachi",
    Deoxys: 652, "652": "Deoxys",
    DeoxysAttack: 653, "653": "DeoxysAttack",
    DeoxysDefense: 654, "654": "DeoxysDefense",
    DeoxysSpeed: 655, "655": "DeoxysSpeed",
    Turtwig: 656, "656": "Turtwig",
    Grotle: 657, "657": "Grotle",
    Torterra: 658, "658": "Torterra",
    TorterraMega: 659, "659": "TorterraMega",
    TurtwigRedux: 660, "660": "TurtwigRedux",
    GrotleRedux: 661, "661": "GrotleRedux",
    TorterraRedux: 662, "662": "TorterraRedux",
    TorterraReduxMega: 663, "663": "TorterraReduxMega",
    Chimchar: 664, "664": "Chimchar",
    Monferno: 665, "665": "Monferno",
    Infernape: 666, "666": "Infernape",
    InfernapeMega: 667, "667": "InfernapeMega",
    InfernapeReduxB: 668, "668": "InfernapeReduxB",
    ChimcharRedux: 669, "669": "ChimcharRedux",
    MonfernoRedux: 670, "670": "MonfernoRedux",
    InfernapeRedux: 671, "671": "InfernapeRedux",
    InfernapeReduxMega: 672, "672": "InfernapeReduxMega",
    Piplup: 673, "673": "Piplup",
    Prinplup: 674, "674": "Prinplup",
    Empoleon: 675, "675": "Empoleon",
    EmpoleonMega: 676, "676": "EmpoleonMega",
    PiplupRedux: 677, "677": "PiplupRedux",
    PrinplupRedux: 678, "678": "PrinplupRedux",
    EmpoleonRedux: 679, "679": "EmpoleonRedux",
    EmpoleonReduxMega: 680, "680": "EmpoleonReduxMega",
    Starly: 681, "681": "Starly",
    Staravia: 682, "682": "Staravia",
    Staraptor: 683, "683": "Staraptor",
    Bidoof: 684, "684": "Bidoof",
    Bibarel: 685, "685": "Bibarel",
    Kricketot: 686, "686": "Kricketot",
    Kricketune: 687, "687": "Kricketune",
    Shinx: 688, "688": "Shinx",
    Luxio: 689, "689": "Luxio",
    Luxray: 690, "690": "Luxray",
    LuxrayMega: 691, "691": "LuxrayMega",
    Budew: 692, "692": "Budew",
    Cranidos: 693, "693": "Cranidos",
    Rampardos: 694, "694": "Rampardos",
    Shieldon: 695, "695": "Shieldon",
    Bastiodon: 696, "696": "Bastiodon",
    Burmy: 697, "697": "Burmy",
    Wormadam: 698, "698": "Wormadam",
    BurmySandyCloak: 699, "699": "BurmySandyCloak",
    WormadamSandyCloak: 700, "700": "WormadamSandyCloak",
    BurmyTrashCloak: 701, "701": "BurmyTrashCloak",
    WormadamTrashCloak: 702, "702": "WormadamTrashCloak",
    BurmyEterna: 703, "703": "BurmyEterna",
    Mothim: 704, "704": "Mothim",
    Combee: 705, "705": "Combee",
    Vespiquen: 706, "706": "Vespiquen",
    Pachirisu: 707, "707": "Pachirisu",
    Buizel: 708, "708": "Buizel",
    Floatzel: 709, "709": "Floatzel",
    BuizelRedux: 710, "710": "BuizelRedux",
    FloatzelRedux: 711, "711": "FloatzelRedux",
    Cherubi: 712, "712": "Cherubi",
    Cherrim: 713, "713": "Cherrim",
    CherrimSunshine: 714, "714": "CherrimSunshine",
    Shellos: 715, "715": "Shellos",
    Gastrodon: 716, "716": "Gastrodon",
    ShellosEastSea: 717, "717": "ShellosEastSea",
    GastrodonEastSea: 718, "718": "GastrodonEastSea",
    Ambipom: 719, "719": "Ambipom",
    Drifloon: 720, "720": "Drifloon",
    Drifblim: 721, "721": "Drifblim",
    Buneary: 722, "722": "Buneary",
    Lopunny: 723, "723": "Lopunny",
    LopunnyMega: 724, "724": "LopunnyMega",
    Mismagius: 725, "725": "Mismagius",
    Honchkrow: 726, "726": "Honchkrow",
    Glameow: 727, "727": "Glameow",
    Purugly: 728, "728": "Purugly",
    Chingling: 729, "729": "Chingling",
    Stunky: 730, "730": "Stunky",
    Skuntank: 731, "731": "Skuntank",
    Bronzor: 732, "732": "Bronzor",
    Bronzong: 733, "733": "Bronzong",
    Bonsly: 734, "734": "Bonsly",
    MimeJr: 735, "735": "MimeJr",
    MrMime: 736, "736": "MrMime",
    MrMimeGalarian: 737, "737": "MrMimeGalarian",
    Happiny: 738, "738": "Happiny",
    Chansey: 739, "739": "Chansey",
    Blissey: 740, "740": "Blissey",
    HappinyRedux: 741, "741": "HappinyRedux",
    ChanseyRedux: 742, "742": "ChanseyRedux",
    BlisseyRedux: 743, "743": "BlisseyRedux",
    Chatot: 744, "744": "Chatot",
    Spiritomb: 745, "745": "Spiritomb",
    SpiritombRedux: 746, "746": "SpiritombRedux",
    Gible: 747, "747": "Gible",
    Gabite: 748, "748": "Gabite",
    Garchomp: 749, "749": "Garchomp",
    GarchompMega: 750, "750": "GarchompMega",
    GibleRedux: 751, "751": "GibleRedux",
    GabiteRedux: 752, "752": "GabiteRedux",
    GarchompRedux: 753, "753": "GarchompRedux",
    GarchompMegaRedux: 754, "754": "GarchompMegaRedux",
    Munchlax: 755, "755": "Munchlax",
    Snorlax: 756, "756": "Snorlax",
    SnorlaxMega: 757, "757": "SnorlaxMega",
    SnorlaxPrimal: 758, "758": "SnorlaxPrimal",
    Riolu: 759, "759": "Riolu",
    Lucario: 760, "760": "Lucario",
    LucarioMega: 761, "761": "LucarioMega",
    LucarioMegaY: 762, "762": "LucarioMegaY",
    Hippopotas: 763, "763": "Hippopotas",
    Hippowdon: 764, "764": "Hippowdon",
    Skorupi: 765, "765": "Skorupi",
    Drapion: 766, "766": "Drapion",
    Croagunk: 767, "767": "Croagunk",
    Toxicroak: 768, "768": "Toxicroak",
    Carnivine: 769, "769": "Carnivine",
    Finneon: 770, "770": "Finneon",
    Lumineon: 771, "771": "Lumineon",
    Mantyke: 772, "772": "Mantyke",
    Snover: 773, "773": "Snover",
    Abomasnow: 774, "774": "Abomasnow",
    AbomasnowSanta: 775, "775": "AbomasnowSanta",
    AbomasnowMega: 776, "776": "AbomasnowMega",
    Lickilicky: 777, "777": "Lickilicky",
    Rhyperior: 778, "778": "Rhyperior",
    Tangrowth: 779, "779": "Tangrowth",
    Electivire: 780, "780": "Electivire",
    Magmortar: 781, "781": "Magmortar",
    Togekiss: 782, "782": "Togekiss",
    Yanmega: 783, "783": "Yanmega",
    Leafeon: 784, "784": "Leafeon",
    Glaceon: 785, "785": "Glaceon",
    Mamoswine: 786, "786": "Mamoswine",
    PorygonZ: 787, "787": "PorygonZ",
    Probopass: 788, "788": "Probopass",
    Dusknoir: 789, "789": "Dusknoir",
    Rotom: 790, "790": "Rotom",
    RotomHeat: 791, "791": "RotomHeat",
    RotomWash: 792, "792": "RotomWash",
    RotomFrost: 793, "793": "RotomFrost",
    RotomFan: 794, "794": "RotomFan",
    RotomMow: 795, "795": "RotomMow",
    Uxie: 796, "796": "Uxie",
    UxieRedux: 797, "797": "UxieRedux",
    Mesprit: 798, "798": "Mesprit",
    MespritRedux: 799, "799": "MespritRedux",
    Azelf: 800, "800": "Azelf",
    AzelfRedux: 801, "801": "AzelfRedux",
    Dialga: 802, "802": "Dialga",
    DialgaOrigin: 803, "803": "DialgaOrigin",
    Palkia: 804, "804": "Palkia",
    PalkiaOrigin: 805, "805": "PalkiaOrigin",
    Heatran: 806, "806": "Heatran",
    Regigigas: 807, "807": "Regigigas",
    Giratina: 808, "808": "Giratina",
    GiratinaOrigin: 809, "809": "GiratinaOrigin",
    Cresselia: 810, "810": "Cresselia",
    Phione: 811, "811": "Phione",
    Manaphy: 812, "812": "Manaphy",
    Darkrai: 813, "813": "Darkrai",
    DarkraiNightmare: 814, "814": "DarkraiNightmare",
    Shaymin: 815, "815": "Shaymin",
    ShayminSky: 816, "816": "ShayminSky",
    Arceus: 817, "817": "Arceus",
    ArceusFighting: 818, "818": "ArceusFighting",
    ArceusFlying: 819, "819": "ArceusFlying",
    ArceusPoison: 820, "820": "ArceusPoison",
    ArceusGround: 821, "821": "ArceusGround",
    ArceusRock: 822, "822": "ArceusRock",
    ArceusBug: 823, "823": "ArceusBug",
    ArceusGhost: 824, "824": "ArceusGhost",
    ArceusSteel: 825, "825": "ArceusSteel",
    ArceusFire: 826, "826": "ArceusFire",
    ArceusWater: 827, "827": "ArceusWater",
    ArceusGrass: 828, "828": "ArceusGrass",
    ArceusElectric: 829, "829": "ArceusElectric",
    ArceusPsychic: 830, "830": "ArceusPsychic",
    ArceusIce: 831, "831": "ArceusIce",
    ArceusDragon: 832, "832": "ArceusDragon",
    ArceusDark: 833, "833": "ArceusDark",
    ArceusFairy: 834, "834": "ArceusFairy",
    Victini: 835, "835": "Victini",
    VictiniPrimal: 836, "836": "VictiniPrimal",
    Snivy: 837, "837": "Snivy",
    Servine: 838, "838": "Servine",
    Serperior: 839, "839": "Serperior",
    SerperiorMega: 840, "840": "SerperiorMega",
    Tepig: 841, "841": "Tepig",
    Pignite: 842, "842": "Pignite",
    Emboar: 843, "843": "Emboar",
    EmboarMega: 844, "844": "EmboarMega",
    Oshawott: 845, "845": "Oshawott",
    Dewott: 846, "846": "Dewott",
    Samurott: 847, "847": "Samurott",
    SamurottHisuian: 848, "848": "SamurottHisuian",
    SamurottHisuianMega: 849, "849": "SamurottHisuianMega",
    Patrat: 850, "850": "Patrat",
    Watchog: 851, "851": "Watchog",
    Lillipup: 852, "852": "Lillipup",
    Herdier: 853, "853": "Herdier",
    Stoutland: 854, "854": "Stoutland",
    Purrloin: 855, "855": "Purrloin",
    Liepard: 856, "856": "Liepard",
    Pansage: 857, "857": "Pansage",
    Simisage: 858, "858": "Simisage",
    PansageRedux: 859, "859": "PansageRedux",
    SimisageRedux: 860, "860": "SimisageRedux",
    Pansear: 861, "861": "Pansear",
    Simisear: 862, "862": "Simisear",
    PansearRedux: 863, "863": "PansearRedux",
    SimisearRedux: 864, "864": "SimisearRedux",
    Panpour: 865, "865": "Panpour",
    Simipour: 866, "866": "Simipour",
    PanpourRedux: 867, "867": "PanpourRedux",
    SimipourRedux: 868, "868": "SimipourRedux",
    Munna: 869, "869": "Munna",
    Musharna: 870, "870": "Musharna",
    Pidove: 871, "871": "Pidove",
    Tranquill: 872, "872": "Tranquill",
    Unfezant: 873, "873": "Unfezant",
    Blitzle: 874, "874": "Blitzle",
    Zebstrika: 875, "875": "Zebstrika",
    Roggenrola: 876, "876": "Roggenrola",
    Boldore: 877, "877": "Boldore",
    Gigalith: 878, "878": "Gigalith",
    Woobat: 879, "879": "Woobat",
    Swoobat: 880, "880": "Swoobat",
    Drilbur: 881, "881": "Drilbur",
    Excadrill: 882, "882": "Excadrill",
    Audino: 883, "883": "Audino",
    AudinoMega: 884, "884": "AudinoMega",
    Timburr: 885, "885": "Timburr",
    Gurdurr: 886, "886": "Gurdurr",
    Conkeldurr: 887, "887": "Conkeldurr",
    Tympole: 888, "888": "Tympole",
    Palpitoad: 889, "889": "Palpitoad",
    Seismitoad: 890, "890": "Seismitoad",
    Throh: 891, "891": "Throh",
    Sawk: 892, "892": "Sawk",
    Sewaddle: 893, "893": "Sewaddle",
    Swadloon: 894, "894": "Swadloon",
    Leavanny: 895, "895": "Leavanny",
    Venipede: 896, "896": "Venipede",
    Whirlipede: 897, "897": "Whirlipede",
    Scolipede: 898, "898": "Scolipede",
    Cottonee: 899, "899": "Cottonee",
    Whimsicott: 900, "900": "Whimsicott",
    Petilil: 901, "901": "Petilil",
    Lilligant: 902, "902": "Lilligant",
    LilligantHisuian: 903, "903": "LilligantHisuian",
    Basculin: 904, "904": "Basculin",
    Basculegion: 905, "905": "Basculegion",
    BasculegionF: 906, "906": "BasculegionF",
    BasculinWhitestriped: 907, "907": "BasculinWhitestriped",
    BasculinBlueStriped: 908, "908": "BasculinBlueStriped",
    Sandile: 909, "909": "Sandile",
    Krokorok: 910, "910": "Krokorok",
    Krookodile: 911, "911": "Krookodile",
    KrookodileMega: 912, "912": "KrookodileMega",
    Darumaka: 913, "913": "Darumaka",
    Darmanitan: 914, "914": "Darmanitan",
    DarmanitanZenMode: 915, "915": "DarmanitanZenMode",
    DarumakaGalarian: 916, "916": "DarumakaGalarian",
    DarmanitanGalarian: 917, "917": "DarmanitanGalarian",
    DarmanitanZenModeGalarian: 918, "918": "DarmanitanZenModeGalarian",
    DarumakaRedux: 919, "919": "DarumakaRedux",
    DarmanitanRedux: 920, "920": "DarmanitanRedux",
    DarmanitanReduxAura: 921, "921": "DarmanitanReduxAura",
    DarmanitanReduxBond: 922, "922": "DarmanitanReduxBond",
    DarmanitanReduxBlunder: 923, "923": "DarmanitanReduxBlunder",
    Maractus: 924, "924": "Maractus",
    Dwebble: 925, "925": "Dwebble",
    Crustle: 926, "926": "Crustle",
    Scraggy: 927, "927": "Scraggy",
    Scrafty: 928, "928": "Scrafty",
    ScraftyMega: 929, "929": "ScraftyMega",
    Sigilyph: 930, "930": "Sigilyph",
    Yamask: 931, "931": "Yamask",
    YamaskGalarian: 932, "932": "YamaskGalarian",
    Cofagrigus: 933, "933": "Cofagrigus",
    Tirtouga: 934, "934": "Tirtouga",
    Carracosta: 935, "935": "Carracosta",
    Archen: 936, "936": "Archen",
    Archeops: 937, "937": "Archeops",
    Trubbish: 938, "938": "Trubbish",
    Garbodor: 939, "939": "Garbodor",
    GarbodorMega: 940, "940": "GarbodorMega",
    Zorua: 941, "941": "Zorua",
    Zoroark: 942, "942": "Zoroark",
    ZoruaHisuian: 943, "943": "ZoruaHisuian",
    ZoroarkHisuian: 944, "944": "ZoroarkHisuian",
    Minccino: 945, "945": "Minccino",
    Cinccino: 946, "946": "Cinccino",
    Gothita: 947, "947": "Gothita",
    Gothorita: 948, "948": "Gothorita",
    Gothitelle: 949, "949": "Gothitelle",
    Solosis: 950, "950": "Solosis",
    Duosion: 951, "951": "Duosion",
    Reuniclus: 952, "952": "Reuniclus",
    SolosisRedux: 953, "953": "SolosisRedux",
    DuosionRedux: 954, "954": "DuosionRedux",
    ReuniclusRedux: 955, "955": "ReuniclusRedux",
    ReuniclusReduxMega: 956, "956": "ReuniclusReduxMega",
    Ducklett: 957, "957": "Ducklett",
    Swanna: 958, "958": "Swanna",
    Vanillite: 959, "959": "Vanillite",
    Vanillish: 960, "960": "Vanillish",
    Vanilluxe: 961, "961": "Vanilluxe",
    Deerling: 962, "962": "Deerling",
    Sawsbuck: 963, "963": "Sawsbuck",
    DeerlingSummer: 964, "964": "DeerlingSummer",
    SawsbuckSummer: 965, "965": "SawsbuckSummer",
    DeerlingAutumn: 966, "966": "DeerlingAutumn",
    SawsbuckAutumn: 967, "967": "SawsbuckAutumn",
    DeerlingWinter: 968, "968": "DeerlingWinter",
    SawsbuckWinter: 969, "969": "SawsbuckWinter",
    Emolga: 970, "970": "Emolga",
    Karrablast: 971, "971": "Karrablast",
    Escavalier: 972, "972": "Escavalier",
    Foongus: 973, "973": "Foongus",
    Amoonguss: 974, "974": "Amoonguss",
    Frillish: 975, "975": "Frillish",
    Jellicent: 976, "976": "Jellicent",
    Alomomola: 977, "977": "Alomomola",
    Joltik: 978, "978": "Joltik",
    Galvantula: 979, "979": "Galvantula",
    Ferroseed: 980, "980": "Ferroseed",
    Ferrothorn: 981, "981": "Ferrothorn",
    Klink: 982, "982": "Klink",
    Klang: 983, "983": "Klang",
    Klinklang: 984, "984": "Klinklang",
    Tynamo: 985, "985": "Tynamo",
    Eelektrik: 986, "986": "Eelektrik",
    Eelektross: 987, "987": "Eelektross",
    Elgyem: 988, "988": "Elgyem",
    Beheeyem: 989, "989": "Beheeyem",
    Litwick: 990, "990": "Litwick",
    Lampent: 991, "991": "Lampent",
    Chandelure: 992, "992": "Chandelure",
    Axew: 993, "993": "Axew",
    Fraxure: 994, "994": "Fraxure",
    Haxorus: 995, "995": "Haxorus",
    HaxorusMega: 996, "996": "HaxorusMega",
    Cubchoo: 997, "997": "Cubchoo",
    Beartic: 998, "998": "Beartic",
    Polartic: 999, "999": "Polartic",
    PolarticBluemoon: 1000, "1000": "PolarticBluemoon",
    Cryogonal: 1001, "1001": "Cryogonal",
    Shelmet: 1002, "1002": "Shelmet",
    Accelgor: 1003, "1003": "Accelgor",
    Stunfisk: 1004, "1004": "Stunfisk",
    StunfiskGalarian: 1005, "1005": "StunfiskGalarian",
    Mienfoo: 1006, "1006": "Mienfoo",
    Mienshao: 1007, "1007": "Mienshao",
    MienshaoMega: 1008, "1008": "MienshaoMega",
    Druddigon: 1009, "1009": "Druddigon",
    Golett: 1010, "1010": "Golett",
    Golurk: 1011, "1011": "Golurk",
    Pawniard: 1012, "1012": "Pawniard",
    Bisharp: 1013, "1013": "Bisharp",
    Kingambit: 1014, "1014": "Kingambit",
    PawniardRedux: 1015, "1015": "PawniardRedux",
    BisharpRedux: 1016, "1016": "BisharpRedux",
    KingambitRedux: 1017, "1017": "KingambitRedux",
    KingambitReduxMega: 1018, "1018": "KingambitReduxMega",
    Bouffalant: 1019, "1019": "Bouffalant",
    Rufflet: 1020, "1020": "Rufflet",
    Braviary: 1021, "1021": "Braviary",
    BraviaryHisuian: 1022, "1022": "BraviaryHisuian",
    Vullaby: 1023, "1023": "Vullaby",
    Mandibuzz: 1024, "1024": "Mandibuzz",
    Heatmor: 1025, "1025": "Heatmor",
    Durant: 1026, "1026": "Durant",
    Deino: 1027, "1027": "Deino",
    Zweilous: 1028, "1028": "Zweilous",
    Hydreigon: 1029, "1029": "Hydreigon",
    DeinoRedux: 1030, "1030": "DeinoRedux",
    ZweilousRedux: 1031, "1031": "ZweilousRedux",
    HydreigonRedux: 1032, "1032": "HydreigonRedux",
    HydreigonReduxMega: 1033, "1033": "HydreigonReduxMega",
    Larvesta: 1034, "1034": "Larvesta",
    Volcarona: 1035, "1035": "Volcarona",
    Cobalion: 1036, "1036": "Cobalion",
    Terrakion: 1037, "1037": "Terrakion",
    Virizion: 1038, "1038": "Virizion",
    Tornadus: 1039, "1039": "Tornadus",
    TornadusTherian: 1040, "1040": "TornadusTherian",
    Thundurus: 1041, "1041": "Thundurus",
    ThundurusTherian: 1042, "1042": "ThundurusTherian",
    Reshiram: 1043, "1043": "Reshiram",
    Zekrom: 1044, "1044": "Zekrom",
    Landorus: 1045, "1045": "Landorus",
    LandorusTherian: 1046, "1046": "LandorusTherian",
    Kyurem: 1047, "1047": "Kyurem",
    KyuremWhite: 1048, "1048": "KyuremWhite",
    KyuremBlack: 1049, "1049": "KyuremBlack",
    Keldeo: 1050, "1050": "Keldeo",
    KeldeoResolute: 1051, "1051": "KeldeoResolute",
    Meloetta: 1052, "1052": "Meloetta",
    MeloettaPirouette: 1053, "1053": "MeloettaPirouette",
    Genesect: 1054, "1054": "Genesect",
    GenesectDouseDrive: 1055, "1055": "GenesectDouseDrive",
    GenesectShockDrive: 1056, "1056": "GenesectShockDrive",
    GenesectBurnDrive: 1057, "1057": "GenesectBurnDrive",
    GenesectChillDrive: 1058, "1058": "GenesectChillDrive",
    Chespin: 1059, "1059": "Chespin",
    Quilladin: 1060, "1060": "Quilladin",
    Chesnaught: 1061, "1061": "Chesnaught",
    ChesnaughtBattleBond: 1062, "1062": "ChesnaughtBattleBond",
    ChesnaughtClemont: 1063, "1063": "ChesnaughtClemont",
    Fennekin: 1064, "1064": "Fennekin",
    Braixen: 1065, "1065": "Braixen",
    Delphox: 1066, "1066": "Delphox",
    DelphoxBattleBond: 1067, "1067": "DelphoxBattleBond",
    DelphoxSerena: 1068, "1068": "DelphoxSerena",
    Froakie: 1069, "1069": "Froakie",
    Frogadier: 1070, "1070": "Frogadier",
    Greninja: 1071, "1071": "Greninja",
    GreninjaBattleBond: 1072, "1072": "GreninjaBattleBond",
    GreninjaAsh: 1073, "1073": "GreninjaAsh",
    Bunnelby: 1074, "1074": "Bunnelby",
    Diggersby: 1075, "1075": "Diggersby",
    Fletchling: 1076, "1076": "Fletchling",
    Fletchinder: 1077, "1077": "Fletchinder",
    Talonflame: 1078, "1078": "Talonflame",
    Scatterbug: 1079, "1079": "Scatterbug",
    Spewpa: 1080, "1080": "Spewpa",
    Vivillon: 1081, "1081": "Vivillon",
    VivillonPolar: 1082, "1082": "VivillonPolar",
    VivillonTundra: 1083, "1083": "VivillonTundra",
    VivillonContinental: 1084, "1084": "VivillonContinental",
    VivillonGarden: 1085, "1085": "VivillonGarden",
    VivillonElegant: 1086, "1086": "VivillonElegant",
    VivillonMeadow: 1087, "1087": "VivillonMeadow",
    VivillonModern: 1088, "1088": "VivillonModern",
    VivillonMarine: 1089, "1089": "VivillonMarine",
    VivillonArchipelago: 1090, "1090": "VivillonArchipelago",
    VivillonHighPlains: 1091, "1091": "VivillonHighPlains",
    VivillonSandstorm: 1092, "1092": "VivillonSandstorm",
    VivillonRiver: 1093, "1093": "VivillonRiver",
    VivillonMonsoon: 1094, "1094": "VivillonMonsoon",
    VivillonSavanna: 1095, "1095": "VivillonSavanna",
    VivillonSun: 1096, "1096": "VivillonSun",
    VivillonOcean: 1097, "1097": "VivillonOcean",
    VivillonJungle: 1098, "1098": "VivillonJungle",
    VivillonFancy: 1099, "1099": "VivillonFancy",
    VivillonPokeBall: 1100, "1100": "VivillonPokeBall",
    Litleo: 1101, "1101": "Litleo",
    Pyroar: 1102, "1102": "Pyroar",
    Flabebe: 1103, "1103": "Flabebe",
    Floette: 1104, "1104": "Floette",
    Florges: 1105, "1105": "Florges",
    FloetteEternalFlower: 1106, "1106": "FloetteEternalFlower",
    FlabebeYellowFlower: 1107, "1107": "FlabebeYellowFlower",
    FloetteYellowFlower: 1108, "1108": "FloetteYellowFlower",
    FlorgesYellowFlower: 1109, "1109": "FlorgesYellowFlower",
    FlabebeOrangeFlower: 1110, "1110": "FlabebeOrangeFlower",
    FloetteOrangeFlower: 1111, "1111": "FloetteOrangeFlower",
    FlorgesOrangeFlower: 1112, "1112": "FlorgesOrangeFlower",
    FlabebeBlueFlower: 1113, "1113": "FlabebeBlueFlower",
    FloetteBlueFlower: 1114, "1114": "FloetteBlueFlower",
    FlorgesBlueFlower: 1115, "1115": "FlorgesBlueFlower",
    FlabebeWhiteFlower: 1116, "1116": "FlabebeWhiteFlower",
    FloetteWhiteFlower: 1117, "1117": "FloetteWhiteFlower",
    FlorgesWhiteFlower: 1118, "1118": "FlorgesWhiteFlower",
    Skiddo: 1119, "1119": "Skiddo",
    Gogoat: 1120, "1120": "Gogoat",
    Pancham: 1121, "1121": "Pancham",
    Pangoro: 1122, "1122": "Pangoro",
    Furfrou: 1123, "1123": "Furfrou",
    FurfrouHeartTrim: 1124, "1124": "FurfrouHeartTrim",
    FurfrouStarTrim: 1125, "1125": "FurfrouStarTrim",
    FurfrouDiamondTrim: 1126, "1126": "FurfrouDiamondTrim",
    FurfrouDebutanteTrim: 1127, "1127": "FurfrouDebutanteTrim",
    FurfrouMatronTrim: 1128, "1128": "FurfrouMatronTrim",
    FurfrouDandyTrim: 1129, "1129": "FurfrouDandyTrim",
    FurfrouLaReineTrim: 1130, "1130": "FurfrouLaReineTrim",
    FurfrouKabukiTrim: 1131, "1131": "FurfrouKabukiTrim",
    FurfrouPharaohTrim: 1132, "1132": "FurfrouPharaohTrim",
    Espurr: 1133, "1133": "Espurr",
    Meowstic: 1134, "1134": "Meowstic",
    MeowsticFemale: 1135, "1135": "MeowsticFemale",
    Honedge: 1136, "1136": "Honedge",
    Doublade: 1137, "1137": "Doublade",
    Aegislash: 1138, "1138": "Aegislash",
    AegislashBlade: 1139, "1139": "AegislashBlade",
    HonedgeRedux: 1140, "1140": "HonedgeRedux",
    DoubladeRedux: 1141, "1141": "DoubladeRedux",
    AegislashRedux: 1142, "1142": "AegislashRedux",
    AegislashBladeRedux: 1143, "1143": "AegislashBladeRedux",
    AegislashReduxMega: 1144, "1144": "AegislashReduxMega",
    AegislashBladeReduxMega: 1145, "1145": "AegislashBladeReduxMega",
    Spritzee: 1146, "1146": "Spritzee",
    Aromatisse: 1147, "1147": "Aromatisse",
    Swirlix: 1148, "1148": "Swirlix",
    Slurpuff: 1149, "1149": "Slurpuff",
    Inkay: 1150, "1150": "Inkay",
    Malamar: 1151, "1151": "Malamar",
    Binacle: 1152, "1152": "Binacle",
    Barbaracle: 1153, "1153": "Barbaracle",
    Skrelp: 1154, "1154": "Skrelp",
    Dragalge: 1155, "1155": "Dragalge",
    Clauncher: 1156, "1156": "Clauncher",
    Clawitzer: 1157, "1157": "Clawitzer",
    ClawitzerRedux: 1158, "1158": "ClawitzerRedux",
    Helioptile: 1159, "1159": "Helioptile",
    Heliolisk: 1160, "1160": "Heliolisk",
    Tyrunt: 1161, "1161": "Tyrunt",
    Tyrantrum: 1162, "1162": "Tyrantrum",
    Amaura: 1163, "1163": "Amaura",
    Aurorus: 1164, "1164": "Aurorus",
    Sylveon: 1165, "1165": "Sylveon",
    Hawlucha: 1166, "1166": "Hawlucha",
    Dedenne: 1167, "1167": "Dedenne",
    Carbink: 1168, "1168": "Carbink",
    Goomy: 1169, "1169": "Goomy",
    Sliggoo: 1170, "1170": "Sliggoo",
    Goodra: 1171, "1171": "Goodra",
    SliggooHisuian: 1172, "1172": "SliggooHisuian",
    GoodraHisuian: 1173, "1173": "GoodraHisuian",
    Klefki: 1174, "1174": "Klefki",
    Phantump: 1175, "1175": "Phantump",
    Trevenant: 1176, "1176": "Trevenant",
    Pumpkaboo: 1177, "1177": "Pumpkaboo",
    Gourgeist: 1178, "1178": "Gourgeist",
    PumpkabooSmall: 1179, "1179": "PumpkabooSmall",
    GourgeistSmall: 1180, "1180": "GourgeistSmall",
    PumpkabooLarge: 1181, "1181": "PumpkabooLarge",
    GourgeistLarge: 1182, "1182": "GourgeistLarge",
    PumpkabooSuper: 1183, "1183": "PumpkabooSuper",
    GourgeistSuper: 1184, "1184": "GourgeistSuper",
    Bergmite: 1185, "1185": "Bergmite",
    Avalugg: 1186, "1186": "Avalugg",
    AvaluggHisuian: 1187, "1187": "AvaluggHisuian",
    Noibat: 1188, "1188": "Noibat",
    Noivern: 1189, "1189": "Noivern",
    NoibatRedux: 1190, "1190": "NoibatRedux",
    NoivernRedux: 1191, "1191": "NoivernRedux",
    Xerneas: 1192, "1192": "Xerneas",
    XerneasActive: 1193, "1193": "XerneasActive",
    Yveltal: 1194, "1194": "Yveltal",
    YveltalMega: 1195, "1195": "YveltalMega",
    Zygarde: 1196, "1196": "Zygarde",
    Zygarde10: 1197, "1197": "Zygarde10",
    Zygarde10PowerConstruct: 1198, "1198": "Zygarde10PowerConstruct",
    Zygarde50PowerConstruct: 1199, "1199": "Zygarde50PowerConstruct",
    ZygardeComplete: 1200, "1200": "ZygardeComplete",
    Diancie: 1201, "1201": "Diancie",
    DiancieMega: 1202, "1202": "DiancieMega",
    Hoopa: 1203, "1203": "Hoopa",
    HoopaUnbound: 1204, "1204": "HoopaUnbound",
    Volcanion: 1205, "1205": "Volcanion",
    Rowlet: 1206, "1206": "Rowlet",
    Dartrix: 1207, "1207": "Dartrix",
    Decidueye: 1208, "1208": "Decidueye",
    DecidueyeMega: 1209, "1209": "DecidueyeMega",
    DecidueyeHisuian: 1210, "1210": "DecidueyeHisuian",
    DecidueyeHisuianMega: 1211, "1211": "DecidueyeHisuianMega",
    Litten: 1212, "1212": "Litten",
    Torracat: 1213, "1213": "Torracat",
    Incineroar: 1214, "1214": "Incineroar",
    IncineroarMega: 1215, "1215": "IncineroarMega",
    Popplio: 1216, "1216": "Popplio",
    Brionne: 1217, "1217": "Brionne",
    Primarina: 1218, "1218": "Primarina",
    PrimarinaMega: 1219, "1219": "PrimarinaMega",
    Pikipek: 1220, "1220": "Pikipek",
    Trumbeak: 1221, "1221": "Trumbeak",
    Toucannon: 1222, "1222": "Toucannon",
    ToucannonMega: 1223, "1223": "ToucannonMega",
    Yungoos: 1224, "1224": "Yungoos",
    Gumshoos: 1225, "1225": "Gumshoos",
    Grubbin: 1226, "1226": "Grubbin",
    Charjabug: 1227, "1227": "Charjabug",
    Vikavolt: 1228, "1228": "Vikavolt",
    Crabrawler: 1229, "1229": "Crabrawler",
    Crabominable: 1230, "1230": "Crabominable",
    CrabrawlerRedux: 1231, "1231": "CrabrawlerRedux",
    CrabominableRedux: 1232, "1232": "CrabominableRedux",
    Oricorio: 1233, "1233": "Oricorio",
    OricorioPomPom: 1234, "1234": "OricorioPomPom",
    OricorioPau: 1235, "1235": "OricorioPau",
    OricorioSensu: 1236, "1236": "OricorioSensu",
    OricorioMega: 1237, "1237": "OricorioMega",
    Cutiefly: 1238, "1238": "Cutiefly",
    Ribombee: 1239, "1239": "Ribombee",
    RibombeeRedux: 1240, "1240": "RibombeeRedux",
    RibombeeReduxMega: 1241, "1241": "RibombeeReduxMega",
    RibombeeMega: 1242, "1242": "RibombeeMega",
    Rockruff: 1243, "1243": "Rockruff",
    Lycanroc: 1244, "1244": "Lycanroc",
    LycanrocMidnight: 1245, "1245": "LycanrocMidnight",
    LycanrocDusk: 1246, "1246": "LycanrocDusk",
    LycanrocEclipse: 1247, "1247": "LycanrocEclipse",
    LycanrocTwilight: 1248, "1248": "LycanrocTwilight",
    RockruffOwnTempo: 1249, "1249": "RockruffOwnTempo",
    Wishiwashi: 1250, "1250": "Wishiwashi",
    WishiwashiSchool: 1251, "1251": "WishiwashiSchool",
    Mareanie: 1252, "1252": "Mareanie",
    Toxapex: 1253, "1253": "Toxapex",
    Mudbray: 1254, "1254": "Mudbray",
    Mudsdale: 1255, "1255": "Mudsdale",
    Dewpider: 1256, "1256": "Dewpider",
    Araquanid: 1257, "1257": "Araquanid",
    DewpiderRedux: 1258, "1258": "DewpiderRedux",
    AraquanidRedux: 1259, "1259": "AraquanidRedux",
    Fomantis: 1260, "1260": "Fomantis",
    Lurantis: 1261, "1261": "Lurantis",
    Morelull: 1262, "1262": "Morelull",
    Shiinotic: 1263, "1263": "Shiinotic",
    Salandit: 1264, "1264": "Salandit",
    Salazzle: 1265, "1265": "Salazzle",
    Stufful: 1266, "1266": "Stufful",
    Bewear: 1267, "1267": "Bewear",
    BewearAngry: 1268, "1268": "BewearAngry",
    StuffulRedux: 1269, "1269": "StuffulRedux",
    BewearRedux: 1270, "1270": "BewearRedux",
    Bounsweet: 1271, "1271": "Bounsweet",
    Steenee: 1272, "1272": "Steenee",
    Tsareena: 1273, "1273": "Tsareena",
    BounsweetRedux: 1274, "1274": "BounsweetRedux",
    SteeneeRedux: 1275, "1275": "SteeneeRedux",
    TsareenaRedux: 1276, "1276": "TsareenaRedux",
    TsareenaReduxMega: 1277, "1277": "TsareenaReduxMega",
    Comfey: 1278, "1278": "Comfey",
    Oranguru: 1279, "1279": "Oranguru",
    Passimian: 1280, "1280": "Passimian",
    Wimpod: 1281, "1281": "Wimpod",
    Golisopod: 1282, "1282": "Golisopod",
    GolisopodMega: 1283, "1283": "GolisopodMega",
    Sandygast: 1284, "1284": "Sandygast",
    Palossand: 1285, "1285": "Palossand",
    Pyukumuku: 1286, "1286": "Pyukumuku",
    TypeNull: 1287, "1287": "TypeNull",
    Silvally: 1288, "1288": "Silvally",
    SilvallyFighting: 1289, "1289": "SilvallyFighting",
    SilvallyFlying: 1290, "1290": "SilvallyFlying",
    SilvallyPoison: 1291, "1291": "SilvallyPoison",
    SilvallyGround: 1292, "1292": "SilvallyGround",
    SilvallyRock: 1293, "1293": "SilvallyRock",
    SilvallyBug: 1294, "1294": "SilvallyBug",
    SilvallyGhost: 1295, "1295": "SilvallyGhost",
    SilvallySteel: 1296, "1296": "SilvallySteel",
    SilvallyFire: 1297, "1297": "SilvallyFire",
    SilvallyWater: 1298, "1298": "SilvallyWater",
    SilvallyGrass: 1299, "1299": "SilvallyGrass",
    SilvallyElectric: 1300, "1300": "SilvallyElectric",
    SilvallyPsychic: 1301, "1301": "SilvallyPsychic",
    SilvallyIce: 1302, "1302": "SilvallyIce",
    SilvallyDragon: 1303, "1303": "SilvallyDragon",
    SilvallyDark: 1304, "1304": "SilvallyDark",
    SilvallyFairy: 1305, "1305": "SilvallyFairy",
    Minior: 1306, "1306": "Minior",
    MiniorMeteorOrange: 1307, "1307": "MiniorMeteorOrange",
    MiniorMeteorYellow: 1308, "1308": "MiniorMeteorYellow",
    MiniorMeteorGreen: 1309, "1309": "MiniorMeteorGreen",
    MiniorMeteorBlue: 1310, "1310": "MiniorMeteorBlue",
    MiniorMeteorIndigo: 1311, "1311": "MiniorMeteorIndigo",
    MiniorMeteorViolet: 1312, "1312": "MiniorMeteorViolet",
    MiniorCoreRed: 1313, "1313": "MiniorCoreRed",
    MiniorCoreOrange: 1314, "1314": "MiniorCoreOrange",
    MiniorCoreYellow: 1315, "1315": "MiniorCoreYellow",
    MiniorCoreGreen: 1316, "1316": "MiniorCoreGreen",
    MiniorCoreBlue: 1317, "1317": "MiniorCoreBlue",
    MiniorCoreIndigo: 1318, "1318": "MiniorCoreIndigo",
    MiniorCoreViolet: 1319, "1319": "MiniorCoreViolet",
    Komala: 1320, "1320": "Komala",
    Turtonator: 1321, "1321": "Turtonator",
    Togedemaru: 1322, "1322": "Togedemaru",
    Mimikyu: 1323, "1323": "Mimikyu",
    MimikyuBusted: 1324, "1324": "MimikyuBusted",
    MimikyuApex: 1325, "1325": "MimikyuApex",
    MimikyuRayquaza: 1326, "1326": "MimikyuRayquaza",
    MimikyuApexBusted: 1327, "1327": "MimikyuApexBusted",
    MimikyuRayquazaBusted: 1328, "1328": "MimikyuRayquazaBusted",
    Bruxish: 1329, "1329": "Bruxish",
    Drampa: 1330, "1330": "Drampa",
    Dhelmise: 1331, "1331": "Dhelmise",
    JangmoO: 1332, "1332": "JangmoO",
    HakamoO: 1333, "1333": "HakamoO",
    KommoO: 1334, "1334": "KommoO",
    TapuKoko: 1335, "1335": "TapuKoko",
    TapuLele: 1336, "1336": "TapuLele",
    TapuBulu: 1337, "1337": "TapuBulu",
    TapuFini: 1338, "1338": "TapuFini",
    Cosmog: 1339, "1339": "Cosmog",
    Cosmoem: 1340, "1340": "Cosmoem",
    Solgaleo: 1341, "1341": "Solgaleo",
    Lunala: 1342, "1342": "Lunala",
    Nihilego: 1343, "1343": "Nihilego",
    Buzzwole: 1344, "1344": "Buzzwole",
    Pheromosa: 1345, "1345": "Pheromosa",
    Xurkitree: 1346, "1346": "Xurkitree",
    Celesteela: 1347, "1347": "Celesteela",
    Kartana: 1348, "1348": "Kartana",
    KartanaFallen: 1349, "1349": "KartanaFallen",
    Guzzlord: 1350, "1350": "Guzzlord",
    Necrozma: 1351, "1351": "Necrozma",
    NecrozmaDuskMane: 1352, "1352": "NecrozmaDuskMane",
    NecrozmaUltra: 1353, "1353": "NecrozmaUltra",
    NecrozmaDawnWings: 1354, "1354": "NecrozmaDawnWings",
    Magearna: 1355, "1355": "Magearna",
    MagearnaOriginalColor: 1356, "1356": "MagearnaOriginalColor",
    Marshadow: 1357, "1357": "Marshadow",
    Poipole: 1358, "1358": "Poipole",
    Naganadel: 1359, "1359": "Naganadel",
    Stakataka: 1360, "1360": "Stakataka",
    Blacephalon: 1361, "1361": "Blacephalon",
    Zeraora: 1362, "1362": "Zeraora",
    Meltan: 1363, "1363": "Meltan",
    Melmetal: 1364, "1364": "Melmetal",
    MelmetalMega: 1365, "1365": "MelmetalMega",
    Grookey: 1366, "1366": "Grookey",
    Thwackey: 1367, "1367": "Thwackey",
    Rillaboom: 1368, "1368": "Rillaboom",
    RillaboomMega: 1369, "1369": "RillaboomMega",
    Scorbunny: 1370, "1370": "Scorbunny",
    Raboot: 1371, "1371": "Raboot",
    Cinderace: 1372, "1372": "Cinderace",
    CinderaceMega: 1373, "1373": "CinderaceMega",
    Sobble: 1374, "1374": "Sobble",
    Drizzile: 1375, "1375": "Drizzile",
    Inteleon: 1376, "1376": "Inteleon",
    InteleonMega: 1377, "1377": "InteleonMega",
    Skwovet: 1378, "1378": "Skwovet",
    Greedent: 1379, "1379": "Greedent",
    Rookidee: 1380, "1380": "Rookidee",
    Corvisquire: 1381, "1381": "Corvisquire",
    Corviknight: 1382, "1382": "Corviknight",
    CorviknightMega: 1383, "1383": "CorviknightMega",
    Blipbug: 1384, "1384": "Blipbug",
    Dottler: 1385, "1385": "Dottler",
    Orbeetle: 1386, "1386": "Orbeetle",
    OrbeetleMega: 1387, "1387": "OrbeetleMega",
    Nickit: 1388, "1388": "Nickit",
    Thievul: 1389, "1389": "Thievul",
    Gossifleur: 1390, "1390": "Gossifleur",
    Eldegoss: 1391, "1391": "Eldegoss",
    Wooloo: 1392, "1392": "Wooloo",
    Dubwool: 1393, "1393": "Dubwool",
    Chewtle: 1394, "1394": "Chewtle",
    Drednaw: 1395, "1395": "Drednaw",
    DrednawMega: 1396, "1396": "DrednawMega",
    Yamper: 1397, "1397": "Yamper",
    Boltund: 1398, "1398": "Boltund",
    Rolycoly: 1399, "1399": "Rolycoly",
    Carkol: 1400, "1400": "Carkol",
    Coalossal: 1401, "1401": "Coalossal",
    CoalossalMega: 1402, "1402": "CoalossalMega",
    Applin: 1403, "1403": "Applin",
    Flapple: 1404, "1404": "Flapple",
    Appletun: 1405, "1405": "Appletun",
    Silicobra: 1406, "1406": "Silicobra",
    Sandaconda: 1407, "1407": "Sandaconda",
    SandacondaMega: 1408, "1408": "SandacondaMega",
    Cramorant: 1409, "1409": "Cramorant",
    CramorantGulping: 1410, "1410": "CramorantGulping",
    CramorantGorging: 1411, "1411": "CramorantGorging",
    Arrokuda: 1412, "1412": "Arrokuda",
    Barraskewda: 1413, "1413": "Barraskewda",
    Toxel: 1414, "1414": "Toxel",
    Toxtricity: 1415, "1415": "Toxtricity",
    ToxtricityMega: 1416, "1416": "ToxtricityMega",
    ToxtricityLowKey: 1417, "1417": "ToxtricityLowKey",
    ToxelRedux: 1418, "1418": "ToxelRedux",
    ToxtricityRedux: 1419, "1419": "ToxtricityRedux",
    ToxtricityReduxMega: 1420, "1420": "ToxtricityReduxMega",
    ToxtricityReduxFuzz: 1421, "1421": "ToxtricityReduxFuzz",
    ToxtricityReduxFuzzMega: 1422, "1422": "ToxtricityReduxFuzzMega",
    Sizzlipede: 1423, "1423": "Sizzlipede",
    Centiskorch: 1424, "1424": "Centiskorch",
    CentiskorchMega: 1425, "1425": "CentiskorchMega",
    Clobbopus: 1426, "1426": "Clobbopus",
    Grapploct: 1427, "1427": "Grapploct",
    Sinistea: 1428, "1428": "Sinistea",
    Polteageist: 1429, "1429": "Polteageist",
    SinisteaAntique: 1430, "1430": "SinisteaAntique",
    PolteageistAntique: 1431, "1431": "PolteageistAntique",
    Hatenna: 1432, "1432": "Hatenna",
    Hattrem: 1433, "1433": "Hattrem",
    Hatterene: 1434, "1434": "Hatterene",
    HattereneMega: 1435, "1435": "HattereneMega",
    Impidimp: 1436, "1436": "Impidimp",
    Morgrem: 1437, "1437": "Morgrem",
    Grimmsnarl: 1438, "1438": "Grimmsnarl",
    GrimmsnarlMega: 1439, "1439": "GrimmsnarlMega",
    Obstagoon: 1440, "1440": "Obstagoon",
    Perrserker: 1441, "1441": "Perrserker",
    Cursola: 1442, "1442": "Cursola",
    Sirfetchd: 1443, "1443": "Sirfetchd",
    MrRime: 1444, "1444": "MrRime",
    Runerigus: 1445, "1445": "Runerigus",
    Milcery: 1446, "1446": "Milcery",
    Alcremie: 1447, "1447": "Alcremie",
    AlcremieMega: 1448, "1448": "AlcremieMega",
    AlcremieRubyCream: 1449, "1449": "AlcremieRubyCream",
    AlcremieMatchaCream: 1450, "1450": "AlcremieMatchaCream",
    AlcremieMintCream: 1451, "1451": "AlcremieMintCream",
    AlcremieLemonCream: 1452, "1452": "AlcremieLemonCream",
    AlcremieSaltedCream: 1453, "1453": "AlcremieSaltedCream",
    AlcremieRubySwirl: 1454, "1454": "AlcremieRubySwirl",
    AlcremieCaramelSwirl: 1455, "1455": "AlcremieCaramelSwirl",
    AlcremieRainbowSwirl: 1456, "1456": "AlcremieRainbowSwirl",
    Falinks: 1457, "1457": "Falinks",
    Pincurchin: 1458, "1458": "Pincurchin",
    Snom: 1459, "1459": "Snom",
    Frosmoth: 1460, "1460": "Frosmoth",
    Stonjourner: 1461, "1461": "Stonjourner",
    Eiscue: 1462, "1462": "Eiscue",
    EiscueNoiceFace: 1463, "1463": "EiscueNoiceFace",
    Indeedee: 1464, "1464": "Indeedee",
    IndeedeeFemale: 1465, "1465": "IndeedeeFemale",
    Morpeko: 1466, "1466": "Morpeko",
    Morpekyll: 1467, "1467": "Morpekyll",
    MorpekyllHangry: 1468, "1468": "MorpekyllHangry",
    MorpekoHangry: 1469, "1469": "MorpekoHangry",
    Cufant: 1470, "1470": "Cufant",
    Copperajah: 1471, "1471": "Copperajah",
    CopperajahMega: 1472, "1472": "CopperajahMega",
    Dracozolt: 1473, "1473": "Dracozolt",
    Arctozolt: 1474, "1474": "Arctozolt",
    Dracovish: 1475, "1475": "Dracovish",
    DracovishMega: 1476, "1476": "DracovishMega",
    Arctovish: 1477, "1477": "Arctovish",
    Duraludon: 1478, "1478": "Duraludon",
    DuraludonPartner: 1479, "1479": "DuraludonPartner",
    DuraludonPartnerMega: 1480, "1480": "DuraludonPartnerMega",
    Dreepy: 1481, "1481": "Dreepy",
    Drakloak: 1482, "1482": "Drakloak",
    Dragapult: 1483, "1483": "Dragapult",
    Zacian: 1484, "1484": "Zacian",
    ZacianCrownedSword: 1485, "1485": "ZacianCrownedSword",
    Zamazenta: 1486, "1486": "Zamazenta",
    ZamazentaCrownedShield: 1487, "1487": "ZamazentaCrownedShield",
    Eternatus: 1488, "1488": "Eternatus",
    EternatusEternamax: 1489, "1489": "EternatusEternamax",
    Kubfu: 1490, "1490": "Kubfu",
    Urshifu: 1491, "1491": "Urshifu",
    UrshifuMega: 1492, "1492": "UrshifuMega",
    UrshifuRapidStrikeStyle: 1493, "1493": "UrshifuRapidStrikeStyle",
    UrshifuRapidStrikeStyleMega: 1494, "1494": "UrshifuRapidStrikeStyleMega",
    Zarude: 1495, "1495": "Zarude",
    ZarudeDada: 1496, "1496": "ZarudeDada",
    Regieleki: 1497, "1497": "Regieleki",
    Regidrago: 1498, "1498": "Regidrago",
    Glastrier: 1499, "1499": "Glastrier",
    Spectrier: 1500, "1500": "Spectrier",
    SpectrierCloud: 1501, "1501": "SpectrierCloud",
    Calyrex: 1502, "1502": "Calyrex",
    CalyrexCloudRider: 1503, "1503": "CalyrexCloudRider",
    CalyrexIceRider: 1504, "1504": "CalyrexIceRider",
    CalyrexShadowRider: 1505, "1505": "CalyrexShadowRider",
    Wyrdeer: 1506, "1506": "Wyrdeer",
    Kleavor: 1507, "1507": "Kleavor",
    Sneasler: 1508, "1508": "Sneasler",
    Overqwil: 1509, "1509": "Overqwil",
    Enamorus: 1510, "1510": "Enamorus",
    EnamorusTherian: 1511, "1511": "EnamorusTherian",
    Sprigatito: 1512, "1512": "Sprigatito",
    Floragato: 1513, "1513": "Floragato",
    Meowscarada: 1514, "1514": "Meowscarada",
    MeowscaradaMega: 1515, "1515": "MeowscaradaMega",
    Fuecoco: 1516, "1516": "Fuecoco",
    Crocalor: 1517, "1517": "Crocalor",
    Skeledirge: 1518, "1518": "Skeledirge",
    SkeledirgeMega: 1519, "1519": "SkeledirgeMega",
    Quaxly: 1520, "1520": "Quaxly",
    Quaxwell: 1521, "1521": "Quaxwell",
    Quaquaval: 1522, "1522": "Quaquaval",
    QuaquavalMega: 1523, "1523": "QuaquavalMega",
    Lechonk: 1524, "1524": "Lechonk",
    Oinkologne: 1525, "1525": "Oinkologne",
    Tarountula: 1526, "1526": "Tarountula",
    Spidops: 1527, "1527": "Spidops",
    Nymble: 1528, "1528": "Nymble",
    Lokix: 1529, "1529": "Lokix",
    Pawmi: 1530, "1530": "Pawmi",
    Pawmo: 1531, "1531": "Pawmo",
    Pawmot: 1532, "1532": "Pawmot",
    Tandemaus: 1533, "1533": "Tandemaus",
    Maushold: 1534, "1534": "Maushold",
    MausholdFour: 1535, "1535": "MausholdFour",
    Fidough: 1536, "1536": "Fidough",
    FidoughPartner: 1537, "1537": "FidoughPartner",
    FidoughPartnerMega: 1538, "1538": "FidoughPartnerMega",
    Dachsbun: 1539, "1539": "Dachsbun",
    Smoliv: 1540, "1540": "Smoliv",
    Dolliv: 1541, "1541": "Dolliv",
    Arboliva: 1542, "1542": "Arboliva",
    Squawkabilly: 1543, "1543": "Squawkabilly",
    SquawkabillyWhitePlumage: 1544, "1544": "SquawkabillyWhitePlumage",
    SquawkabillyYellowPlumage: 1545, "1545": "SquawkabillyYellowPlumage",
    SquawkabillyBluePlumage: 1546, "1546": "SquawkabillyBluePlumage",
    SquawkabillyGreenPlumage: 1547, "1547": "SquawkabillyGreenPlumage",
    Nacli: 1548, "1548": "Nacli",
    Naclstack: 1549, "1549": "Naclstack",
    Garganacl: 1550, "1550": "Garganacl",
    Charcadet: 1551, "1551": "Charcadet",
    Armarouge: 1552, "1552": "Armarouge",
    Ceruledge: 1553, "1553": "Ceruledge",
    Tadbulb: 1554, "1554": "Tadbulb",
    Bellibolt: 1555, "1555": "Bellibolt",
    Wattrel: 1556, "1556": "Wattrel",
    Kilowattrel: 1557, "1557": "Kilowattrel",
    Maschiff: 1558, "1558": "Maschiff",
    Mabosstiff: 1559, "1559": "Mabosstiff",
    Shroodle: 1560, "1560": "Shroodle",
    Grafaiai: 1561, "1561": "Grafaiai",
    Bramblin: 1562, "1562": "Bramblin",
    Brambleghast: 1563, "1563": "Brambleghast",
    Toedscool: 1564, "1564": "Toedscool",
    Toedscruel: 1565, "1565": "Toedscruel",
    Klawf: 1566, "1566": "Klawf",
    Capsakid: 1567, "1567": "Capsakid",
    Scovillain: 1568, "1568": "Scovillain",
    Rellor: 1569, "1569": "Rellor",
    Rabsca: 1570, "1570": "Rabsca",
    Flittle: 1571, "1571": "Flittle",
    Espathra: 1572, "1572": "Espathra",
    Tinkatink: 1573, "1573": "Tinkatink",
    Tinkatuff: 1574, "1574": "Tinkatuff",
    Tinkaton: 1575, "1575": "Tinkaton",
    TinkatonMega: 1576, "1576": "TinkatonMega",
    Wiglett: 1577, "1577": "Wiglett",
    Wugtrio: 1578, "1578": "Wugtrio",
    Bombirdier: 1579, "1579": "Bombirdier",
    Finizen: 1580, "1580": "Finizen",
    Palafin: 1581, "1581": "Palafin",
    PalafinHero: 1582, "1582": "PalafinHero",
    Varoom: 1583, "1583": "Varoom",
    Revavroom: 1584, "1584": "Revavroom",
    Cyclizar: 1585, "1585": "Cyclizar",
    Orthworm: 1586, "1586": "Orthworm",
    Glimmet: 1587, "1587": "Glimmet",
    Glimmora: 1588, "1588": "Glimmora",
    Greavard: 1589, "1589": "Greavard",
    Houndstone: 1590, "1590": "Houndstone",
    Flamigo: 1591, "1591": "Flamigo",
    Cetoddle: 1592, "1592": "Cetoddle",
    Cetitan: 1593, "1593": "Cetitan",
    Veluza: 1594, "1594": "Veluza",
    Dondozo: 1595, "1595": "Dondozo",
    Tatsugiri: 1596, "1596": "Tatsugiri",
    TatsugiriCurly: 1597, "1597": "TatsugiriCurly",
    TatsugiriDroopy: 1598, "1598": "TatsugiriDroopy",
    TatsugiriStretchy: 1599, "1599": "TatsugiriStretchy",
    Annihilape: 1600, "1600": "Annihilape",
    Clodsire: 1601, "1601": "Clodsire",
    Farigiraf: 1602, "1602": "Farigiraf",
    GreatTusk: 1603, "1603": "GreatTusk",
    ScreamTail: 1604, "1604": "ScreamTail",
    BruteBonnet: 1605, "1605": "BruteBonnet",
    FlutterMane: 1606, "1606": "FlutterMane",
    SlitherWing: 1607, "1607": "SlitherWing",
    SandyShocks: 1608, "1608": "SandyShocks",
    IronTreads: 1609, "1609": "IronTreads",
    IronBundle: 1610, "1610": "IronBundle",
    IronHands: 1611, "1611": "IronHands",
    IronJugulis: 1612, "1612": "IronJugulis",
    IronMoth: 1613, "1613": "IronMoth",
    IronThorns: 1614, "1614": "IronThorns",
    Frigibax: 1615, "1615": "Frigibax",
    Arctibax: 1616, "1616": "Arctibax",
    Baxcalibur: 1617, "1617": "Baxcalibur",
    Gimmighoul: 1618, "1618": "Gimmighoul",
    GimmighoulRoaming: 1619, "1619": "GimmighoulRoaming",
    Gholdengo: 1620, "1620": "Gholdengo",
    WoChien: 1621, "1621": "WoChien",
    ChienPao: 1622, "1622": "ChienPao",
    ChienPaoMega: 1623, "1623": "ChienPaoMega",
    TingLu: 1624, "1624": "TingLu",
    ChiYu: 1625, "1625": "ChiYu",
    RoaringMoon: 1626, "1626": "RoaringMoon",
    IronValiant: 1627, "1627": "IronValiant",
    Koraidon: 1628, "1628": "Koraidon",
    Miraidon: 1629, "1629": "Miraidon",
    WalkingWake: 1630, "1630": "WalkingWake",
    IronLeaves: 1631, "1631": "IronLeaves",
    Dipplin: 1632, "1632": "Dipplin",
    Poltchageist: 1633, "1633": "Poltchageist",
    Sinistcha: 1634, "1634": "Sinistcha",
    Okidogi: 1635, "1635": "Okidogi",
    Munkidori: 1636, "1636": "Munkidori",
    Fezandipiti: 1637, "1637": "Fezandipiti",
    Ogerpon: 1638, "1638": "Ogerpon",
    OgerponHearthflameMask: 1639, "1639": "OgerponHearthflameMask",
    OgerponCornerstoneMask: 1640, "1640": "OgerponCornerstoneMask",
    OgerponWellspringMask: 1641, "1641": "OgerponWellspringMask",
    OgerponMega: 1642, "1642": "OgerponMega",
    OgerponHearthflameMaskMega: 1643, "1643": "OgerponHearthflameMaskMega",
    OgerponCornerstoneMaskMega: 1644, "1644": "OgerponCornerstoneMaskMega",
    OgerponWellspringMaskMega: 1645, "1645": "OgerponWellspringMaskMega",
    Archaludon: 1646, "1646": "Archaludon",
    Hydrapple: 1647, "1647": "Hydrapple",
    GougingFire: 1648, "1648": "GougingFire",
    RagingBolt: 1649, "1649": "RagingBolt",
    IronBoulder: 1650, "1650": "IronBoulder",
    IronCrown: 1651, "1651": "IronCrown",
    Terapagos: 1652, "1652": "Terapagos",
    TerapagosStellar: 1653, "1653": "TerapagosStellar",
    Pecharunt: 1654, "1654": "Pecharunt",
    Phantowl: 1655, "1655": "Phantowl",
    Duelumber: 1656, "1656": "Duelumber",
    Arachtres: 1657, "1657": "Arachtres",
    Flairgrance: 1658, "1658": "Flairgrance",
    Arashinne: 1659, "1659": "Arashinne",
    Dreadnaut: 1660, "1660": "Dreadnaut",
    Boarlock: 1661, "1661": "Boarlock",
    Heliosunny: 1662, "1662": "Heliosunny",
    Sopranice: 1663, "1663": "Sopranice",
    Beefender: 1664, "1664": "Beefender",
    Salazarus: 1665, "1665": "Salazarus",
    Gooschase: 1666, "1666": "Gooschase",
    Lepastry: 1667, "1667": "Lepastry",
    Tortemple: 1668, "1668": "Tortemple",
    Brontonana: 1669, "1669": "Brontonana",
    Dredwood: 1670, "1670": "Dredwood",
    Corm: 1671, "1671": "Corm",
    Cormoth: 1672, "1672": "Cormoth",
    Popcorm: 1673, "1673": "Popcorm",
    CormothMega: 1674, "1674": "CormothMega",
    PopcormMega: 1675, "1675": "PopcormMega",
    BlizzardMaw: 1676, "1676": "BlizzardMaw",
    LumberingSloth: 1677, "1677": "LumberingSloth",
    LumberingSlothEngulfed: 1678, "1678": "LumberingSlothEngulfed",
    IronCarapace: 1679, "1679": "IronCarapace",
    Magmenous: 1680, "1680": "Magmenous",
    Kaiosea: 1681, "1681": "Kaiosea",
    Slyduck: 1682, "1682": "Slyduck",
    Shyduck: 1683, "1683": "Shyduck",
    Marbeep: 1684, "1684": "Marbeep",
    Fluffbee: 1685, "1685": "Fluffbee",
    Amphybuzz: 1686, "1686": "Amphybuzz",
    AmphybuzzMega: 1687, "1687": "AmphybuzzMega",
    Bariong: 1688, "1688": "Bariong",
    Crabonination: 1689, "1689": "Crabonination",
    Phanfernal: 1690, "1690": "Phanfernal",
    Skulberus: 1691, "1691": "Skulberus",
    Velozel: 1692, "1692": "Velozel",
    Bewarden: 1693, "1693": "Bewarden",
    Bubbleo: 1694, "1694": "Bubbleo",
    Hydroar: 1695, "1695": "Hydroar",
    HydroarF: 1696, "1696": "HydroarF",
    Granitun: 1697, "1697": "Granitun",
    Fujiflap: 1698, "1698": "Fujiflap",
    Knaiver: 1699, "1699": "Knaiver",
    Scizor: 1700, "1700": "Scizor",
    ScizorMega: 1701, "1701": "ScizorMega",
    Sagaracas: 1702, "1702": "Sagaracas",
    Luminositeon: 1703, "1703": "Luminositeon",
    Crawdauntles: 1704, "1704": "Crawdauntles",
    IronVoca: 1705, "1705": "IronVoca",
    Frostula: 1706, "1706": "Frostula",
    WeavileMega: 1707, "1707": "WeavileMega",
    SamurottMega: 1708, "1708": "SamurottMega",
    ArcanineMega: 1709, "1709": "ArcanineMega",
    GoodraMega: 1710, "1710": "GoodraMega",
    SlowbroMegaGalarian: 1711, "1711": "SlowbroMegaGalarian",
    SlowkingMegaGalarian: 1712, "1712": "SlowkingMegaGalarian",
    IronExo: 1713, "1713": "IronExo",
    Dududunsparce: 1714, "1714": "Dududunsparce",
    DududunsparceMega: 1715, "1715": "DududunsparceMega",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const Terrain = Object.freeze({
    None: 0, "0": "None",
    Electric: 1, "1": "Electric",
    Grassy: 2, "2": "Grassy",
    Psychic: 3, "3": "Psychic",
    Misty: 4, "4": "Misty",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
 */
export const Weather = Object.freeze({
    None: 0, "0": "None",
    Sand: 1, "1": "Sand",
    Sun: 2, "2": "Sun",
    Rain: 3, "3": "Rain",
    Hail: 4, "4": "Hail",
    Snow: 5, "5": "Snow",
    HarshSunshine: 6, "6": "HarshSunshine",
    HeavyRain: 7, "7": "HeavyRain",
    StrongWings: 8, "8": "StrongWings",
});

const FieldFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_field_free(ptr >>> 0, 1));

export class Field {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FieldFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_field_free(ptr, 0);
    }
    /**
     * @returns {Terrain}
     */
    get terrain() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_field_terrain(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Terrain} arg0
     */
    set terrain(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_field_terrain(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {GameType}
     */
    get game_type() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_field_game_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {GameType} arg0
     */
    set game_type(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_field_game_type(this.__wbg_ptr, arg0);
    }
}

const MoveFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_move_free(ptr >>> 0, 1));

export class Move {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MoveFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_move_free(ptr, 0);
    }
}

const MoveFlagsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_moveflags_free(ptr >>> 0, 1));

export class MoveFlags {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MoveFlagsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_moveflags_free(ptr, 0);
    }
}

const PokemonFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pokemon_free(ptr >>> 0, 1));

export class Pokemon {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PokemonFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pokemon_free(ptr, 0);
    }
    /**
     * @returns {Species}
     */
    get specie() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_pokemon_specie(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Species} arg0
     */
    set specie(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_pokemon_specie(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get hp() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_pokemon_hp(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set hp(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_pokemon_hp(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get hp_max() {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        const ret = wasm.__wbg_get_pokemon_hp_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set hp_max(arg0) {
        if (this.__wbg_ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.__wbg_ptr);
        _assertNum(arg0);
        wasm.__wbg_set_pokemon_hp_max(this.__wbg_ptr, arg0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_String_fed4d24b68977888 = function() { return logError(function (arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_alert_191c3fc44b3b9a2c = function() { return logError(function (arg0, arg1) {
        alert(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_entries_3265d4158b33e5dc = function() { return logError(function (arg0) {
        const ret = Object.entries(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_b0d1adbb20936f1a = function() { return logError(function (arg0, arg1) {
        console.error(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getwithrefkey_bb8f74a92cb2e784 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function() { return logError(function (arg0) {
        const ret = Number.isSafeInteger(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_log_3fbc2e448577f746 = function() { return logError(function (arg0) {
        console.log(arg0 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_log_5378a5c8487c415b = function() { return logError(function (arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_log_c5fe9420e2684f2d = function() { return logError(function (arg0, arg1, arg2, arg3) {
        console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
    }, arguments) };
    imports.wbg.__wbg_new_a12002a7f91c75be = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_65595bdd868b3009 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    }, arguments) };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        _assertNum(ret);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('future_calc_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;

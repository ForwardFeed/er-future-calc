<script setup lang="ts">
import type { Field, Terrain } from "../../calc/bindings/field";
import type { Pokemon } from "../../calc/bindings/pokemon";
import init, { calc_gen_redux } from "../../calc/pkg/future_calc"
init().then(()=>{
   const attacker: Pokemon = {
    hp: 0,
    hp_max: 0,
  }
  const defender: Pokemon = {
    hp: 0,
    hp_max: 0,
  }
  const terrain: Field = {
    terrain: "None",
    game_type: "Single"
  }
  calc_gen_redux(attacker, defender, terrain)
})
</script>
<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>

<script setup lang="ts">
import init, { calc } from "../../calc/pkg/future_calc"
init().then(()=>{
   const attacker = {
    hp: 0,
    hp_max: 0,
    specie: "AlcremieRainbowSwirl"
   }
  const defender = {
    hp: 0,
    hp_max: 0,
    specie: "AlcremieRainbowSwirl"
  }
  const terrain = {
    terrain: "None",
    game_type: "Single"
  }
  calc(attacker, defender, terrain)
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

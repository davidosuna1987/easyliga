<script setup lang="ts">
import { GameReportTeamTypes } from '@/domain/game'
</script>

<template>
  <div class="grid place-content-center p-2 border-solid border-r-0">
    <strong>5</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>7</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0">
    <strong>0</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>57</strong>
  </div>

  <div
    class="flex flex-col justify-center items-center col-span-2 border-solid border-x-0 text-center"
  >
    <span class="font-2xs">Duración total</span>
    <strong>69 min</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>75</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-x-0">
    <strong>3</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid">
    <strong>6</strong>
  </div>

  <div class="grid place-content-center p-2 border-solid border-l-0">
    <strong>0</strong>
  </div>

  <div class="col-span-10 grid grid-cols-3">
    <div class="flex flex-col justify-center items-center border-solid p-1">
      <span class="font-2xs">Hora de inicio</span>
      <span>11:30</span>
    </div>
    <div
      class="flex flex-col justify-center items-center border-solid border-x-0 p-1"
    >
      <span class="font-2xs">Hora de finalización</span>
      <span>12:50</span>
    </div>
    <div class="flex flex-col justify-center items-center border-solid p-1">
      <span class="font-2xs">Duración total</span>
      <span>1h 20min</span>
    </div>
  </div>

  <div class="col-span-10 flex justify-around border-solid p-2">
    <div class="flex-min text-center">
      <strong class="uppercase">Ganador</strong>
    </div>
    <div class="text-center">
      <span>Club de voley Navarvoley A</span>
    </div>
    <div class="flex gap-2 flex-min text-center">
      <strong>3</strong>
      <span>:</span>
      <span>0</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GameReportSimpleResultFooter',
}
</script>

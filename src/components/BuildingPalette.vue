<template>
  <div class="building-palette">
    <h2>Building Types</h2>
    <div 
      v-for="building in buildingTypes" 
      :key="building.id" 
      class="building-type"
      @click="selectBuilding(building)"
    >
      <span>{{ building.name }}</span>
      <small>Efficiency: {{ building.powerEfficiency }}</small>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  buildingTypes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-building'])

function selectBuilding(building) {
  emit('select-building', building)
}
</script>

<style scoped>
.building-palette {
  background-color: #e0e0e0;
  padding: 15px;
  border-radius: 5px;
}
.building-type {
  cursor: pointer;
  padding: 10px;
  margin: 5px 0;
  background-color: white;
  border-radius: 3px;
  transition: background-color 0.3s;
}
.building-type:hover {
  background-color: #f0f0f0;
}
</style>

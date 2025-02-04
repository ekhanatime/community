<template>
  <div class="area-planner">
    <div class="sidebar">
      <BuildingPalette 
        :building-types="buildingTypes"
        @select-building="handleBuildingSelect"
      />
      <SustainabilityMetrics 
        :metrics="sustainabilityMetrics"
      />
    </div>
    <ThreeScene 
      ref="threeScene" 
      @building-placed="handleBuildingPlacement"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useVillageStore } from '@/stores/villageStore'
import BuildingPalette from '@/components/BuildingPalette.vue'
import ThreeScene from '@/components/ThreeScene.vue'
import SustainabilityMetrics from '@/components/SustainabilityMetrics.vue'

const villageStore = useVillageStore()
const threeScene = ref(null)

const buildingTypes = computed(() => villageStore.buildingTypes)
const sustainabilityMetrics = computed(() => villageStore.sustainabilityMetrics)

onMounted(async () => {
  await villageStore.fetchBuildingTypes()
})

function handleBuildingSelect(buildingType) {
  // Trigger 3D placement mode
  threeScene.value.startPlacementMode(buildingType)
}

function handleBuildingPlacement(placementData) {
  villageStore.placeBuilding(placementData)
}
</script>

<style scoped>
.area-planner {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 300px;
  background-color: #f4f4f4;
  padding: 20px;
}
</style>

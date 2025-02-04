<template>
  <div class="sustainability-metrics">
    <h2>Village Sustainability</h2>
    <div class="metric">
      <label>Power Balance</label>
      <div class="metric-value" :class="powerBalanceClass">
        {{ metrics.powerBalance.toFixed(2) }} kW
      </div>
    </div>
    <div class="metric">
      <label>Total Occupancy</label>
      <div class="metric-value">
        {{ metrics.totalOccupancy }} residents
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({
      powerBalance: 0,
      totalOccupancy: 0
    })
  }
})

const powerBalanceClass = computed(() => {
  if (props.metrics.powerBalance > 0) return 'positive'
  if (props.metrics.powerBalance < 0) return 'negative'
  return 'neutral'
})
</script>

<style scoped>
.sustainability-metrics {
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
}
.metric {
  margin-bottom: 10px;
}
.metric-value {
  font-weight: bold;
  padding: 5px;
  border-radius: 3px;
}
.positive { background-color: #e6f3e6; color: green; }
.negative { background-color: #f3e6e6; color: red; }
.neutral { background-color: #f0f0f0; color: gray; }
</style>

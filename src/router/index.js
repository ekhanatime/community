import { createRouter, createWebHistory } from 'vue-router'
import AreaPlannerView from '../views/AreaPlannerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AreaPlannerView
    }
  ]
})

export default router

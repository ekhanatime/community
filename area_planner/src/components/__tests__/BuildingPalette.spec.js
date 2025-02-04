import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BuildingPalette from '../BuildingPalette.vue'
import { createPinia } from 'pinia'

describe('BuildingPalette', () => {
  it('renders properly', () => {
    const wrapper = mount(BuildingPalette, {
      global: {
        plugins: [createPinia()]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('contains building options', () => {
    const wrapper = mount(BuildingPalette, {
      global: {
        plugins: [createPinia()]
      }
    })
    expect(wrapper.find('.building-palette').exists()).toBe(true)
  })
})

import { mount } from 'vue-test-utils'
import VNumberField from './VNumberField'

test('it works', () => {
  const wrapper = mount(VNumberField)
  expect(wrapper.isVueInstance()).toBe(true)
})

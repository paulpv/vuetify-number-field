import { mount } from 'vue-test-utils'
import VNumberField from './VNumberField'

test('it works', () => {
  const wrapper = mount(VNumberField)
  expect(wrapper.isVueInstance()).toBe(true)
})

/*
  scripts: {
    "prepublishOnly": "npm test && npm run build",
  }

  devDependencies: {
    "jest-css-modules": "^1.1.0",
    "jest-serializer-html": "^5.0.0",
    "jest-vue-preprocessor": "^1.4.0",
  }

https://github.com/egoist/poi/issues/416

*/
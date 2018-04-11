import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

Vue.config.performance = true

Vue.use(Vuetify)

new Vue({
  el: '#app',
  render: h => h(App)
})

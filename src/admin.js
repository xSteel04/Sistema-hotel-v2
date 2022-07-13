import Vue from 'vue'
import AppAdmin from './AppAdmin.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'


import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(AppAdmin)
}).$mount('#appAdmin')
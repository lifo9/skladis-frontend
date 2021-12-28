// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { i18n } from './plugins/i18n'
import LastModal from 'vue-last-modal'
import App from './App'
import router from './router'
import { store } from './backend/store/store'
import 'material-icons/iconfont/material-icons.css'
import './assets/tailwind.css'
import filters from './plugins/filters'

Vue.use(filters)
Vue.use(LastModal)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

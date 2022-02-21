import 'material-icons/iconfont/material-icons.css'
import '@/assets/tailwind.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import vfmPlugin from 'vue-final-modal'

import App from '@/App.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import { CONSTANTS } from '@/plugins/constants'
import filters from '@/plugins/filters'
import { i18n } from '@/plugins/i18n'
import router from '@/router'
import { eventBus } from '@/utils//eventBus'
import { clickOutside } from '@/utils/directives/clickOutside'
import { role } from '@/utils/directives/role'

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.eventBus = eventBus
app.config.globalProperties.$filters = filters
app.provide('constants', CONSTANTS)

app.component('ConfirmationModal', ConfirmationModal)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(vfmPlugin)
app.directive('role', role)
app.directive('click-outside', clickOutside)

app.mount('#app')

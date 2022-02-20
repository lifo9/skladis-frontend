import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import { i18n } from '@/plugins/i18n'
import filters from '@/plugins/filters'
import { role } from '@/utils/directives/role'
import { clickOutside } from '@/utils/directives/clickOutside'
import { eventBus } from '@/utils//eventBus'
import vfmPlugin from 'vue-final-modal'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import { CONSTANTS } from '@/plugins/constants'

import 'material-icons/iconfont/material-icons.css'
import '@/assets/tailwind.css'

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

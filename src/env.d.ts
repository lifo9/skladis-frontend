/// <reference types="vite/client" />

import { Emitter } from 'mitt'
import type { DefineComponent } from 'vue'

import { constants } from '@/plugins/constants'

declare module '*.vue' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

type EventType = string | symbol
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    eventBus: Emitter<Record<EventType, unknown>>
    constants: constants
  }
}

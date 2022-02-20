/// <reference types="vite/client" />

import { Emitter } from 'mitt'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

type EventType = string | symbol
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    eventBus: Emitter<Record<EventType, unknown>>
  }
}

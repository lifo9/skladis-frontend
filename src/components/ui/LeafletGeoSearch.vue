<template>
  <div></div>
</template>

<script lang="ts">
import { GeoSearchControl } from 'leaflet-geosearch'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'VGeosearch',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.add()
  },
  beforeUnmount() {
    this.remove()
  },
  methods: {
    deferredMountedTo(parent) {
      const searchControl = new GeoSearchControl(this.options)
      parent.addControl(searchControl)
      searchControl.getContainer().onclick = (e) => {
        e.stopPropagation()
      }
    },
    remove() {
      if (this.markerCluster) {
        this.$parent.removeLayer(this.markerCluster)
      }
    },
    add() {
      if (this.$parent._isMounted) {
        this.deferredMountedTo(this.$parent.mapObject)
      }
    }
  }
})
</script>

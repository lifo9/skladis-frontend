<template>
  <div class="r-map">
    <l-map ref="rMap" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" />
      <l-marker v-if="marker" :lat-lng="markerLatLng" :draggable="true" @update:latLng="handleMarkerUpdate" />
      <leaflet-geo-search :options="geosearchOptions" />
    </l-map>
  </div>
</template>

<script lang="ts">
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

import { OpenStreetMapProvider } from 'leaflet-geosearch'

import 'leaflet-geosearch/dist/geosearch.css'
import 'leaflet/dist/leaflet.css'
import LeafletGeoSearch from '@/components/ui/LeafletGeoSearch.vue'

import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['mapSearch'],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LeafletGeoSearch
  },
  props: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    zoom: {
      type: Number,
      default: 16
    },
    marker: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: 'bar',
        searchLabel: this.$t('Enter address'),
        notFoundMessage: this.$t('Not found')
      },
      center: [this.latitude, this.longitude],
      markerLatLng: [this.latitude, this.longitude]
    }
  },
  mounted() {
    this.$refs.rMap.mapObject.on('geosearch/showlocation', (response) => {
      this.$emit('mapSearch', response.location)
    })
  },
  methods: {
    handleMarkerUpdate(coordinates) {
      this.$emit('mapSearch', { x: coordinates.lng, y: coordinates.lat })
    }
  }
})
</script>

<style lang="postcss">
.r-map .leaflet-control-attribution {
  @apply hidden;
}
.r-map .vue2leaflet-map {
  @apply z-0 w-full h-full;
}
</style>

<template>
  <div class="r-map">
    <l-map ref="rMap" :zoom="zoom" :center="center">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker
        v-if="marker"
        :lat-lng="markerLatLng"
        :draggable="true"
        @update:latLng="handleMarkerUpdate"
      ></l-marker>
      <leaflet-geo-search :options="geosearchOptions"></leaflet-geo-search>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

import { OpenStreetMapProvider } from 'leaflet-geosearch'

import 'leaflet-geosearch/dist/geosearch.css'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import LeafletGeoSearch from './LeafletGeoSearch.vue'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
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
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LeafletGeoSearch
  },
  mounted () {
    this.$refs.rMap.mapObject.on('geosearch/showlocation', response => {
      this.$emit('mapSearch', response.location)
    })
  },
  data () {
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
  methods: {
    handleMarkerUpdate (coordinates) {
      this.$emit('mapSearch', { x: coordinates.lng, y: coordinates.lat })
    }
  }
}
</script>

<style lang="postcss">
.r-map .leaflet-control-attribution {
  @apply hidden;
}
.r-map .vue2leaflet-map {
  @apply z-0 w-full h-full;
}
</style>

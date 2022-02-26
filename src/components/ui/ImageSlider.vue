<template>
  <div class="flex relative flex-wrap justify-center items-center">
    <transition-group name="fade" tag="div">
      <div v-for="i in [currentIndex]" :key="i">
        <div class="mx-9">
          <img :src="currentImg" class="mx-auto" v-bind="$attrs" />
        </div>
      </div>
    </transition-group>
    <a
      class="absolute top-1/2 left-0 text-4xl text-gray-800 -translate-y-1/2 material-icons"
      href="#"
      @click.prevent="prev"
    >
      navigate_before
    </a>
    <a
      class="absolute top-1/2 right-0 text-4xl text-gray-800 -translate-y-1/2 material-icons"
      href="#"
      @click.prevent="next"
    >
      navigate_next
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },

  computed: {
    currentImg: function () {
      return this.images[Math.abs(this.currentIndex) % this.images.length]
    }
  },

  methods: {
    next() {
      this.currentIndex += 1
    },
    prev() {
      this.currentIndex -= 1
    }
  }
})
</script>

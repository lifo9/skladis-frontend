<template>
  <div>
    <my-header />
    <main>
      <p>ADMIN VIEW</p>
    </main>
  </div>
</template>

<script>
import Logout from '../../components/Logout.vue'
import RFooter from '../../components/Footer.vue'
import MyHeader from '../../components/Header.vue'

export default {
  components: { Logout, MyHeader, RFooter }
}
</script>

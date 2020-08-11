<template>
  <div class="home">
    <MyCart msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MyCart from '@/components/Cart.vue'

export default {
  name: 'Home',
  components: {
    MyCart
  }
}
</script>

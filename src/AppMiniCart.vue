<template>
      <span>{{gerRualProductInCart.product_total}}</span>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("products", ["gerRualProductInCart"]),
  },
};
</script>
<template>
      <span id="js_mob_cart_count" class="nav-basket__count">{{gerRualProductInCart.product_total}}</span>
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
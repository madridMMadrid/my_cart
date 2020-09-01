<template>
  <div class="basket">
    <a :href="`${data}index.php?route=checkout/test/cart`" class="bcount">
      <span id="bcount">{{gerRualProductInCart.product_total}}</span>
      <span id="bcount_str">товаров</span>
    </a>
    <div class="bsum">
      на
      <span id="bprice" v-for="(val, i) in gerRualProductInCart.totals" :key="i">{{ val.text }}руб</span>
    </div>
    <a :href="`${data}index.php?route=checkout/test/cart`" class="orange_btn">Оформить заказ</a>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      data: process.env.NODE_ENV !== 'production' ? 'https://prime-wood.ru/' : ''
    };
  },
  computed: {
    ...mapGetters("products", ["gerRualProductInCart"]),
  },
};
</script>
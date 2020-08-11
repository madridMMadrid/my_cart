<template>
  <tr>
    <td>
      <img :src="getProductsInCart.image" alt class="product-image" />
    </td>
    <td>
      <div class="product-name">
        <router-link to="/" tag="a">{{ getProductsInCart.name }}</router-link>
        <ul class="chars_list">
          <li>
            <span class="bold">Артикул:</span> V-1.16
          </li>
          <li>
            <span class="bold">Размер:</span>
            <span class="dimensions">
              <i>↔</i> 110 см
              <i class="width">↔</i> 55 см
              <i>↕</i> 76.50 см
            </span>
          </li>
          <li class="char_list_material" v-if="getProductsInCart.options">
            <div class="bold">Материал:</div>
            <div>
              <b-form-select
                v-model="changeSelect"
                :options="getProductsInCart.options"
                size="sm"
                class="mt-3 my_select"
              ></b-form-select>
            </div>
          </li>
        </ul>
      </div>
    </td>
    <td>
      <div class="inStorage">
        <div class="status yes">На складе</div>
      </div>
    </td>
    <td>
      <div class="currentSum">
        <div>{{ getProductsInCart.price * getProductsInCart.qty }}</div>
        <div>РУБ</div>
      </div>
    </td>
    <td>
      <PlusMinusForCheckout
        @totalCurrentSummMore="totalSummMore"
        @totalCurrentSummLess="totalSummLess"
        :price="getProductsInCart.price"
        :qty="getProductsInCart.qty"
        :AllInfoForProduct="getProductsInCart"
      />
    </td>
    <td>
      <span class="product-price">{{ getProductsInCart.price }}</span>
    </td>
    <td>
      <button class="product-remove" @click="remove(index)">X</button>
    </td>
  </tr>
</template>
<script>
import { mapActions } from "vuex";

import PlusMinusForCheckout from "./PlusMinus";
export default {
  props: ["getProductsInCart", "index"],
  components: {
    PlusMinusForCheckout,
  },
  data() {
    return {
      totalCurrenSumm: 0,
      changeSelect: this.getProductsInCart.selected
    };
  },
  methods: {
    ...mapActions("products", ["removeProduct", "changeCoff"]),
    remove(index) {
      this.removeProduct(index);
    },
    totalSummMore(data) {
      this.totalCurrenSumm = data;
    },
    totalSummLess(data) {
      this.totalCurrenSumm = data;
    }
  },
   watch: {
    changeSelect(val) {
      let infoForProduct = {'a': this.getProductsInCart, 'b': val}
      this.changeCoff(infoForProduct)
    },
  }
};
</script>
<style lang="scss" scoped>
tr {
  border-top: 1px solid #d6d5cc;
  &:last-child {
    border-bottom: 1px solid #d6d5cc;
  }
  & td {
    padding: 15px 10px;
    &:first-child {
      padding: 5px;
    }
  }
}
.status {
  white-space: nowrap;

  &:before {
    content: "";
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: top;
    margin-right: 7px;
  }

  &.yes {
    color: #ff9e57;
    display: flex;
    align-items: center;

    &:before {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAFM0aXcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhlJREFUeNpi+P//P8P/ZamvgETKayDnP0AAMfy/eyQSRDOCefMjGAACiBEoEsVwcPJSBhBg5WBgYlCyXsYAA8xsrwACiAFmCkwvC1Dff7DshbUglYyM/5enA4XZGBi+vmNg4OB5zsTw/98rhs+vGBj+/WFgCJ8hBRBAIOsYGJanvWT48UmMARlw8L1iiJwlzghyIcOPzyJwCV6gupBJDAxLkxkYWFiBRpon5IMlJHUYGBJXMDB8fs0A8gDDr68MDKaxJRBngjDImSsynv5fkf4M5DmYOEAAQST//WP6v7tr0/954f/BNIgPDo9PL5UY1uTdZUAHIZOUGUGqMSQsgQ47PhcYGiDAxg1xCAgE9TEAvQlmQiQjpjMwXN3OwKDmyMDw7DIDMLTBwkxgclEcA4OWBwPD00twCRAAOuiFMsOa/DuYDpqoguqVBdE/kb0CEGCQsAaBz6+UGPZPWMXw9p4xAy4grHSWwbEgDBjc9yDWAk1h2FJ9kuHNPRMGYoGI0hkGn1Zzxv8727YzPL3ogVcxJz8Dg0cdA4OANAPDnm4GhsdnGRik9XcgAllCC6igloHh8iYGhrPAiGb4D7KBgcG1ApRcgBrOMzAcmMDA8OcnxEAmll+oNitaMjDY5QAlmBkYfv8Ap2qGG7sZGE7MA5qFFpFgm7H5GeQKDl4GhoengZr+4fEzPLRfKjPsn7iScGjnhzPwioMTGgBHfgwlkWXMRgAAAABJRU5ErkJggg==");
    }
  }

  &.no {
    color: #a1729b;

    &:before {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAFM0aXcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeFJREFUeNpi/v//P4PWf5VXzFr/VF6z8bKLAgQQw71zdyJBoowLi2b/ZwACgABiuHf2ThSIc+3olf8gmhEkvah4DliWk5fzFUAAMYAEVtYtfgXTy6z0Wea/bbwT98EFe4P5RPlvM4GU3j5xA2ze2c0ne5hA+p5cfgQWCKmPkgIIILChqxuWvvz++bsYAxIAKQxtiBYHu/DHlx+iIEF9LyMGIRlhhjcPXjH8+fWHG2h0OpNpgGU+TJeQtAgDjxAv3BRjX/MSsBUgcP/83UiQIxiAvgRJKBopLwOJAwQQ2B///v1j2jd35yaQT0E0iA8Oj89vPimta1t5lwENBFWFKzNr/FF6BxOI601huLjrHJh9/fDVfCYGPIB8ScZPbz4qr29bdQddIrAqTAXsVyBmOjB/94ZnN5+4S6nL7HRIdA1gZGT8BxBg8ID48vaz0sFFe1e9ffLGGJc1wjIiZ+3jnMN4hHnvga0FBcj2iZtOvnn82gRZoWOqG4OshhzD9WNXGU6vPY5iiIis6BnPfD9zpn1zdm5F1wgCv77/RKGRAUg9SB/T0xtPPLA58d3Tt2D67eM3WL3w4s4zJ8Y9s7Zvx2UAPiCtIbODIj/DQ/vz20/KhxbtW0kotO3inMJ5hfnACQ0AXEoEm226Q6MAAAAASUVORK5CYII=");
    }
  }
}
.chars_list {
  font-size: 13px;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding-left: 0;
  & li {
    align-items: center;
  }
  & .bold {
    font-weight: bold;
  }
  & i {
    margin-left: 10px;
  }
  & .my_select {
    border: none;
    margin: 0 !important;
  }
  & .char_list_material {
    display: flex;
    & .custom-select {
      &:focus {
        box-shadow: none;
      }
    }
  }
  & .dimensions {
    & i.width {
      display: inline-block;
      font-size: 14px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
      vertical-align: top;
    }
  }
}
.checkout-product {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 0.5fr 1fr 0.5fr 0.5fr;
  background-color: #fff;
  // box-shadow: 0px 0px 10px rgba(73, 74, 78, 0.1);
  border-radius: 0;
  list-style: none;
  box-sizing: border-box;
  padding: 0.8em;
  margin: 1em 0;
  border-top: 1px solid #d6d5cc;

  &:last-child {
    border-bottom: 1px solid #d6d5cc;
  }
}

.checkout-product * {
  place-self: center;
}
.product-image {
  grid-column: 1/2;
  max-height: 115px;
}

.product-name {
  box-sizing: border-box;
  text-align: left;
  & a {
    color: #ff9e23;
    text-decoration: underline;
    cursor: pointer;
    font-size: 13px;
  }
}

.product-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff9e24;
  padding-right: 30px;
  line-height: 17px;
  position: relative;
  white-space: nowrap;

  &:before {
    content: "РУБ";
    position: absolute;
    top: 0;
    right: 0;
    font-size: 12px;
  }
}
.currentSum {
  font-size: 20px;
  font-weight: bold;
  color: #888;
  line-height: 17px;
  display: flex;
  margin: auto;
  justify-content: center;
  & div {
    &:first-child {
      white-space: nowrap;
    }
    &:last-child {
      font-size: 12px;
      margin-left: 5px;
    }
  }
}

.product-remove {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 0;
  background-color: #e0e0e0;
  color: #fff;
  cursor: pointer;
}


</style>  
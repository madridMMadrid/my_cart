<template>
  <tr class="wrapper_list spinner">
    <td>
      <img :src="getProductsInCart.thumb" alt class="product-image" />
    </td>
    <td>
      <div class="product-name">
        <router-link to="/" tag="a">{{ getProductsInCart.name }}</router-link>
        <ul class="chars_list">
          <li>
            <span class="bold">Артикул:</span>
            {{getProductsInCart.sku}}
          </li>
          <li>
            <span class="bold">Размер:</span>
            <span class="dimensions">
              <i>↔</i>
              {{getProductsInCart.proportions.width}}
              <i class="width">↔</i>
              {{getProductsInCart.proportions.length}}
              <i>↕</i>
              {{getProductsInCart.proportions.height}}
            </span>
          </li>
          <li class="char_list_material" v-if="getProductsInCart.option.length != 0">
            <div class="bold" v-for="(val, i) in getProductsInCart.option" :key="i">{{val.name}}:</div>
            <div>
              <select v-model="selected" >
                <option v-for="(val, i) in options" :value="val.product_option_value_id" :key="i">{{ val.name }}</option>
              </select>
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
        <div>{{ getProductsInCart.price }}</div>
      </div>
    </td>
    <td>
      <PlusMinus
        :price="getProductsInCart.price"
        :qty="+getProductsInCart.quantity"
        :AllInfoForProduct="getProductsInCart"
        @emitQty="sumQty"
      />
    </td>
    <td>
      <span class="product-price">{{ getProductsInCart.total }}</span>
    </td>
    <td>
      <button class="product-remove" @click="remove(getProductsInCart.cart_id)">X</button>
    </td>
  </tr>
</template>
<script>
import { mapActions } from "vuex";

import PlusMinus from "./PlusMinus";
import { log } from "util";
import { store } from '../store';

export default {
  props: ["getProductsInCart", "index"],
  components: {
    PlusMinus,
  },
  data() {
    return {
      totalCurrenSumm: 0,
      product_id: this.getProductsInCart.product_id,
      options:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_value,
      selected:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_value[0].product_option_value_id,
      selectValue: null,
      qty: 0,

      cart_id: this.getProductsInCart.cart_id,
      one:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_id,
      two:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_value_id,
    };
  },
  created() {},
  computed: {},
  methods: {
    ...mapActions("products", ["removeProduct"]),
    sumQty(e) {
      this.qty = e;
    },
    queryParams(params) {
      var esc = encodeURIComponent;
      var query = Object.keys(params)
        .map((k) => {
          if (params[k] instanceof Object) {
            let innetObj = Object.keys(params[k])
              .map((a) => `${"[" + esc(a) + "]"}=${esc(params[k][a])}`)
              .join("&");
            return k + innetObj;
          }
          return `${esc(k)}=${esc(params[k])}`;
        })
        .join("&");
      return query;
    },
    editProductToCart(data) {
      let url = "https://prime-wood.ru/index.php?route=checkout/test_cart/edit";
      var data = {
        product_id: data.product_id,
        quantity: data.qty,
        cart_id: data.cart_id,
        option: data.option,
      };
      fetch(url, {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: this.queryParams(data),
      })
        .then((response) => {
          console.log("что то отправили", response, "че в дате", data);
          if (!response.ok) {
            return Promise.reject(
              new Error(
                "Response failed: " +
                  response.status +
                  " (" +
                  response.statusText +
                  ")"
              )
            );
          }
          return response.json();
        })
        .then((data) => {
          store.dispatch('products/loadItems');
          console.log("Делаем что-то с данными.", data);
        })
        .catch((error) => {
          console.log("что то пошло не так", error);
        });
    },
    remove(id) {
      let url =
        "https://prime-wood.ru/index.php?route=checkout/test_cart/remove";
      let data = { key: id };

      fetch(url, {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: this.queryParams(data),
      })
        .then((response) => {
          
          this.removeProduct(this.index);
          response.json();
          store.dispatch('products/loadItems');

        })
        .then((json) => console.log("DELETE", json));
    },
  },
  watch: {
    selected(e) {
      let searchTerm = e;
      console.log("че выбрал", searchTerm)
      // let option_value_id = this.options.find(
      //   (name) => name.name === searchTerm
      // ).option_value_id;
      // let product_option_value_id = this.options.find(
      //   (name) => name.name === searchTerm
      // ).product_option_value_id;
      let obj = {};
      obj[+this.one] = +searchTerm;
      this.selectValue = obj;
      this.editProductToCart({
        product_id: this.product_id,
        cart_id: this.cart_id,
        qty: this.qty,
        option: obj,
        inerator: 0,
      });
    },
  },
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
    & select {
      width: 100px;
      border: none;
      margin-left: 5px;
    }
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
.wrapper_list {
  & .spinner {
    position: relative;
    & .in_spinner {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.product-image {
  max-height: 100px;
  max-width: 100px;
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
  line-height: 17px;
  position: relative;
  white-space: nowrap;
  padding-right: 25px;
  &:before {
    content: "РУБ";
    position: absolute;
    top: -1px;
    right: 0;
    font-size: 10px;
  }
}
.currentSum {
  font-size: 20px;
  font-weight: bold;
  color: #888;
  display: flex;
  margin: auto;
  justify-content: center;
  & > div {
    position: relative;
    padding-right: 25px;
    &::before {
      content: "РУБ";
      position: absolute;
      top: 4px;
      right: 0;
      font-size: 10px;
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
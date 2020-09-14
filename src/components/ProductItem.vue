<template>
  <tr class="wrapper_list spinner">
    <td class="wrap_img">
      <img :src="getProductsInCart.thumb" alt class="product-image" />
    </td>
    <td class="wrap_product-name">
      <div class="product-name">
        <a :href="getProductsInCart.href">{{ getProductsInCart.name }}</a>
        <ul class="chars_list">
          <li>
            <span class="bold">Артикул:</span>
            {{getProductsInCart.sku}}
          </li>
          <li>
            <span class="bold">Размер:</span>
            <span class="dimensions">
              <i>↔</i>
              {{getProductsInCart.proportions.length}}
              <i class="width">↔</i>
              {{getProductsInCart.proportions.width}}
              <i>↕</i>
              {{getProductsInCart.proportions.height}}
            </span>
          </li>
          <li class="char_list_material" v-if="getProductsInCart.option.length != 0">
            <div
              class="bold"
              v-for="(val, i) in getProductsInCart.option"
              :key="i + val.product_option_value_id"
            >{{val.name}}:</div>
            <div class="select">
              <OptionsSelect :getProductsInCart="getProductsInCart" :index="index" :qty="qty" />
            </div>
          </li>
        </ul>
      </div>
    </td>
    <td class="wrap_inStorage">
      <div class="inStorage">
        <div class="status yes">На складе</div>
      </div>
    </td>
    <td class="micro_size">
      <div class="currentSum">
        <div>{{ getProductsInCart.price.toString().replace(/(\d{1,3})(?=((\d{3})*)$)/g, " $1") }}</div>
      </div>
    </td>
    <td class="micro_size">
      <PlusMinus
        :price="getProductsInCart.price"
        :qty="+getProductsInCart.quantity"
        :AllInfoForProduct="getProductsInCart"
        :selectValue="selectValue"
        @emitQty="sumQty"
      />
    </td>
    <td class="micro_size">
      <span
        class="product-price"
      >{{ getProductsInCart.total.toString().replace(/(\d{1,3})(?=((\d{3})*)$)/g, " $1") }}</span>
    </td>
    <td class="closed">
      <button
        class="product-remove"
        :style="{'background-image': `url('${this.$root.base_url}/catalog/view/javascript/skin/images/icons.png')`}"
        @click="remove(getProductsInCart.cart_id)"
      ></button>
    </td>
  </tr>
</template>
<script>
import { mapActions } from "vuex";

import PlusMinus from "./PlusMinus";
import OptionsSelect from "./OptionsSelect";
import { log } from "util";
import { store } from "../store";
import { ListGroupPlugin } from "bootstrap-vue";

export default {
  props: ["getProductsInCart", "index"],
  components: {
    PlusMinus,
    OptionsSelect,
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
        this.getProductsInCart.option[0].product_option_value_id,
      selectValue: null,
      qty: 0,

      cart_id: this.getProductsInCart.cart_id,
      one:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_id,
      two:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_value_id,

      selectOptions: "",
      activeValueOptions: false,
      selectOptionsName:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].value,
    };
  },
  created() {},
  computed: {},
  methods: {
    ...mapActions("products", ["removeProduct"]),
    openSelectOptions(e) {
      // e.preventDefault()
      if (!this.activeValueOptions) {
        this.activeValueOptions = "activeValueOptions";
      } else {
        this.activeValueOptions = "";
      }
    },
    activeValueCheckOptions(e, i) {
      let id = this.options.find((x) => x.product_option_value_id == i).name;
      this.selectOptionsName = id;
      this.activeValueOptions = "";
    },
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
      let url = `${this.$root.base_url}index.php?route=checkout/vue/cart/edit`;
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
          store.dispatch("products/loadItems");
        })
        .catch((error) => {
          console.log("что то пошло не так", error);
        });
    },
    remove(id) {
      let url = `${this.$root.base_url}index.php?route=checkout/vue/cart/remove`;
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
          store.dispatch("products/loadItems");
        })
        .then((json) => console.log("DELETE", json));
    },
  },
  watch: {
    selected(e) {
      let searchTerm = e;
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
.__select {
  position: relative;
  width: 100%;
  height: 26px;
  margin: 0 auto;
  @for $i from 1 through 3 {
    &[data-state="activeValueOptions#{$i}"] {
      .__select__title {
        &::before {
          transform: translate(-3px, -50%) rotate(-45deg);
        }

        &::after {
          transform: translate(3px, -50%) rotate(45deg);
        }
      }

      .__select__content {
        opacity: 1;
        visibility: visible;
      }

      .__select__label + .__select__input + .__select__label {
        min-height: 40px;
        border-top-width: 1px;
      }
    }
  }
}
.__select__title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2px 6px;
  border-radius: 5px;

  cursor: pointer;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    display: block;
    width: 10px;
    height: 2px;
    transition: all 0.3s ease-out;
    background-color: #333333;
    transform: translate(-3px, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(3px, -50%) rotate(-45deg);
  }
}
.reset {
  display: flex;
  width: 230px;
  padding: 8px 16px;
  margin: 0 auto;
  margin-bottom: 10px;
  border: solid 1px #c7ccd1;
  border-radius: 5px;
  transition: all 0.2s ease-out;
  cursor: pointer;
  font-weight: bold;
  background-color: #ffffff;
  color: #333333;
  &:hover {
    background-color: #d8093a;
    color: #ffffff;
  }
}
.__select__content {
  position: absolute;
  top: 37px;
  left: 3px;

  display: flex;
  flex-direction: column;
  width: calc(100% - 6px);

  background-color: #ffffff;

  border: 1px solid #c7ccd1;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  transition: all 0.3s ease-out;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.34);

  opacity: 0;
  visibility: hidden;
  z-index: 9;
}
.__select__input {
  display: none;

  &:checked + label {
    background-color: #dedede;
  }
  &:disabled + label {
    opacity: 0.6;
    pointer-events: none;
  }
}
.__select__label {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  height: 46px;
  padding: 0px 16px 0px 45px;
  transition: all 0.2s ease-out;
  overflow: hidden;
  font-size: 13px;
  margin: 0;
  position: relative;
  & .__select__label_img {
    position: absolute;
    width: 34px;
    height: 34px;
    background: red;
    border-radius: 100%;
    left: 5px;
    border: 3px solid #e1e0e0;
  }

  & + input + & {
    border-top: 0 solid #c7ccd160;
  }
}
tr.wrapper_list.spinner {
  border-top: 1px solid #d6d5cc;
  &:last-child {
    border-bottom: 1px solid #d6d5cc;
  }
  & td {
    padding: 15px 10px;

    // padding: 15px 10px;
    // display: flex;
    // align-items: center;
    &:first-child {
      padding: 16px 5px;
    }
  }
}

@media screen and (max-width: 600px) {
  tr.wrapper_list.spinner {
    position: relative;
    &.wrapper_list {
      // display: flex;
      width: 100%;
      text-align: left;
      & .wrap_img {
        min-width: 100px;
        display: inline-block;
      }
      & .micro_size {
        display: inline-block;
      }
    }
    & td {
      display: flex;
      justify-content: center;
      &.wrap_inStorage {
        padding: 0;
      }
      &.closed {
        position: absolute;
        right: 0;
        top: 0;
      }
      &.wrap_product-name {
        display: inline-block;
        max-width: 185px;
      }
      &.wrap_img {
        & img {
          max-width: 100px;
          // max-height: 100%;
        }
      }
      & .inStorage {
        display: none;
      }
      & .product-price {
        line-height: inherit;
      }
    }
  }
}
@media screen and (max-width: 400px) {
  tr.wrapper_list.spinner {
    & td {
      &.micro_size {
      }
    }
  }
}
.wrapper_list.spinner {
  & .status {
    white-space: nowrap;
    font-size: 12px;

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
  & .chars_list {
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
      & .select {
        position: relative;
        & select {
          &.select-css {
            display: block;
            width: 100%;
            padding: 2px 1px 2px 1px;
            margin-left: 10px;
            background: none;
            border: none;
            border-radius: 0;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            font-family: inherit;
            font-size: 1em;
            color: #595959;
            box-shadow: none;
            border-bottom: 1px dotted #56504c;
            &:focus {
              outline: none;
            }
          }
        }
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
  & .checkout-product {
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

  & .checkout-product * {
    place-self: center;
  }
  & .wrapper_list {
    // display: flex;
    position: relative;
    & .spinner {
      position: relative;
      & .in_spinner {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  & .product-image {
    max-height: 100px;
    max-width: 100px;

    @media screen and (max-width: 600px) {
      max-width: 100%;
      height: auto;
      display: block;
      max-height: 100px;
      margin-right: 10px;
    }
  }

  & .product-name {
    box-sizing: border-box;
    text-align: left;
    @media screen and (max-width: 600px) {
      width: 100%;
    }
    & a {
      color: #ff9e23;
      text-decoration: underline;
      cursor: pointer;
      font-size: 13px;

    }
  }

  & .product-price {
    font-size: 20px;
    font-weight: bold;
    color: #ff9e24;
    line-height: 17px;
    position: relative;
    white-space: nowrap;
    padding-right: 25px;
    display: flex;
    justify-content: flex-end;
    &:before {
      content: "РУБ";
      position: absolute;
      top: -1px;
      right: 0;
      font-size: 10px;
    }
  }
  & .currentSum {
    font-size: 20px;
    font-weight: bold;
    color: #595959;
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

  & .product-remove {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 0;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    background-position: -58px -78px;
  }
}
</style>  
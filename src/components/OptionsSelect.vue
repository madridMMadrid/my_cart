<template>
  <div class="custom_select" :data-state="index" :class="{active: isActive}">
    <div
      class="__select__title"
      data-default="Option 0"
      @click="openSelectOptions($event, index)"
    >{{ selectOptionsName }}</div>
    <div class="__select__content">
      <input
        id="singleSelectOptions0"
        class="__select__input"
        type="radio"
        name="singleSelect"
        checked
      />
      <template v-for="(rule, i) in options">
        <input
          :id="'singleSelectOptions0'+i"
          class="__select__input"
          type="radio"
          name="singleSelect"
          :key="'singleSelectOptions0'+i"
          :value="rule.product_option_value_id"
          v-model="selected"
        />
        <label
          :key="'singleSelectOptions1'+i"
          :for="'singleSelectOptions0'+i"
          class="__select__label"
          @click="activeValueCheckOptions(rule.product_option_value_id, index)"
        >
          <span :style="`background-image:url(${rule.image});`" class="__select__label_img"></span>
          {{rule.name}}
        </label>
      </template>
    </div>
  </div>
</template>

<script>
import { store } from "../store";

export default {
  props: ["getProductsInCart", "index", "qty"],

  data() {
    return {
      selectOptions: "",
      activeValueOptions: "",
      isActive: false,

      product_id: this.getProductsInCart.product_id,
      options:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_value,
      selected:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_value_id,
      selectValue: null,

      cart_id: this.getProductsInCart.cart_id,
      one:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_id,
      two:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].product_option_value_id,
      selectOptionsName:
        this.getProductsInCart.option.length == 0 ||
        this.getProductsInCart.option[0].value,
    };
  },
  methods: {
    openSelectOptions(e, i) {
      this.isActive = !this.isActive;
    },
    activeValueCheckOptions(i, index) {
      let id = this.options.find((x) => x.product_option_value_id == i).name;
      this.selectOptionsName = id;

      let searchTerm = i;
      let obj = {};
      obj[+this.one] = +searchTerm;
      if (index == this.index) {
        this.isActive = !this.isActive;
      }

      this.selectValue = obj;
      this.editProductToCart({
        product_id: this.product_id,
        cart_id: this.cart_id,
        qty: this.qty,
        option: obj,
        inerator: 0,
      });
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
      let url = `${this.$root.base_url}index.php?route=api/test/cart/edit`;
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
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.__select__title {
  position: relative;
  width: 100%;
  height: 26px;
  margin: 0 auto;
  &::before {
    transform: translate(-3px, -50%) rotate(-45deg);
  }

  &::after {
    transform: translate(3px, -50%) rotate(45deg);
  }
}

.__select__label + .__select__input + .__select__label {
  min-height: 40px;
  border-top-width: 1px;
}

.custom_select {
  width: 100%;
  @for $i from 0 through 40 {
    &.active {
      &[data-state="#{$i}"] {
        & .__select__content {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
  &.active {
    & .__select__title {
      &::before {
        transform: translate(-3px, -50%) rotate(-45deg);
      }

      &::after {
        transform: translate(3px, -50%) rotate(45deg);
      }
    }
  }
}
.__select__title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2px 30px 2px 6px;
  border-radius: 5px;

  cursor: pointer;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 9px;
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
  min-width: 215px;
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
    border-radius: 100%;
    left: 5px;
    border: 3px solid #e1e0e0;
    background-position: 1px;
  }
}
</style>
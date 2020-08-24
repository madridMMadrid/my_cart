<template>
  <div>
    <div class="product-card-buy-count d-flex ai-c">
      <div class="product-card-buy-count-controls">
        <div v-if="lessDisabled" class="less disabled">
          <b-spinner small label="Small Spinner"></b-spinner>
        </div>
        <div v-else class="less" @click="lessCaunt()"></div>
        <input
          type="number"
          min="1"
          class="product-card-buy-count-input"
          @change="addEvent"
          @keyup.enter="addEvent"
          v-model="summa"
          value="summa"
        />
        <div v-if="moreDisabled" class="more disabled">
          <b-spinner small label="Small Spinner"></b-spinner>
        </div>
        <div v-else class="more" @click="moreCaunt()"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { log } from "util";
import { store } from "../store";

export default {
  props: ["price", "qty", "AllInfoForProduct"],
  data() {
    return {
      summa: this.qty,
      totalSum: this.price,
      product_id: this.AllInfoForProduct.product_id,
      cart_id: this.AllInfoForProduct.cart_id,
      one:
        this.AllInfoForProduct.option == 0 ||
        this.AllInfoForProduct.option[0].product_option_id,
      two:
        this.AllInfoForProduct.option == 0 ||
        this.AllInfoForProduct.option[0].product_option_value_id,
      moreDisabled: false,
      lessDisabled: false,
    };
  },
  watch: {
    summa(e) {
      this.summa = +e;
      this.$emit("emitQty", this.summa);
    },
  },
  created() {
    this.$emit("emitQty", this.summa);
  },
  methods: {
    addEvent({ type, target }) {
      let obj = {};
      obj[+this.one] = +this.two;
      this.editProductToCart({
        product_id: this.product_id,
        cart_id: this.cart_id,
        qty: target.value,
        option: obj,
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
      let url = "https://prime-wood.ru/index.php?route=checkout/test/cart/edit";
      var data = {
        product_id: data.product_id,
        quantity: data.qty,
        cart_id: data.cart_id,
        option: data.option,
        inerator: data.inerator,
      };
      data.inerator == 1
        ? (this.moreDisabled = true)
        : (this.lessDisabled = true);
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
        .then((res) => {
          if (data.inerator == 1) {
            this.moreDisabled = false;
          } else {
            this.lessDisabled = false;
          }
          store.dispatch("products/loadItems");
        })
        .catch((error) => {
          console.log("что то пошло не так", error);
        });
    },

    moreCaunt() {
      this.summa += 1;
      this.totalSum += this.price;
      let obj = {};
      obj[+this.one] = +this.two;
      this.editProductToCart({
        product_id: this.product_id,
        cart_id: this.cart_id,
        qty: this.summa,
        option: obj,
        inerator: 1,
      });
    },
    lessCaunt() {
      if (this.summa <= 1) {
        return;
      }
      this.summa -= 1;
      this.totalSum -= this.price;
      let obj = {};
      obj[+this.one] = +this.two;
      this.editProductToCart({
        product_id: this.product_id,
        cart_id: this.cart_id,
        qty: this.summa,
        option: obj,
        inerator: 0,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.spinner-border {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin: auto;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}
.product-card-buy {
  &-count {
    margin: 0;
    &-controls {
      display: flex;
      & .more,
      .less {
        width: 25px;
        background: #c5c4c4;
        line-height: 0.9;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        position: relative;

        &:hover {
          cursor: pointer;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.1) inset;
        }
        &:before {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      & .more {
        &.disabled {
          cursor: not-allowed;
          display: flex;
        }
        &:before {
          content: "+";
        }
      }
      & .less {
        &.disabled {
          cursor: not-allowed;
          display: flex;
        }
        &:before {
          content: "-";
        }
      }
    }
  }
  &-price {
    display: flex;
    &-currency {
      line-height: inherit;
      top: 0;
    }
  }
  &.jc-sb {
    align-items: center;
  }
}
.box {
  display: flex;
  align-items: stretch;
  & div {
    background: #888;
  }
}
.product-card {
  max-width: 216px;
  margin: 10px 12px 10px 0;
  flex: 0 0 24%;
  border: 1px solid #e2e0d3;
  text-align: center;
  &:nth-child(4n) {
    margin-right: 0;
  }
}

.product-card-title {
  padding: 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: #595959;
}

.product-card-scale {
  padding-top: 10px;
  border-top: 1px solid #e2e0d3;
}

.product-card-scale-size {
  display: inline-block;
  margin: 5px;
  color: #858585;
  font-size: 13px;
}

.product-card-info {
  margin: 5px 0;
}

.product-card-info-text {
  font-size: 13px;
}

.product-card-info-text.green {
  color: #00a75f;
}

.product-card-info-text.black {
  color: #858585;
}

.product-card-actions {
  text-align: right;
  margin: 5px 10px;
}

.product-card-icon {
  fill: #858585;
}

.product-card-buy {
  padding: 5px 10px;
  margin-top: 5px;
  background-color: #f9f8f3;
}

.product-card-buy-price {
  color: #595959;
  width: 100%;
  justify-content: center;
}

.product-card-buy-price-text {
  font-size: 25px;
}

.product-card-buy-price-currency {
  margin-left: 3px;
  font-size: 13px;
  text-transform: uppercase;
  vertical-align: top;
}
.product-card-buy-count-input {
  max-width: 30px;
  padding: 5px;
  border: 1px solid #e2e0d3;
  text-align: center;
  color: #b8ad87;
  font-size: 15px;
}

.product-card-buy-count-button {
  display: block;
  padding: 3px;
  background-color: #ebe8e5;
  border: 1px solid #e2e0d3;
  border-left: 0 solid;
  border-radius: 0;
  line-height: 0;
  &:last-child {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
    border-bottom: 0 solid #e2e0d3;
    border-left: 1px solid #e2e0d3;
    border-right: 0 solid;
  }
}

.product-card-buy-count-icon {
  width: 8px;
  height: 8px;
  fill: #ada587;
}

.product-card-buy-button {
  padding: 5px 8px;
}

.product-card-buy-icon {
  fill: #fff;
  vertical-align: middle;
}
</style>
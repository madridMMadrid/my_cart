<template>
  <div class="checkout-box">
    <div class="wrapperCheckedProd">
      <button @click="addProductToCart()">add</button>
      <button @click="checkedProduct()">checked</button>
      <button @click="remove()">DELETE</button>
    </div>
    <ul>
      <table class="resp-tab">
        <tbody>
          <ProductItem
            class="checkout-list"
            v-for="(product, index) in gerRualProductInCart.products"
            :key="product.cart_id"
            :index="index"
            :getProductsInCart="product"
          />
        </tbody>
      </table>
    </ul>
    <div v-if="!hasProduct()" class="checkout-message">
      <h3>Нет товара...</h3>
      <router-link to="/">Вернуться на главную</router-link>
    </div>

    <h3 class="total" v-if="hasProduct()">
      Сумма:
      <span v-for="(val, i) in gerRualProductInCart.totals" :key="i">{{ val.text }}</span>
    </h3>

    <form id="js_form_order" v-if="hasProduct()">
      <div class="order_block form_border_style clearfix">
        <div class="b_ttl">Оформление заказа</div>

        <div class="entity_wrap entity_wrap_l">
          <div class="checkbox">
            <input
              class="custom-checkbox"
              type="radio"
              id="color-1"
              name="color"
              value="forUr"
              checked
              v-model="picked"
            />
            <label for="color-1">Для юридических лиц</label>
          </div>

          <div class="checkbox">
            <input
              class="custom-checkbox"
              type="radio"
              id="color-2"
              name="color"
              value="forFiz"
              v-model="picked"
            />
            <label for="color-2">Для физических лиц</label>
          </div>
        </div>

        <div class="left">
          <div class="gr_ttl">Контактная информация</div>
          <div class="fields_wrap">
            <label>
              ФИО
              <span class="orange">*</span>
            </label>
            <input type="text" name="firstname" value data-required class="js_localsave" />

            <label>
              Номер телефона
              <span class="orange">*</span>
            </label>
            <input type="text" name="telephone" value class="phone_mask js_localsave" data-required />

            <label>
              E-mail
              <span class="orange">*</span>
            </label>
            <input type="text" name="email" value data-required class="js_localsave" />
          </div>

          <div class="gr_ttl">Способ доставки</div>
          <div class="entity_wrap" id="js_shipping_method">
            <div class="checkbox">
              <input
                class="custom-checkbox"
                type="radio"
                id="color-3"
                name="color_delivery"
                value="delivery"
                checked
                v-model="picked_delivery"
              />
              <label for="color-3">Доставка</label>
            </div>

            <div class="checkbox">
              <input
                class="custom-checkbox"
                type="radio"
                id="color-4"
                name="color_delivery"
                value="no_delivery"
                v-model="picked_delivery"
              />
              <label for="color-4">Свмовывоз</label>
            </div>
          </div>

          <div
            class="deliv_addr js_delivery_toggle"
            data-block="flat.flat"
            v-if="picked_delivery == 'delivery'"
          >
            <div class="gr_ttl">Адрес для доставки</div>
            <div class="fields_wrap">
              <label>Страна</label>
              <select
                name="country_id"
                id="js_select_country"
                class="form-control"
                @change="addProductToCart()"
              >
                <option value>-- Выберите страну --</option>
                <option value="15">Азербайджан</option>
                <option value="11">Армения</option>
                <option value="140">Молдова</option>
                <option value="176" selected="selected">Российская Федерация</option>
              </select>

              <label>Регион</label>
              <select
                name="zone_id"
                id="js_select_zone"
                class="form-control"
                v-model="selectedReg"
                @change="selectedRegion()"
              >
                <option value>--- Выберите ---</option>
                <option value="2726">Алтайский край</option>
                <option value="2729">Амурская область</option>
                <option value="2724">Архангельская область</option>
                <option value="2725">Астраханская область</option>
                <option value="2727">Белгородская область</option>
                <option value="2730">Брянская область</option>
              </select>
              <label>Город</label>
              <input type="text" name="city" value="Москва" class="js_localsave" />
              <label>Улица, дом, квартира</label>
              <VueDadata class="js_localsave" :token="token" />
              <label>Почтовый индекс</label>
              <input type="text" name="postcode" value class="js_localsave" />
            </div>
          </div>
          <div class="delivery_pickup_txt js_delivery_toggle" v-else>
            <p>
              Заказ вы можете забрать
              <a href="/dostavka/" target="_blank">по адресу склада</a> самовывоза, по предварительной договорённости с менеджером.
            </p>
          </div>

          <div id="requisites" style="display: block;" v-if="picked == 'forUr'">
            <div class="gr_ttl">Реквизиты плательщика</div>
            <input type="hidden" name="organization[empty]" />
            <div class="fields_wrap">
              <label>Юридический адрес</label>
              <input
                type="text"
                value
                name="organization[address]"
                data-required
                class="js_localsave"
              />
              <label>Организация</label>
              <input type="text" name="organization[name]" value data-required class="js_localsave" />
              <label>ИНН/КПП</label>
              <input
                type="text"
                name="organization[inn_kpp]"
                value
                data-required
                class="js_localsave"
              />
              <label>Р/с</label>
              <input type="text" name="organization[rs]" value data-required class="js_localsave" />
              <label>К/с</label>
              <input type="text" name="organization[ks]" value data-required class="js_localsave" />
              <label>Банк</label>
              <input type="text" name="organization[bank]" value data-required class="js_localsave" />
              <label>БИК</label>
              <input type="text" name="organization[bik]" value data-required class="js_localsave" />
            </div>
          </div>
        </div>
        <div class="right">
          <div class="fields_wrap">
            <div class="gr_ttl">Комментарий к заказу</div>
            <textarea name="comment" class="js_localsave"></textarea>
          </div>
          <div class="order_info">
            <div class="clearfix">
              <div class="left_block">
                <div class="order_label">Cпособ оплаты</div>
              </div>
              <div class="right_block">
                <div class="price">
                  <select name="zone_id" id="js_select_zone" class="form-control">
                    <option value="2726">Безналичный расчет</option>
                    <option value="2729">Наличными курьеру</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="clearfix">
              <div class="left_block">
                <div class="order_total_label">
                  Итого к оплате
                  <br />
                  <span>*Без учета стоимости доставки</span>
                </div>
              </div>
              <div class="right_block">
                <div class="total_order_price">
                  {{ totalPrice() }}
                  <span class="sup">руб</span>
                </div>
              </div>
            </div>
          </div>
          <input type="submit" name="send_order" class="orange_btn btn_big" value="ОТПРАВИТЬ" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueDadata from "vue-dadata";

import ProductItem from "./ProductItem";
import { log } from "util";
function getXmlHttp() {
  let xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest != "undefined") {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}
function makeAjax(metodType, path, body, callback) {
  let getCallback = callback || function (data) {};
  let xhr = getXmlHttp();
  xhr.open(metodType, path, true);
  xhr.onload = function () {
    if (this.status == 200) {
      let data;
      try {
        data = JSON.parse(this.responseText);
      } catch (e) {
        data = this.responseText;
      }
      getCallback(data);
    } else {
      alert("Error: " + this.status);
    }
  };
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send(body);
}
export default {
  data() {
    return {
      picked: "forUr",
      picked_delivery: "delivery",
      random: Math.floor(Math.random() * 100000),
      token: "84adece4ab466da7fcb4aa269180fdc143037b0a",
      selectedReg: "",
    };
  },
  components: {
    ProductItem,
    VueDadata,
  },
  computed: {
    ...mapGetters("products", ["getProductsInCart", "gerRualProductInCart"]),
  },

  methods: {
    ...mapActions("products", ["removeProduct"]),
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

    checkedProduct() {
      let url = "https://prime-wood.ru/index.php?route=checkout/test_cart/info";
      fetch(url, {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((json) => console.log("че в json", json));
    },

    hasProduct() {
      return this.getProductsInCart.length > 0;
    },
    totalPrice() {
      return this.getProductsInCart.reduce(
        (current, next) => current + next.price * next.qty,
        0
      );
    },

    makeAjax(metodType, path, body, callback) {
      let getCallback =
        callback ||
        function (data) {
          console.log("makeAjax");
        };
      let xhr = this.getXmlHttp();
      xhr.open(metodType, path, true);
      xhr.onload = function () {
        if (this.status == 200) {
          let data;
          try {
            data = JSON.parse(this.responseText);
          } catch (e) {
            data = this.responseText;
          }
          getCallback(data);
        } else {
          alert("Error: " + this.status);
        }
      };
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.send(body);
    },
    getXmlHttp() {
      let xmlhttp;
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          xmlhttp = false;
        }
      }
      if (!xmlhttp && typeof XMLHttpRequest != "undefined") {
        xmlhttp = new XMLHttpRequest();
      }
      return xmlhttp;
    },
  },
};
</script>
<style lang="scss">
.wrapperCheckedProd {
  display: flex;
}
.vue-dadata {
  float: left !important;
  &__input {
    border: 1px solid #d6d5cc !important;
    border-radius: 3px !important;
    height: 30px !important;
    padding: 5px 10px !important;
    font-size: 14px !important;
    margin-bottom: 10px !important;
    width: 250px !important;
  }
  &__suggestions {
    border: 1px solid #888;
  }
}
</style>
<style lang="scss" scoped >
.checkout-box {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  margin: 50px auto;
  box-sizing: border-box;
  padding: 1em;
}

.checkout-list {
  padding: 0;
}

.total {
  font-size: 2em;
  font-weight: bold;
  align-self: flex-end;
  position: relative;
  padding-right: 38px;
  &::before {
    content: "РУБ";
    position: absolute;
    top: 4px;
    right: 0;
    font-size: 16px;
  }
}

.checkout-message {
  font-size: 1.5em;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

.order_block .right {
  width: 425px;
}
.right {
  float: right;
}

.order_info {
  background-color: #f9f8f3;
  border: 1px solid #e2e0d3;
  font-size: 20px;
  margin: 25px 0 15px;
  padding: 25px 5px 30px;
  position: relative;
  & .form-control {
    width: 100%;
  }
}

.order_info:after,
.order_info:before {
  border-top: 7px solid #e2e0d3;
  content: "";
  height: 0;
  position: absolute;
  bottom: -7px;
  width: 0;
  transition: all 0.2s ease;
}

.order_info:before {
  border-left: 40px solid transparent;
  left: 5px;
}

.order_info:after {
  border-right: 40px solid transparent;
  right: 5px;
}

.order_info .left_block {
  border-right: 1px dashed #d6d5cc;
  float: left;
  padding-right: 20px;
  text-align: right;
  width: 225px;
}
.left {
  float: left;
}

.order_label {
  margin-bottom: 5px;
}

.order_total_label {
  font-size: 25px;
  font-weight: 700;
  line-height: 20px;
  margin-top: 25px;
}

.order_total_label span {
  font-size: 12px;
  font-weight: 400;
}

.order_info .right_block {
  float: right;
  padding-left: 7px;
  width: 186px;
}

.order_info .price {
  font-weight: 700;
  margin-bottom: 5px;
}

.order_info .total_order_price {
  color: #ff9e24;
  font-size: 35px;
  font-weight: 700;
  margin-top: 15px;
  text-align: center;
}

.order_info .total_order_price .sup {
  font-size: 22px;
  top: -8px;
}

.payment_select {
  width: 160px;
}

.order_block .orange_btn {
  display: block;
  margin: 0 auto;
  width: 170px;
  background: #f59115;
  border: none;
  color: #fff;
  border-radius: 3px;
  font-weight: 700;
  padding: 10px;
}
.order_block {
  font-size: 14px;
  margin-top: 20px;
}

.order_block .left {
  width: 425px;
  text-align: left;
}

.order_block .entity_wrap {
  margin: 20px 0;
  display: flex;
}

.entity_wrap label {
  cursor: pointer;
  margin-right: 45px;
}

.order_block .fields_wrap {
  margin-bottom: 20px;
}
.fields_wrap label {
  float: left;
  line-height: 30px;
  margin: 0 5px 7px 0;
  width: 170px;
}

.fields_wrap input[type="text"],
.form-control {
  margin-bottom: 10px;
  width: 250px;
}

.delivery_pickup_txt {
  color: #ff9e57;
  margin-bottom: 20px;
  & a {
    color: #ff9e57;
    text-decoration: underline;
  }
}
.form_border_style input[type="password"],
.form_border_style input[type="text"],
.form_border_style textarea,
.form-control {
  border: 1px solid #d6d5cc;
  border-radius: 3px;
  height: 30px;
  padding: 5px 10px;
  font-size: 14px;
}

#requisites {
  display: none;
}
.orange {
  color: #ff9e24;
}
.gr_ttl {
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 15px;
}
.form_border_style textarea {
  height: 110px;
  width: 100%;
}

/* для элемента input c type="checkbox" */
.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

/* для элемента label, связанного с .custom-checkbox */
.custom-checkbox + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
  position: relative;
  outline: none !important;
}
/* создание в label псевдоэлемента before со следующими стилями */
.custom-checkbox + label::before {
  content: "";
  display: inline-block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #adb5bd;
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}
.custom-checkbox + label::after {
  content: "";
  display: inline-block;
  background: #ff9e24;
  width: 8px;
  height: 8px;
  border-radius: 25%;
  position: absolute;
  left: 3px;
  opacity: 0;
}

/* стили при наведении курсора на checkbox */
.custom-checkbox:not(:disabled):not(:checked) + label:hover::before {
  /* border-color: #b3d7ff; */
  outline: 0;
  outline-offset: 0;
}
/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox:focus:not(:checked) + label::before {
  border-color: #80bdff;
}

/* стили для чекбокса, находящегося в состоянии checked */
.custom-checkbox:checked + label::before {
  border-color: #ff9e24;
  background-color: #fff;
}
.custom-checkbox:checked + label::after {
  opacity: 1;
}
</style>

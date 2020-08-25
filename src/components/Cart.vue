<template>
  <div class="checkout-box">
    <div></div>
    <div class="wrapperCheckedProd"></div>
    <ul class="p-0">
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
    <div v-if="lp == 0 && loader == false" class="checkout-message">
      <h3>Нет товара...</h3>
    </div>
    <div v-if="loader" class="text-center">
      <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
    </div>
    <h3 class="total">
      Сумма:
      <span v-for="(val, i) in gerRualProductInCart.totals" :key="i">{{ val.text }}</span>
    </h3>

    <form id="js_form_order" @submit.prevent="submit">
      <div class="order_block form_border_style clearfix">
        <div class="b_ttl">Оформление заказа</div>

        <div class="entity_wrap">
          <div class="checkbox">
            <input
              class="custom-checkbox no_style"
              type="radio"
              id="organization"
              name="organization"
              value="organization"
              checked
              v-model="entity_type"
            />
            <label for="organization">Для юридических лиц</label>
          </div>

          <div class="checkbox">
            <input
              class="custom-checkbox no_style"
              type="radio"
              id="no_organization"
              name="organization"
              value="no_organization"
              v-model="entity_type"
            />
            <label for="no_organization">Для физических лиц</label>
          </div>
        </div>

        <div class="left">
          <div class="gr_ttl" ref="gr_ttl">Контактная информация</div>
          <div class="fields_wrap">
            <div class="form-group" :class="{ 'form-group--error': $v.firstname.$error }">
              <label class="form__label">
                ФИО
                <span class="orange">*</span>
              </label>
              <input class="form__input" v-model.trim="$v.firstname.$model" />
            </div>
            <div class="error" v-if="!$v.firstname.required">Имя должно быть от 1 до 32 символов!</div>
            <div
              class="error"
              v-if="!$v.firstname.minLength"
            >Меньше {{$v.firstname.$params.minLength.min}} символов.</div>
            <div
              class="error"
              v-if="!$v.firstname.maxLength"
            >Больше {{$v.firstname.$params.maxLength.max}} символов.</div>

            <div class="form-group" :class="{ 'form-group--error': $v.telephone.$error }">
              <label class="form__label">
                Номер телефона
                <span class="orange">*</span>
              </label>
              <input
                class="form__input"
                v-mask="'+7(###) ###-##-## ##'"
                v-model="$v.telephone.$model"
              />
            </div>
            <div class="error" v-if="!$v.telephone.required">Телефон пуст</div>
            <div
              class="error"
              v-if="!$v.telephone.minLength"
            >Меньше {{$v.telephone.$params.minLength.min}} символов.</div>

            <div class="form-group" :class="[{'form-group--error' : emptyEmail}, isEmailValid()]">
              <label class="form__label">
                Email
                <span class="orange">*</span>
              </label>
              <input class="form__input" v-model="email" />
            </div>
            <div class="error" v-if="email">Не коректный Email</div>
            <div class="error" v-else-if="emptyEmail">Email пустой</div>
          </div>

          <div class="gr_ttl">Способ доставки</div>
          <div class="entity_wrap" id="js_shipping_method">
            <div class="checkbox">
              <input
                class="custom-checkbox no_style"
                type="radio"
                id="color-3"
                name="shipping_method"
                value="flat.flat"
                checked
                v-model="shipping_method"
              />
              <label for="color-3">Доставка</label>
            </div>

            <div class="checkbox">
              <input
                class="custom-checkbox no_style"
                type="radio"
                id="color-4"
                name="shipping_method"
                value="pickup.pickup"
                v-model="shipping_method"
              />
              <label for="color-4">Свмовывоз</label>
            </div>
          </div>

          <div class="deliv_addr js_delivery_toggle" v-if="shipping_method == 'flat.flat'">
            <div class="gr_ttl">Адрес для доставки</div>
            <div class="fields_wrap">
              <div>
                <label>Регион</label>
                <select
                  id="js_select_zone"
                  class="form-control multiple"
                  v-model="zone_id"
                  @change="selectRegion"
                >
                  <option v-for="(val, i) in regions" :key="i" :value="val.zone_id">{{ val.name }}</option>
                </select>
              </div>
              <div>
                <label>Улица, дом, квартира</label>
                <VueDadata
                  :onChange="getAdres"
                  :inputQuery="getAdres"
                  class="js_localsave"
                  :token="token"
                />
              </div>
              <div>
                <label>Город</label>
                <input class="js_localsave" type="text" v-model="address_1" />
              </div>
            </div>
          </div>
          <div class="delivery_pickup_txt js_delivery_toggle" v-else>
            <p>
              Заказ вы можете забрать
              <a
                href="https://prime-wood.ru/dostavka/"
                target="_blank"
              >по адресу склада</a> самовывоза, по предварительной
              договорённости с
              менеджером.
            </p>
          </div>

          <div id="requisites" style="display: block;" v-if="entity_type == 'organization'">
            <div class="gr_ttl">Реквизиты плательщика</div>

            <div class="fields_wrap">
              <label>Юридический адрес</label>
              <input type="text" class="js_localsave" v-model="address" />
              <label>Организация</label>
              <input type="text" v-model="organization" class="js_localsave" />
              <label>ИНН/КПП</label>
              <input type="text" v-model="inn_kpp" class="js_localsave" />
              <label>Р/с</label>
              <input type="text" v-model="rs" class="js_localsave" />
              <label>К/с</label>
              <input type="text" v-model="ks" class="js_localsave" />
              <label>Банк</label>
              <input type="text" v-model="bank" class="js_localsave" />
              <label>БИК</label>
              <input type="text" v-model="bik" class="js_localsave" />
            </div>
          </div>
        </div>
        <div class="right">
          <div class="fields_wrap">
            <div class="gr_ttl">Комментарий к заказу</div>
            <textarea v-model="comment" class="js_localsave"></textarea>
          </div>
          <div class="order_info">
            <div class="clearfix">
              <div class="left_block">
                <div class="order_label">Cпособ оплаты</div>
              </div>
              <div class="right_block">
                <div class="priceSelect">
                  <b-form-select class="multiple" v-model="payment_method" :options="optionsPaymont"></b-form-select>
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
                  <span
                    v-for="(val, i) in gerRualProductInCart.totals"
                    :key="i"
                    class="sup"
                  >{{ val.text }} руб</span>
                </div>
              </div>
            </div>
          </div>
          <button
            class="button orange_btn_cart btn_big"
            type="submit"
            :disabled="submitStatus === 'PENDING'"
          >
            <b-spinner v-if="submitStatus === 'PENDING'" small label="Small Spinner"></b-spinner>
            <span v-else>ОТПРАВИТЬ</span>
          </button>
          <p class="typo__p" v-if="submitStatus === 'OK'">Спасибо за заявку!</p>
          <p class="typo__p" v-if="submitStatus === 'ERROR'">Пожалуйста, введите корректные данные</p>
          <p class="typo__p" v-if="submitStatus === 'PENDING'">Отправляем...</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueDadata from "vue-dadata";
import {
  required,
  minLength,
  between,
  maxLength,
} from "vuelidate/lib/validators";

import ProductItem from "./ProductItem";
import { log } from "util";
import { store } from "../store";

export default {
  data() {
    return {
      entity_type: "organization",
      shipping_method: "flat.flat",
      token: "84adece4ab466da7fcb4aa269180fdc143037b0a",
      zone_id: "",

      regions: "",
      firstname: "",
      telephone: "",
      email: "",
      city: "",
      address_1: "",
      address: "",
      organization: "",
      inn_kpp: "",
      rs: "",
      ks: "",
      bank: "",
      bik: "",
      comment: "",
      payment_method: "bank_transfer",
      optionsPaymont: [
        { value: "bank_transfer", text: "Безналичный расчет" },
        { value: "cod", text: "Наличными курьеру", disabled: false },
      ],

      submitStatus: null,

      categoryTotal: 0,
      categoryProducts: [],
      productToCategory: "",
      productLimit: "",
      selectOptions: {},

      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      emptyEmail: false,
    };
  },
  components: {
    ProductItem,
    VueDadata,
  },
  computed: {
    ...mapGetters("products", ["gerRualProductInCart", "lp", "loader"]),
  },
  validations: {
    firstname: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(32),
    },
    telephone: {
      required,
      minLength: minLength(17),
    },
    email: {
      required,
    },
  },
  created() {
    this.getRegions();
  },
  watch: {
    zone_id(id) {
      if (id == "2761" || id == "2722") {
        this.optionsPaymont.forEach((item, i, arr) => {
          if (item.value == "cod") {
            this.optionsPaymont[i].disabled = false;
          }
        });
      } else {
        this.optionsPaymont.forEach((item, i, arr) => {
          if (item.value == "cod") {
            this.optionsPaymont[i].disabled = true;
          }
        });
        this.payment_method = "bank_transfer";
      }
    },
  },
  methods: {
    ...mapActions("products", ["removeProduct", "removeProductAll"]),
    getAdres(val) {
      console.log("какой то адрес", val);
      this.city = val.unrestricted_value;
    },

    scrollToRef(refName) {
      var element = this.$refs[refName];
      var top = element.offsetTop;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    },
    selectRegion({ target }) {
      console.log("смена региона", target.value);
      let url = `https://prime-wood.ru/index.php?route=checkout/test/cart/changeRegion&zone_id=${target.value}`;
      fetch(url, {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((json) => {
          store.dispatch("products/loadItems");
          console.log(json);
        });
    },
    isEmailValid: function () {
      if (this.email != "") this.emptyEmail = false;
      return this.email == ""
        ? ""
        : this.reg.test(this.email)
        ? "has-success"
        : "form-group--error";
    },
    getRegions() {
      let url =
        "https://prime-wood.ru/index.php?route=checkout/test/cart/regions";
      fetch(url, {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((json) => {
          this.zone_id = json.zone_id;
          this.regions = json.zones;
        });
    },
    submit() {
      this.$v.$touch();
      if (
        this.$v.$invalid ||
        this.isEmailValid() == "" ||
        this.isEmailValid() == false ||
        this.isEmailValid() !== "has-success"
      ) {
        if (this.isEmailValid() == "") {
          this.emptyEmail = true;
        }
        this.scrollToRef("gr_ttl");
        this.submitStatus = "ERROR";
      } else {
        this.emptyEmail = false;
        this.submitStatus = "PENDING";
        let url =
          "https://prime-wood.ru/index.php?route=checkout/test/order/save";

        let entity_type_org = {
          // переключатели
          entity_type: this.entity_type,
          shipping_method: this.shipping_method,

          // обязательные поля
          firstname: this.firstname,
          telephone: this.telephone,
          email: this.email,
        };
        let delivery_pickup = {
          // При доставке
          city: this.city,
          zone_id: this.zone_id,
          address_1: this.address_1,
        };

        let legal = {
          // Для юредических лиц
          payment_method: this.payment_method,
          "organization[address]": this.address,
          "organization[organization]": this.organization,
          "organization[inn_kpp]": this.inn_kpp,
          "organization[rs]": this.rs,
          "organization[ks]": this.ks,
          "organization[bank]": this.bank,
          "organization[bik]": this.bik,
          comment: this.comment,
        };
        let itog = {};
        itog = { ...entity_type_org };
        if (
          this.entity_type == "organization" &&
          this.shipping_method != "flat.flat"
        )
          itog = { ...entity_type_org, ...legal };
        else if (
          this.entity_type != "organization" &&
          this.shipping_method == "flat.flat"
        )
          itog = { ...entity_type_org, ...delivery_pickup };
        else if (
          this.entity_type == "organization" &&
          this.shipping_method == "flat.flat"
        )
          itog = { ...entity_type_org, ...delivery_pickup, ...legal };

        console.log("склеиная дата", itog);
        fetch(url, {
          method: "POST",
          credentials: "include",
          withCredentials: true,
          cache: "no-store",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: this.queryParams(itog),
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
            this.submitStatus = "OK";
          })
          .catch((error) => {
            console.log("что то пошло не так", error);
          });
      }
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

    checkedProduct() {
      let url = "https://prime-wood.ru/index.php?route=checkout/test/cart/info";
      fetch(url, {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((json) => console.log("че в json", json));
    },
    // BeardedCode
    optionsPush(productId, option) {
      this.selectOptions[productId] = option;
    },
    getProd() {
      let url = `https://prime-wood.ru/index.php?route=checkout/test/cart/productsToCategory&category=${this.productToCategory}&limit=${this.productLimit}`;
      fetch(url, {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        cache: "no-store",
        mode: "no-cors",
      })
        .then((response) => response.json())
        .then((json) => {
          this.categoryTotal = json.total;
          this.categoryProducts = json.products;
        });
    },
    loadProducts() {
      this.makeAjax(
        "GET",
        `https://prime-wood.ru/index.php?route=checkout/test/cart/productsToCategory&category=${this.productToCategory}&limit=${this.productLimit}`,
        "",
        (response) => {
          this.categoryTotal = response.total || 0;
          this.categoryProducts = response.products || [];
        }
      );
    },
    timAddProductToCart(product_id) {
      this.makeAjax(
        "POST",
        `https://prime-wood.ru/index.php?route=checkout/test/cart/add`,
        "product_id=" +
          product_id +
          (this.selectOptions[product_id]
            ? this.selectOptions[product_id]
            : ""),
        (response) => {
          console.log(response);
        }
      );
    },
    // BeardedCode
    makeAjax(metodType, path, body, callback) {
      let getCallback = callback || function (data) {};
      let xhr = this.getXmlHttp();
      xhr.open(metodType, path, true);
      xhr.onload = () => {
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
      xhr.withCredentials = true;
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
<style lang="scss" >
.checkout-box {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  margin: 50px auto;
  box-sizing: border-box;
  padding: 1em;

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

.order_info .priceSelect {
  font-weight: 700;
  margin-bottom: 5px;
  &.multiple {
    opacity: 1;
  }
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

.order_block .orange_btn_cart {
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
  & input {
    width: auto;
  }
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
.form-control, #js_select_zone {
  margin-bottom: 10px;
  width: 250px;
  height: 30px;
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

input {
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 5px 10px;
  width: 250px;
}

.dirty {
  border-color: #5a5;
  background: #efe;
}

.dirty:focus {
  outline-color: #8e8;
}

.error {
  border-color: red;
  background: #fdd;
}

.form-group {
  margin-bottom: 9px;
}

.form-group__message,
.error {
  font-size: 0.75rem;
  display: none;
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 4px;
}

.error:focus {
  outline-color: #f99;
}

.form-group--success .form-group__addon {
  color: white;
  border-color: #85d0a1;
  background: #85d0a1;
}

.form-group--success input,
.form-group--success textarea,
.form-group--success input:focus,
.form-group--success input:hover {
  border-color: #85d0a1;
}

.form-group--success + .form-group__message,
.form-group--success + .error {
  display: block;
  color: #73c893;
}

.form-group--error .form__label,
.form-group--error .form__label--inline {
  color: #f04124;
}

.form-group--error .form-group__addon {
  color: white;
  border-color: #f79483;
  background: #f79483;
}

.form-group--error input,
.form-group--error textarea,
.form-group--error input:focus,
.form-group--error input:hover {
  border-color: #f79483;
}

.form-group--error + .form-group__message,
.form-group--error + .error {
  display: block;
  color: #f57f6c;
}
@media screen and (max-width: 900px) {
  .order_block {
    & .right {
      float: left;
      width: 100%;
    }
  }
}
@media screen and (max-width: 600px) {
  .form-control,
  .js_localsave, #js_select_zone {
    width: 100%;
    & .vue-dadata__search {
      width: 100%;
    }
    & .vue-dadata__input {
      width: 100% !important;
    }
    & .vue-dadata__container {
      width: 100% !important;
    }
  }
  .order_block {
    & .right {
      width: 100%;
    }
    & .left {
      width: 100%;
      & .fields_wrap {
        & .form-group {
          display: flex;
          flex-direction: column;
        }
        & label,
        input {
          width: 100%;
          margin: 0;
        }
      }
    }
    & .order_info {
      & .left_block,
      .right_block {
        width: 100%;
        padding: 0 5px;
        text-align: center;
        border: none;
      }
    }
  }
}
</style>

import Vue from 'vue';
import App from './App.vue';
import AppCart from './AppCart.vue';

import { store } from './store';
import router from './router';
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueDadata from 'vue-dadata'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'
Vue.use(VueMask)

Vue.use(VueDadata)
Vue.use(Vuelidate)


// Install BootstrapVue
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
    // import VueCarousel from '@chenfengyuan/vue-carousel';
Vue.use(BootstrapVueIcons)
// Vue.config.devtools = true

new Vue({
    el: '#incredibleBasketApp',
    store,
    router,
    data: {
        base_url: (process.env.NODE_ENV !== 'production' ? 'https://prime-wood.ru/' : '')
    },
    render: h => h(App)
})
new Vue({
    el: '#js_header_cart',
    store,
    render: h => h(AppCart)
})
import Vue from 'vue';
import App from './App.vue';
import AxiosPlugin from 'vue-axios-cors';
import axios from 'axios'
import VueAxios from 'vue-axios'

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
Vue.use(AxiosPlugin)
Vue.use(VueAxios, axios)


// Install BootstrapVue
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
    // import VueCarousel from '@chenfengyuan/vue-carousel';
Vue.use(BootstrapVueIcons)


new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
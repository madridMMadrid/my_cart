import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import products from './modules/products';

export const store = new Vuex.Store({
    modules: {
        products,
    },
    strict: process.env.NODE_ENV !== 'production'
})
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { store } from '../store';


Vue.use(VueRouter)

const routes = [{
    path: '*/*',
    name: 'Home',
    component: Home,
    beforeEnter(from, to, next) {
        store.dispatch('products/loadItems');
        next();
    }
}, ]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
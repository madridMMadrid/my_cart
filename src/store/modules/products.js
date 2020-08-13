import Vue from 'vue';
import { ListGroupPlugin } from 'bootstrap-vue';

export default {
    namespaced: true,
    state: {
        items: getProducts(),
        realproduct: [],
        notebooks: [{
            id: 1,
            qty: 1,
            productName: 'notebooks',
            name: 'Notebook Lenovo',
            price: 2259,
            fixPrice: 2259,
            image: 'https://picsum.photos/id/7/200/300/',
            stars: 5,
            totalReviews: 230,
            coffecient: 0,
            details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            selected: 'a',
            options: [
                { cof: 1, value: 'a', text: 'Категория А' },
                { cof: 1.3, value: 'b', text: 'Категория В' },
                { cof: 1.4, value: 'c', text: 'Категория С' },
                { cof: 1.5, value: 'd', text: 'Категория D' }
            ]
        },
        {
            id: 2,
            qty: 1,
            productName: 'notebooks',
            name: 'Notebook Dell',
            price: 2284,
            fixPrice: 2284,
            image: 'https://picsum.photos/id/8/200/300/',
            stars: 3.4,
            totalReviews: 20,
            coffecient: 0,
            details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            selected: 'a',
            options: [
                { cof: 1, value: 'a', text: 'Категория А' },
                { cof: 1.3, value: 'b', text: 'Категория В' },
                { cof: 1.4, value: 'c', text: 'Категория С' },
                { cof: 1.5, value: 'd', text: 'Категория D' }
            ]
        },
        {
            id: 3,
            qty: 1,
            productName: 'notebooks',
            name: 'Notebook Samsung',
            price: 1490,
            fixPrice: 1490,
            image: 'https://picsum.photos/id/9/200/300/',
            stars: 1,
            totalReviews: 1,
            coffecient: 0,
            details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            selected: 'a',
            options: [
                { cof: 1, value: 'a', text: 'Категория А' },
                { cof: 1.3, value: 'b', text: 'Категория В' },
                { cof: 1.4, value: 'c', text: 'Категория С' },
                { cof: 1.5, value: 'd', text: 'Категория D' }
            ]
        }
        ],

        smartphones: [{
            id: 11,
            qty: 1,
            productName: 'smartphones',
            name: 'Smartphone Xiaomi Mi',
            price: 100,
            fixPrice: 100,
            image: 'https://picsum.photos/id/1/200/300/',
            stars: 0,
            totalReviews: 0,
            coffecient: 0,
            details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            selected: 'a',
            options: [
                { cof: 1, value: 'a', text: 'категория А' },
                { cof: 1.3, value: 'b', text: 'категория В' },
                { cof: 1.4, value: 'c', text: 'категория С' },
                { cof: 1.5, value: 'd', text: 'категория D' }
            ]
        },
        {
            id: 12,
            qty: 1,
            productName: 'smartphones',
            name: 'Smartphone Moto',
            price: 500,
            fixPrice: 500,
            image: 'https://picsum.photos/id/2/200/300/',
            stars: 1.5,
            totalReviews: 11,
            coffecient: 0,
            details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            selected: 'a',
            options: [
                { cof: 1, value: 'a', text: 'Категория А' },
                { cof: 1.3, value: 'b', text: 'Категория В' },
                { cof: 1.4, value: 'c', text: 'Категория С' },
                { cof: 1.5, value: 'd', text: 'Категория D' }
            ]
        },
        {
            id: 13,
            qty: 1,
            productName: 'smartphones',
            name: 'Smartphone iPhone 8',
            price: 300,
            fixPrice: 300,
            coffecient: 0,
            image: 'https://picsum.photos/id/3/200/300/',
            stars: 1,
            totalReviews: 2,
            coffecient: 0,
            details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            selected: 'a',
            options: [
                { cof: 1, value: 'a', text: 'Категория 1' },
                { cof: 1.3, value: 'b', text: 'Категория 2' },
                { cof: 1.4, value: 'c', text: 'Категория 3' },
                { cof: 1.5, value: 'd', text: 'Категория 4' }
            ]
        }
        ],

        cartProducts: [
            {
                id: 11,
                qty: 1,
                productName: 'smartphones',
                name: 'Smartphone Xiaomi Mi',
                price: 100,
                fixPrice: 100,
                image: 'https://picsum.photos/id/1/200/300/',
                stars: 0,
                totalReviews: 0,
                coffecient: 0,
                details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                selected: 'a',
                options: [
                    { cof: 1, value: 'a', text: 'категория А' },
                    { cof: 1.3, value: 'b', text: 'категория В' },
                    { cof: 1.4, value: 'c', text: 'категория С' },
                    { cof: 1.5, value: 'd', text: 'категория D' }
                ]
            },
            {
                id: 12,
                qty: 1,
                productName: 'smartphones',
                name: 'Smartphone Moto',
                price: 500,
                fixPrice: 500,
                image: 'https://picsum.photos/id/2/200/300/',
                stars: 1.5,
                totalReviews: 11,
                coffecient: 0,
                details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                selected: 'a',
                options: [
                    { cof: 1, value: 'a', text: 'Категория А' },
                    { cof: 1.3, value: 'b', text: 'Категория В' },
                    { cof: 1.4, value: 'c', text: 'Категория С' },
                    { cof: 1.5, value: 'd', text: 'Категория D' }
                ]
            }
        ],
        summ: 0,
        currentProduct: {},
        showModal: false,
        showPopupCart: false,
    },
    getters: {
        items(state) {
            return state.items;
        },
        itemsMap(state) {
            let itemsMap = {};

            for (let i = 0; i < state.items.length; i++) {
                let product = state.items[i];
                itemsMap[product.id_product] = product;
            }

            return itemsMap;
        },
        item: (state, getters) => (id) => {
            return getters.itemsMap[id];
        },
        getNotebooks: state => state.notebooks,
        getSmartphones: state => state.smartphones,
        getAllProducts: state => state.notebooks.concat(state.smartphones),
        getProductsInCart: state => state.cartProducts,
        gerRualProductInCart: state => state.realproduct,
        summ: state => state.summ,
        getCurrentProduct: state => state.currentProduct,
        getShowModal: state => state.showModal,
        getPopupCart: state => state.showPopupCart,
    },
    mutations: {
        clearItems(state) {
            state.items = [];
        },
        ADD_PRODUCT: (state, payload) => {
            let id = payload.prod.id
            let name = payload.prod.productName
            payload.prod.qty = payload.qty
            let exist = state.cartProducts.some(o => o.id === id && o.productName === name);
            if (!exist) {
                state.cartProducts.push(payload.prod);
                state.summ = payload.qty
            }
        },
        REMOVE_PRODUCT: (state, index) => {
            state.realproduct.products.splice(index, 1);
        },
        LOAD_ITEM: (state, product) => {
            state.realproduct = product
        },
        CURRENT_PRODUCT: (state, product) => {
            state.currentProduct = product;
        },
        SHOW_MODAL: (state) => {
            state.showModal = !state.showModal;
        },
        SHOW_POPUP_CART: (state) => {
            state.showPopupCart = !state.showPopupCart;
        },
        PLUS_QTY: (state, payload) => {
            console.log('отдаем сведения о товаре', payload)
            state.cartProducts.forEach((element, i) => {
                if (element.productName == payload.productName && element.id == payload.id) {
                    state.cartProducts[i].qty += 1
                }
            });
        },
        MINUS_QTY: (state, payload) => {
            state.cartProducts.forEach((element, i) => {
                if (element.productName == payload.productName && element.id == payload.id) {
                    state.cartProducts[i].qty -= 1
                }
            });
        },
        CHANGE_COFF: (state, payload) => {
            state.cartProducts.forEach((element, i) => {
                if (element.productName == payload.a.productName && element.id == payload.a.id) {
                    state.cartProducts[i].price = element.fixPrice
                    let searchCof = payload.b;
                    let cof = element.options.find(exist => exist.value === searchCof).cof
                    let totalCof = state.cartProducts[i].price * cof
                    state.cartProducts[i].coffecient = cof
                    state.cartProducts[i].price = totalCof.toFixed()
                }
            })
        }
    },
    actions: {

        loadItems(store) {
            store.commit('clearItems');
            let url =
                "https://prime-wood.ru/index.php?route=checkout/test_cart/info";
            fetch(url, {
                method: "GET",
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((json) => {
                    store.commit('LOAD_ITEM', json);
                });
            // Vue.http.get('products.php')
            //     .then(response => response.json())
            //     .then(data => {
            //         store.commit('loadItems', data);
            //     });
        },
        addProduct: (context, product) => {
            context.commit('ADD_PRODUCT', product);
        },
        removeProduct: (context, index) => {
            context.commit('REMOVE_PRODUCT', index);
        },
        currentProduct: (context, product) => {
            context.commit('CURRENT_PRODUCT', product);
        },
        showOrHiddenModal: (context) => {
            context.commit('SHOW_MODAL');
        },
        showOrHiddenPopupCart: (context) => {
            context.commit('SHOW_POPUP_CART');
        },

        plusQty: (context, product) => {
            context.commit('PLUS_QTY', product);
        },
        minusQty: (context, product) => {
            context.commit('MINUS_QTY', product);
        },

        changeCoff: (context, product) => {
            context.commit('CHANGE_COFF', product);
        }

    }

};

function getProducts() {
    return [{
        id_product: 10,
        title: 'Iphone 5',
        price: 20000
    },
    {
        id_product: 20,
        title: 'Iphone 6',
        price: 25000
    },
    {
        id_product: 30,
        title: 'Iphone 7',
        price: 30000
    }
    ]
}
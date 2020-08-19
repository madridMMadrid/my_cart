export default {
    namespaced: true,
    state: {
        realproduct: [],
        lengthProd: 0,
        loader: true
    },
    getters: {
        gerRualProductInCart: state => state.realproduct,
        lp: state => state.lengthProd,
        loader: state => state.loader
    },
    mutations: {

        REMOVE_PRODUCT: (state, index) => {
            state.realproduct.products.splice(index, 1);
        },
        LOAD_ITEM: (state, product) => {
            state.loader = false
            state.lengthProd = product.products.length
            state.realproduct = product
        },
        REMOVE_PRODUCT_ALL: (state) => {
            state.realproduct = []
            state.lengthProd = 0
        }
    },
    actions: {

        loadItems(store) {
            let url =
                "https://prime-wood.ru/index.php?route=checkout/test/cart/info";
            fetch(url, {
                method: "GET",
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((json) => {
                    store.commit('LOAD_ITEM', json);
                });
        },

        removeProduct: (context, index) => {
            context.commit('REMOVE_PRODUCT', index);
        },
        removeProductAll: (context, index) => {
            context.commit('REMOVE_PRODUCT_ALL');
        }
    }

};

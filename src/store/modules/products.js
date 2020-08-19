export default {
    namespaced: true,
    state: {
        realproduct: [],
        lengthProd: 0
    },
    getters: {
        gerRualProductInCart: state => state.realproduct,
        lp: state => state.lengthProd
    },
    mutations: {

        REMOVE_PRODUCT: (state, index) => {
            state.realproduct.products.splice(index, 1);
        },
        LOAD_ITEM: (state, product) => {
            state.lengthProd = product.products.length
            state.realproduct = product
        },
    },
    actions: {

        loadItems(store) {
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
        },

        removeProduct: (context, index) => {
            context.commit('REMOVE_PRODUCT', index);
        },
    }

};

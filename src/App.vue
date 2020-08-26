<template>
  <div id="incredibleBasketApp">
    <router-view />
  </div>
</template>

<style lang="scss">
#incredibleBasketApp {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  & *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  & .b_ttl {
    font-size: 30px;
    font-weight: 400;
    margin-bottom: 20px;
    text-align: left;
  }
  & .clearCart {
    font-size: 14px;
    cursor: pointer;
    background: none;
    text-decoration: underline;
    text-align: left;
  }

  & .products {
    display: flex;
    flex-wrap: wrap;

    // display: none; //временно
  }

  & .product_card {
    width: 25%;
    outline: 1px solid #ddd;
  }

  & .product_card img {
    max-width: 100%;
  }

  /* BeardedCode */
  & .wrapperCheckedProd {
    display: flex;
  }

  & .vue-dadata {
    float: left !important;
    &__search {
      @media screen and (max-width: 600px) {
        width: 100% !important;
      }
    }
    &__input {
      border: 1px solid #d6d5cc !important;
      border-radius: 3px !important;
      height: 30px !important;
      padding: 5px 10px !important;
      font-size: 14px !important;
      margin-bottom: 10px !important;
      width: 250px;
      @media screen and (max-width: 600px) {
        width: 100% !important;
      }
    }
    &__container {
      width: 250px !important;
      @media screen and (max-width: 600px) {
        width: 100% !important;
      }
    }

    &__suggestions {
      border: 1px solid #888;
    }
  }
  #incredibleBasketApp {
  }
  & button:focus {
    outline: none !important;
  }

  & #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
}
</style>

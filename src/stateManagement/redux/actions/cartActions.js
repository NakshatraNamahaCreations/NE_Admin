// export const ADD_TO_CART = 'ADD_TO_CART';
// export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

// export const addToCart = (product) => ({
//   type: ADD_TO_CART,
//   payload: product,
// });

// export const removeFromCart = (productId) => ({
//   type: REMOVE_FROM_CART,
//   payload: productId,
// });

// actions/cartActions.js

import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM } from "./actionTypes";

export const addToCart = (item) => (dispatch, getState) => {
  const { cart } = getState();
  const existingItem = cart.cartItems.find(
    (cartItem) => cartItem.id === item.id,
  );

  if (existingItem) {
    dispatch({
      type: UPDATE_CART_ITEM,
      payload: { id: item.id, quantity: existingItem.quantity + 1 },
    });
  } else {
    dispatch({
      type: ADD_TO_CART,
      payload: { ...item, quantity: 1 },
    });
  }
};

export const removeFromCart = (id) => (dispatch, getState) => {
  const { cart } = getState();
  const existingItem = cart.cartItems.find((cartItem) => cartItem.id === id);

  if (existingItem) {
    if (existingItem.quantity > 1) {
      dispatch({
        type: UPDATE_CART_ITEM,
        payload: { id, quantity: existingItem.quantity - 1 },
      });
    } else {
      dispatch({
        type: REMOVE_FROM_CART,
        payload: id,
      });
    }
  }
};

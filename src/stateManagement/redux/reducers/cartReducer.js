// src/redux/reducers/cartReducer.js
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM } from '../actions/actionTypes';

const initialState = {
  cartItems: [],
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_TO_CART:
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      case REMOVE_FROM_CART:
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== action.payload),
        };
      case UPDATE_CART_ITEM:
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };
      default:
        return state;
    }
  };

// const cartReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_TO_CART:
//       return {
//         ...state,
//         cartItems: [...state.cartItems, action.payload],
//       };
//     case REMOVE_FROM_CART:
//       return {
//         ...state,
//         cartItems: state.cartItems.filter(item => item.id !== action.payload),
//       };
//     default:
//       return state;
//   }
// };

// export default cartReducer;

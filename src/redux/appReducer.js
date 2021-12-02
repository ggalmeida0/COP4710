import { createAction } from "@reduxjs/toolkit";
import { cartServices } from "../services/cartService";

export const LOGGED_IN = createAction("$LOGGED_IN");
export const ADD_TO_CART = createAction("$ADD_TO_CART");
export const REMOVE_FROM_CART = createAction("$REMOVE_FROM_CART");
export const SET_ERROR = createAction("$SET_ERROR");
export const CLEAR_ERROR = createAction("$CLEAR_ERROR");
export const SET_CART_STATE = createAction("$SET_CART_STATE");

const initialState = {
    isLoggedIn: false,
    cartItems: null,
    username: null,
    errorMessage: ""
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
        return { ...state, isLoggedIn: true, username:action.payload};
    case ADD_TO_CART:
      if(!state.cartItems.some(item => item.title === action.payload.title)){
        cartServices.addToCart(state.username,action.payload.title)
        return {...state, cartItems:[...state.cartItems, action.payload]};
      }
      return state
    case REMOVE_FROM_CART:
      cartServices.removeFromCart(state.username,action.payload.title)
      return {...state, cartItems: state.cartItems.filter(item => !(item.title === action.payload.title))};
    case SET_ERROR:
      return {...state,errorMessage:action.payload}
    case CLEAR_ERROR:
      return {...state, errorMessage: ""}
    case SET_CART_STATE:
      return {...state, cartItems:action.payload}
    default:
      return state
  }
}


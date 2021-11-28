import { createAction } from "@reduxjs/toolkit";
import * as _ from 'lodash';

export const LOGGED_IN = createAction("$LOGGED_IN");
export const ADD_TO_CART = createAction("$ADD_TO_CART");
export const REMOVE_FROM_CART = createAction("$REMOVE_FROM_CART");

const initialState = {
    isLoggedIn: false,
    cartItems: [],
    username: null
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
        return { ...state, isLoggedIn: true, username:action.payload};
    case ADD_TO_CART:
      if(!state.cartItems.some(item => item.title === action.payload.title))
        return {...state, cartItems:[...state.cartItems, action.payload]};
      return state
    case REMOVE_FROM_CART:
      return {...state, cartItems: state.cartItems.filter(item => !(item.title === action.payload.title))};
    default:
      return state
  }
}


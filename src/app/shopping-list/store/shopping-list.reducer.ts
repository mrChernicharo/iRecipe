import { Ingredient } from '../../shared/ingredient.model';
// import { Action } from '@ngrx/store';

import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
  ingredients: [
    new Ingredient('tomatoes', 10),
    new Ingredient('carrots', 4),
    new Ingredient('cucumbers', 3),
  ]
};

export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions
  ) {
  switch(action.type) {

    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[action.payload.index];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient
      }
      const updatingIngredients = [...state.ingredients];
      updatingIngredients[action.payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatingIngredients
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((item, ingIndex) => {
          return ingIndex !== action.payload;
        })
      }
    default:
      return state;

  }
}

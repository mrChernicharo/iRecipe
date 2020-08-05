import { Ingredient } from '../../shared/ingredient.model';
import { Action } from '@ngrx/store';

import { ADD_INGREDIENT } from './shopping-list.actions';

const initialState = {
  ingredients: [
    new Ingredient('tomatoes', 10),
    new Ingredient('carrots', 4),
    new Ingredient('cucumbers', 3),
  ]
};

export function shoppingListReducer(state = initialState, action: Action) {
  switch(action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action]
      };
  }
}

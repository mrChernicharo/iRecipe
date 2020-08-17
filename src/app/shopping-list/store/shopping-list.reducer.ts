import { Ingredient } from '../../shared/ingredient.model';
// import { Action } from '@ngrx/store';

import * as ShoppingListActions from './shopping-list.actions';

export interface AppState {
  shoppingList: State;
}

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedItemIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient('tomatoes', 10),
    new Ingredient('carrots', 4),
    new Ingredient('cucumbers', 3)
  ],
  editedIngredient: null,
  editedItemIndex: -1,
};



export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {

    // add ingredient
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };

    // add ingredients
    case ShoppingListActions.ADD_INGREDIENTS:
      const mergedIngredients = mergeIngredients([...state.ingredients], [...action.payload])

      return {
        ...state,
        ingredients: [...mergedIngredients]
      };

    // update
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedItemIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedItemIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedItemIndex: -1,
        editedIngredient: null
      };

    // delete
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editedItemIndex;
        }),
        editedItemIndex: -1,
        editedIngredient: null
      };

    // start_edit
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedItemIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };

    // stop_edit
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedItemIndex: -1
      };

    // default
    default:
      return state;
  }
}

function mergeIngredients(ingr1: Ingredient[], ingr2: Ingredient[]): Ingredient[] {
  let allIngredients = ingr2.concat(ingr1)
  let names: string[] = []
  let newArr: Ingredient[] = []

  for (let ingr of allIngredients) {

    if (names.indexOf(ingr.name) !== -1) {
      let index = names.indexOf(ingr.name)
      newArr[index].amount += ingr.amount

    } else {
      newArr.push(new Ingredient(ingr.name, ingr.amount))
    }

    names.push(ingr.name)
  }
  newArr.sort((a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  })
  return newArr.slice();
}

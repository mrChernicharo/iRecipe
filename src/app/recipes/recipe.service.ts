import { Injectable, EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipeSelected = new Subject<Recipe>();
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  //   [
  //   new Recipe(
  //     'burgão',
  //     'maravilha d\'Hamburger',
  //     'https://i.ytimg.com/vi/L6yX6Oxy_J8/maxresdefault.jpg',
  //     [
  //       new Ingredient('meat', 2),
  //       new Ingredient('bread', 1),
  //       new Ingredient('tomatoes', 1),
  //       new Ingredient('cheese', 1),
  //       new Ingredient('letuce', 2),
  //     ]
  //   ),
  //   new Recipe(
  //     'maionese da boa',
  //     'mayo test delicioso prato',
  //     'https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2017/12/Vegetable-stew-recipe.jpg',
  //     [
  //       new Ingredient('mayo', 2),
  //       new Ingredient('tomatoes', 2),
  //       new Ingredient('potatoes', 2.5),
  //       new Ingredient('carrots', 2),
  //       new Ingredient('onions', 1),
  //     ]
  //   ),
  //   new Recipe(
  //     'lasagna',
  //     'lasanha bolonhesa clássica',
  //     'https://i.ytimg.com/vi/2qLwkT1F4Lc/maxresdefault.jpg',
  //     [
  //       new Ingredient('pasta', 1),
  //       new Ingredient('tomatoes', 3),
  //       new Ingredient('cheese', 2),
  //       new Ingredient('ham', 1.5)
  //     ]
  //   )
  // ];
  constructor(
    private slService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
    ) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.reloadRecipes()
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeById(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.reloadRecipes();
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.reloadRecipes();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    console.log('deleted')
    this.reloadRecipes();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients))
  }

  reloadRecipes() {
    this.recipesChanged.next(this.recipes.slice());
  }
}

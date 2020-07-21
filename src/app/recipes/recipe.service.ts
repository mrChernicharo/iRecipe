import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('maionese', 'mayo test', 'https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2017/12/Vegetable-stew-recipe.jpg'),
    new Recipe('maionese da boa', 'mayo test delicioso prato', 'https://keyassets-p2.timeincuk.net/wp/prod/wp-content/uploads/sites/53/2017/12/Vegetable-stew-recipe.jpg'),
  ];
  constructor() { }

  getRecipes() {
    return this.recipes.slice();
  }
}

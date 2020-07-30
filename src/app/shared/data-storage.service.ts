import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class dataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('https://i-recipe-b5b67.firebaseio.com/recipes.json', recipes)
      .subscribe(recipes => {
        console.log(recipes);
      })
  }

  fetchRecipes() {
    this.http
      .get<Recipe[]>('https://i-recipe-b5b67.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            }
          })
        })
      )
      .subscribe(response => {
        console.log(response);
        this.recipeService.setRecipes(response)
      })
  }
}

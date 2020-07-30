import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';

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
      .subscribe(response => {
        console.log(response)
      })
  }
}

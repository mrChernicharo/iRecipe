import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from '../../recipes/store/recipes.actions';
import { switchMap, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipesEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>(
          'https://i-recipe-b5b67.firebaseio.com/recipes.json'
        )
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        }
      })
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient) { }


}

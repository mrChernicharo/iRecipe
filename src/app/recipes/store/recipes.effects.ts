import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as RecipesActions from '../../recipes/store/recipes.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';

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
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http
        .put('https://i-recipe-b5b67.firebaseio.com/recipes.json', recipesState.recipes);
    })
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>) { }


}

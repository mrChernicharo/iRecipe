import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';

import { Actions, ofType } from '@ngrx/effects';

import * as fromApp from '../store/app.reducer';
import * as recipesActions from '../recipes/store/recipes.actions';
import { take } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private dataService: DataStorageService,
    private recipesService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const recipes = this.recipesService.getRecipes();
    // if (recipes.length === 0) {
    //   return this.dataService.fetchRecipes();
    // } else {
    //   return recipes;
    // }

    this.store.dispatch(new recipesActions.FetchRecipes());
    return this.actions$.pipe(
      ofType(recipesActions.SET_RECIPES),
      take(1)
    )
  }
}

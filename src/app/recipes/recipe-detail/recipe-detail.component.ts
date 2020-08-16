import { Component, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as authActions from '../../auth/store/auth.actions';
import { map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //   this.store.select('recipes')
    //     .pipe(
    //       map(recipeState => {
    //         return recipeState.recipes.find((recipe, index) => {
    //           return index === this.id;
    //         })
    //       })
    //     ).subscribe(recipe => {
    //       this.recipe = recipe
    //     });
    // });

    this.route.params.pipe(
      map(params => {
        return +params['id'];
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    ).subscribe(recipe => {
      this.recipe = recipe;
    });
  }

  addToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onDeleteRecipe() {
    let userInput = confirm('Are you sure?')
    if (userInput) {
      this.recipeService.deleteRecipe(this.id);
      this.router.navigate(['/recipes'])
    }
  }
}

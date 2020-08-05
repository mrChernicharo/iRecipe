import { Injectable, EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>()


  ingredients = [
    new Ingredient('tomatoes', 10),
    new Ingredient('carrots', 4),
    new Ingredient('cucumbers', 3)
  ];

  constructor() { }

  getIngredients() {
    return this.ingredients.slice()
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // this.ingredientsChanged.emit(this.ingredients.slice())
    this.ingredientsChanged.next(this.ingredients.slice())

  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice())
    console.log(this.ingredients)
  }

  updateIngredient(index: number, newIngr: Ingredient) {
    this.ingredients[index] = newIngr;
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

}

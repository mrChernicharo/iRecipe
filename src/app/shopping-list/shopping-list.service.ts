import { Injectable, EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  ingredients = [
    new Ingredient('tomatoes', 10),
    new Ingredient('carrots', 4),
    new Ingredient('cucumbers', 3)
  ];

  constructor() { }

  getIngredients() {
    return this.ingredients.slice()
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients.slice())
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.forEach(item => {
      const sameIngredient = ingredients.find(ingredient => ingredient.name === item.name);

      if (sameIngredient) {
        item.amount += sameIngredient.amount
      }
    })
    ingredients.forEach(item => {
      const differentIngredient = this.ingredients.find(ingredient => ingredient.name === item.name);

      if(!differentIngredient) {
        this.ingredients.push(item);
      }
    })


    // this.ingredients.push(...ingredients);

    this.ingredientsChanged.emit(this.ingredients.slice())
  }
}

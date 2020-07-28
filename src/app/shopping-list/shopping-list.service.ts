import { Injectable, EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {
  // ingredientsChanged = new EventEmitter<Ingredient[]>();
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
    console.log(this.ingredients)

    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice())

  }
}






    // this.ingredientsChanged.emit(this.ingredients.slice())

    // console.log(ingredients);
    // console.log(this.ingredients);

    // solução 2

    // const concatedIngredients = ingredients.concat(this.ingredients);
    // const outputArr: Ingredient[] = [];

    // concatedIngredients.forEach((ingredient: Ingredient, index: number) => {
    //   let existing = outputArr.filter((item, index) => {
    //     return item.name === ingredient.name;
    //   })
    //   if (existing.length) {
    //     let existingIndex = outputArr.indexOf(existing[0])
    //     outputArr[existingIndex].amount += ingredient.amount
    //   } else {
    //   outputArr.push(ingredient)
    //   }
    // })
    // console.log(outputArr)
    // this.ingredients = outputArr;

    // solução 1
    // this.ingredients.slice().forEach(item => {
    //   const sameIngredient = ingredients.find(ingredient => ingredient.name === item.name);
    //   if (sameIngredient) {
    //     item.amount += sameIngredient.amount
    //   }
    // })
    // ingredients.slice().forEach(item => {
    //   const differentIngredient = this.ingredients.find(ingredient => ingredient.name === item.name);
    //   if(!differentIngredient) {
    //     this.ingredients.push(item);
    //   }

    // })

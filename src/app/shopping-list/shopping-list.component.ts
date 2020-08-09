import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Subscription, Observable, observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';



@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[]}>;

  mergedIngredients: Ingredient[];

  constructor(
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    //  this.store.select('shoppingList').subscribe(shopListData => {
    //   this.mergedIngredients = this.mergeIngredients(shopListData.ingredients)
    // })
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  // mergeIngredients(ingredients: Ingredient[]) {

  //   let names = []
  //   let newArr = []

  //   for (let ingr of ingredients) {

  //     if (names.indexOf(ingr.name) !== -1) {
  //       let index = names.indexOf(ingr.name)
  //       newArr[index].amount += ingr.amount

  //     } else {
  //       newArr.push(ingr)
  //     }

  //     names.push(ingr.name)
  //   }
  //   return newArr.slice();
  // }

  // let merged = mergeIngredients(array, array2)

  // console.log(merged)

  ngOnDestroy() {
  }
}

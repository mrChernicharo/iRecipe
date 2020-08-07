import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';



@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[]}>;
  private ingChangeSubs: Subscription;

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
    ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.store.select('shoppingList').subscribe();

    // this.ingChangeSubs = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    // })
    // this.ingredients = this.slService.getIngredients();
  }

  onEditItem(index: number) {
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    // this.ingChangeSubs.unsubscribe();
  }
}

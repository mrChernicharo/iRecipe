import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients:  Ingredient[] = [];
  private ingChangeSubs: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingChangeSubs = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
    })
    this.ingredients = this.slService.getIngredients();
  }

  onEditItem(index: number) {
    console.log(`editItem: index -> ${index}`);
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy() {
    this.ingChangeSubs.unsubscribe();
  }
}

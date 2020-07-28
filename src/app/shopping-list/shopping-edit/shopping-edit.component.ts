import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model'
import { ShoppingListService } from '../shopping-list.service';
import { Form, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;


  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;

    });
  }

  onAddItem(form: NgForm) {
    const ingName = form.value.name;
    const ingAmount= form.value.amount;

    const newIngredident = new Ingredient(ingName, ingAmount);
    this.slService.addIngredient(newIngredident);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

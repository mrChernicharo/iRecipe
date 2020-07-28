import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

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
  @ViewChild('f', { static: false }) slForm: NgForm
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.slService.getIngredient(index);
      this.slForm.setValue({
        name : this.editedItem.name,
        amount: this.editedItem.amount
      })
    });
  }

  onSubmit(form: NgForm) {
    const ingName = form.value.name;
    const ingAmount= form.value.amount;
    const newIngredident = new Ingredient(ingName, ingAmount);

    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredident);
    } else {
      this.slService.addIngredient(newIngredident);
    }
    this.editMode = false
    form.reset()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

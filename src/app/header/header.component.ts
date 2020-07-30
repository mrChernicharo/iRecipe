import { Component, EventEmitter, Output } from '@angular/core';
import { dataStorageService } from '../shared/data-storage.service';

@Component({
	selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  collapsed = true;

  constructor(private dataService: dataStorageService) {}

  onSaveData() {
    this.dataService.storeRecipes();
  }

  onFetchData() {
    this.dataService.fetchRecipes();
  }
}



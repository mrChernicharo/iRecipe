import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as recipesActions from '../recipes/store/recipes.actions';
import * as authActions from '../auth/store/auth.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSub: Subscription;


  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {

    this.store.select('auth').pipe(
      map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      })
  }

  onSaveData() {
    // this.dataService.storeRecipes();
    this.store.dispatch(new recipesActions.StoreRecipes());
  }

  onFetchData() {
    // this.dataService.fetchRecipes().subscribe();
    this.store.dispatch(new recipesActions.FetchRecipes())
  }

  onLogout() {
    this.store.dispatch(new authActions.Logout())
    // this.authService.logout();
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}



import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
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
    private dataService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
    ) {}

  ngOnInit() {
    // this.authService.user.subscribe(user => {
    // this.store.select('auth').subscribe(authState => {

    //   this.isAuthenticated = !!authState.user;
    //   console.log(this.isAuthenticated)
    // });
    this.store.select('auth').pipe(
      map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      })
  }

  onSaveData() {
    this.dataService.storeRecipes();
  }

  onFetchData() {
    this.dataService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(new authActions.Logout())
    // this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}



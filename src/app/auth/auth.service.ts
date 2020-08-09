import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // public user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email, password, returnSecureToken: true }
      ).pipe(
        catchError(this.handleError),
        tap(responseData => {
        this.handleAuthentication(
          responseData.email,
          responseData.localId,
          responseData.idToken,
          +responseData.expiresIn)
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        { email, password, returnSecureToken: true }
      ).pipe(
        catchError(this.handleError),
        tap(responseData => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          )
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date (userData._tokenExpirationDate));

    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(new authActions.AuthenticateSuccess({
        email: loadedUser.email,
        id: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }))
      const expirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationTime);
    }
  }

  logout() {
    // this.user.next(null);
    this.store.dispatch(new authActions.Logout())
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationTime: number) {
    console.log(`token expiration ${expirationTime}ms`);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationTime); // <== set hardcoded ms to test userData expiration
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
      );
    // this.user.next(user);
    this.store.dispatch(new authActions.AuthenticateSuccess({
      email,
      id: userId,
      token,
      expirationDate: expirationDate
    }));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error has occured';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already in use';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email not found'
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Wrong password!'
        break;
    }
    return throwError(errorMessage);

  }
}


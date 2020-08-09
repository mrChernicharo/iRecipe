import { Actions, ofType, Effect } from '@ngrx/effects';

import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      )
      .pipe(
        map((resData: AuthResponseData) => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)
          return new AuthActions.AuthenticateSuccess({
            email: resData.email,
            id: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate
          });
        }),
        catchError(errorResponse => {
            let errorMessage = 'An unknown error has occured';
            if (!errorResponse.error || !errorResponse.error.error) {
              return of(new AuthActions.AuthenticateFail(errorMessage));
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
            return of(new AuthActions.AuthenticateFail(errorMessage));
        })
      );
    }),
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/'])
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey = 'AIzaSyDZqT-XyNwS91VLRESjKCKK-1B20gHKC5g'
  public user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
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
      .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
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

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth'])
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
      );
    this.user.next(user);
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


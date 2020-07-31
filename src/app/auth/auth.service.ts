import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey = 'AIzaSyDZqT-XyNwS91VLRESjKCKK-1B20gHKC5g'
  public user = new Subject<User>();

  constructor(
    private http: HttpClient
  ) { }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        { email, password, returnSecureToken: true }
      ).pipe(catchError(this.handleError), tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.idToken, responseData.localId, +responseData.expiresIn)
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {email, password,  returnSecureToken: true }
        ).pipe(catchError(this.handleError), tap(responseData => {
          this.handleAuthentication(responseData.email, responseData.idToken, responseData.localId, +responseData.expiresIn)
        })
      );
  }

  private handleAuthentication(email: string,  token: string, id: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      token,
      id,
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
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email not found'
      case 'INVALID_PASSWORD':
        errorMessage = 'Wrong password!'
    }
    return throwError(errorMessage);

  }
}


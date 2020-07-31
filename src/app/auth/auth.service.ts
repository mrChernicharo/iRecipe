import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey = 'AIzaSyDZqT-XyNwS91VLRESjKCKK-1B20gHKC5g'

  constructor(
    private http: HttpClient
  ) { }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        { email, password, returnSecureToken: true }
      ).pipe(
        catchError(errorResponse => {
          let errorMessage = 'An unknown error has occured';
          if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
          }
          switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'Email already in use';
          }
          return throwError(errorMessage)
        })
      )
  }
}


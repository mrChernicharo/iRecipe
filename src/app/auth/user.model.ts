export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() { // getter. prop that runs code
    if (!this._token || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

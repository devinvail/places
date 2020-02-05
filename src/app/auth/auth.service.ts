import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'abc';

  constructor(private router: Router) {}

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }
  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
    // this.router.navigateByUrl('./authPage');
  }
}

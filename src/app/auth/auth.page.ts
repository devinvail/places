import {AuthService} from './auth.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtr: LoadingController
  ) {}

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    this.authService.login();
    this.loadingCtr
      .create({keyboardClose: true, message: 'Logging in ...'})
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          // this.isLoading = false;
          this.router.navigateByUrl('/places/tabs/discover');
          loadingEl.dismiss();
        }, 1500);
      });
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    if (this.isLogin) {
      // send req to login server
    } else {
      // send req to login server
    }
  }

  switchMode() {
    this.isLogin = !this.isLogin;
  }
}

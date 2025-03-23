import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  login: boolean = true;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private account: AccountService, private router: Router) {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    });
  }

  submitLogin() {
    if(this.login) {
      this.account.signin(this.loginForm.value)
    } else {
      this.account.createAccount(this.loginForm.value)
    }
    this.router.navigate(['dashboard']);
  }
}

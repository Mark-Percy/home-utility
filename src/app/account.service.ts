import { createEnvironmentInjector, Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, Auth, signOut, signInWithEmailAndPassword, deleteUser, user} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private auth: Auth) { 
  }

  signin (loginForm: any) {
    signInWithEmailAndPassword(this.auth, loginForm.email, loginForm.password);
  }

  createAccount(loginForm: any) {
    createUserWithEmailAndPassword(this.auth, loginForm.email, loginForm.password);
  }

  signOut() {
    signOut(this.auth);
  }

  deleteAccount() {
    if(this.auth.currentUser) {
      console.log('Logged in');
      deleteUser(this.auth.currentUser)
    } else {
      console.log('Not Logged in');
      
    }
  }
  getUser() {
    return this.auth.currentUser
  }
}

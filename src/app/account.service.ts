import { createEnvironmentInjector, Injectable, signal } from '@angular/core';
import { createUserWithEmailAndPassword, Auth, signOut, signInWithEmailAndPassword, deleteUser, user, User} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  user$: Observable<User | null>;

  constructor(private auth: Auth) { 
    this.user$ = user(this.auth)
  }

  async signin (loginForm: any) {
    return await signInWithEmailAndPassword(this.auth, loginForm.email, loginForm.password);
  }

  async createAccount(loginForm: any) {
    return await createUserWithEmailAndPassword(this.auth, loginForm.email, loginForm.password);
  }

  async signOut() {
    await signOut(this.auth);
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
    console.log(this.user$);
    
    return this.user$
  }
}

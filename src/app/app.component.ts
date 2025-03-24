import { Component } from '@angular/core';
import { RouterOutlet, RouterLink} from '@angular/router';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'home-utility';
  user$: Observable<User | null>;
  userSub;
  user: User | null = null;

  constructor(private accountService: AccountService, private router: Router) {
    this.user$ = this.accountService.getUser();
    this.userSub = this.user$.subscribe((user) => {
      this.user = user
    })
  }
  async signOut() {
    await this.accountService.signOut();
    console.log('here')
    this.router.navigate(['login']);
  }

  deleteAccount() {
    this.accountService.deleteAccount();
  }
}

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink} from '@angular/router';
import { AccountService } from './account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'home-utility';

  constructor(private account: AccountService, private router: Router) {
  
  }
  signOut() {
    this.account.signOut();
    this.router.navigate(['login']);
  }

  deleteAccount() {
    this.account.deleteAccount();
  }
}

import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isAuth = false;
  title = 'laptops inventory';

  constructor(private userService: UserService) {
    this.userService.isAuth.subscribe((value) => {
      this.isAuth = value;
    });
  }
}

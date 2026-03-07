import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from "./features/auth/login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent],
  templateUrl: 'app.component.html'
})
export class AppComponent {}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  userRole: any;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.getUserRole(form.value.email);
    this.authService.getUserRoleListener().subscribe(
      data => {
        this.userRole = data;
        console.log(this.userRole[0].role);
      }
    );
    this.authService.login(form.value.email, form.value.password, 'user');
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

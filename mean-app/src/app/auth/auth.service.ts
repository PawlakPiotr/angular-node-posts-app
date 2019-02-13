import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private role = 'user';
  private user;

  userRole: string[] = [];
  users: any[] = [];
  usersSubject = new Subject<any[]>();
  users_for_admin: any[] = [];
  usersSubject_for_admin = new Subject<any[]>();
  userRoleSubject = new Subject<string[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getRole() {
    return this.role;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, role: string) {
    const authData: AuthData = { email: email, password: password, role: role };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string, role: string) {
    const authData: AuthData = { email: email, password: password, role: role };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.getUserRole(email);
          this.getUserRoleListener().subscribe(
            data => {
              this.user = data[0];
              this.role = this.user.role;
              console.log('ROLE ====> ' + this.role);
            }
          );
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  getUsers(userId) {
    this.http.get<{user: any}>('http://localhost:3000/api/user/' + userId)
    .subscribe( data => {
      console.log(data);
      this.users[0] = data;
      this.usersSubject.next([...this.users]);
    });
  }

  getUsersListener() {
    return this.usersSubject.asObservable();
  }

  getUserRole(email: string) {
    this.http.get<{ message: string; user: any}>('http://localhost:3000/api/user/role/' + email)
    .subscribe( data => {
      console.log(data);
      this.userRole[0] = data.user;
      this.userRoleSubject.next([...this.userRole]);
    });
  }

  getUserRoleListener() {
    return this.userRoleSubject.asObservable();
  }


  getUsersForAdmin() {
    this.http.get<{ message: string; users: any}>('http://localhost:3000/api/user/all')
    .subscribe( data => {
      console.log(data);
      this.users_for_admin = data.users;
      this.usersSubject_for_admin.next([...this.users_for_admin]);
    });
  }


  getUsersforAdminListeneer() {
    return this.usersSubject_for_admin.asObservable();
  }
}

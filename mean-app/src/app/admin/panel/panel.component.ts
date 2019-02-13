import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/posts/posts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  email: string;
  role: string;
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  users: any[] = [];

 ELEMENT_DATA: PeriodicElement[] = [];

  displayedColumns: string[] = ['email', 'role'];
  dataSource;
  selection;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.authService.getUsersForAdmin();
    this.authService.getUsersforAdminListeneer().subscribe(
      data => {
        this.users = data;
        console.log('#########################');
        console.log(this.users);

        for (let i = 0; i < this.users.length; i++) {
          this.ELEMENT_DATA.push({
            email: this.users[i].email,
            role: this.users[i].role
          });
        }
        console.log('$$$$$$$$$$$$$$$$$$$$$');
        console.log(this.ELEMENT_DATA);
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
        this.selection = new SelectionModel<PeriodicElement>(true, []);
      }
    );
  }

  ngOnInit() {
  }

}

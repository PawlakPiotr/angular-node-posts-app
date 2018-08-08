import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  // posts = [
  //   {title: 'First Post', content: 'Content of the first post'},
  //   {title: 'Second Post', content: 'Content of second post'},
  //   {title: 'Thirs Post', content: 'Third post conent here!'}
  // ];

  @Input() posts = [];


}

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService} from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;

  constructor(public postsService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsService.getPostsUpdateListener()
      .subscribe( (posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    // error ?!
    // this.postsSub.unsubscribe();
  }
}

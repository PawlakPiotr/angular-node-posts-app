import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitile = '';
  isLoading = false;

  private mode = 'create';
  private postId: string;

  form: FormGroup;
  post: Post;


  constructor(public postsService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: []})
    });
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postsService.getPost(this.postId);
        this.isLoading = false;
        this.form.setValue({
          title: this.post.title,
          content: this.post.content
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onAddPost() {

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {

      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content
      );

    } else {

      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );

    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});

    this.form.get('image').updateValueAndValidity();
  }

}

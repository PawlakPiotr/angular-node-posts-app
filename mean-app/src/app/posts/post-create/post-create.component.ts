import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { uploadType } from './upload-type.validator';

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
  imagePreview: string;
  posts: Post[];

  constructor(public postsService: PostService, public route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [uploadType]
      })
    });
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        console.log('edit');

        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        const post = this.postsService.getPost(this.postId);
        console.log(post);
        this.imagePreview = post.imagePath;
        this.form = this.fb.group({
          title: post.title,
          content: post.content,
          image: post.imagePath
        });

        this.isLoading = false;
      } else {
        console.log('create');
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
        this.form.value.content,
        this.form.value.image
      );
      console.log(this.form.value);
    } else {

      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );

    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});

    this.form.get('image').updateValueAndValidity();
    console.log(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

}

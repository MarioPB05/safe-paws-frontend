import {Component, OnInit} from '@angular/core';
import {HlmH3Directive} from '@spartan-ng/ui-typography-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmIconComponent, provideIcons} from '@spartan-ng/ui-icon-helm';
import {lucideCheck, lucideClock} from '@ng-icons/lucide';
import {NgForOf, NgIf} from '@angular/common';
import {GetPostResponse} from '@core/models/post.model';
import {UserService} from '@dashboard/services/user.service';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [
    HlmH3Directive,
    HlmButtonDirective,
    HlmIconComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './pet-card.component.html',
  providers: [provideIcons({ lucideCheck,lucideClock })]
})


export class PetCardComponent implements OnInit {

  loading = true;
  posts:GetPostResponse[]=[];

  constructor(private userService: UserService) {}

  ngOnInit():void {
    this.fetchClientPosts();
  }

  fetchClientPosts(): void {
    this.userService.getClientPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        console.log(this.posts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los posts:', err);
      }
    });
  }

}

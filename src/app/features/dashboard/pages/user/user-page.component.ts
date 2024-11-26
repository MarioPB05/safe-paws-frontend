import {Component, inject, OnInit} from '@angular/core';
import {PetCardComponent} from '@dashboard/components/pet-card/pet-card.component';
import {HlmH2Directive} from '@spartan-ng/ui-typography-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import { UserService} from '@dashboard/services/user.service';
import {toast} from 'ngx-sonner';
import {EditUser, User} from '@core/models/user.model';
import {EditClient} from '@core/models/client.model';
import {ImageUploaderComponent} from '@shared/components/image-uploader/image-uploader.component';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    PetCardComponent,
    HlmH2Directive,
    HlmInputDirective,
    ReactiveFormsModule,
    HlmButtonDirective,
    ImageUploaderComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './user-page.component.html',
})
export class UserPageComponent implements OnInit {

  user$ = new BehaviorSubject<User | null>(null);

  private _formBuilder = inject(FormBuilder);

  constructor(private userService: UserService) {}

  form = this._formBuilder.group({
    username:["",  Validators.maxLength(10)],
    email:["", Validators.email],
    name:[""],
    surname:[""],
    dni:["", Validators.maxLength(9)],
  });

  image: File | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.userService.getAuthenticatedUser().subscribe({
      next: (user) => {
        this.user$.next(user);
      },
      error: () => toast.error('Error al obtener tus datos')
    });
  }

  imageSelected(file: File) {
    this.image = file;
  }

  onSubmit() {
    this.isSubmitting = true;
    const { username, email, name, surname, dni} = this.form.value;

    if (this.form.valid) {
      const editClient: EditClient = {
        name: name,
        surname: surname,
        dni: dni,
        photo: null
      }

      const editUser: EditUser = {
        username: username,
        email: email,
        client: editClient
      }

      const formData = new FormData();

      formData.append('dto' , new Blob([JSON.stringify(editUser)], { type: 'application/json' }));

      if (this.image != null){
        formData.append('file', this.image )
      }

      this.userService.editClient(formData).subscribe({
        next: (updatedUser) => {
          this.user$.next(updatedUser);

          toast.success("Usuario Editado correctamente");

          this.form.reset();
        },
        error: () => toast.error('Error al editar el usuario'),
        complete: () => this.isSubmitting = false
      });
    } else {
      toast.error('Revisa los campos del formulario');

      this.isSubmitting = false;
    }
  }

}

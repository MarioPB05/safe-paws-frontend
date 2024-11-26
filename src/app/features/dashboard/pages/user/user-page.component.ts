import {Component, inject} from '@angular/core';
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

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    PetCardComponent,
    HlmH2Directive,
    HlmInputDirective,
    ReactiveFormsModule,
    HlmButtonDirective,
    ImageUploaderComponent
  ],
  templateUrl: './user-page.component.html',
})
export class UserPageComponent {

  user: User = {
    username: '',
    email: '',
    client: {
      name: '',
      surname: '',
      dni: '',
      photo: ''
  }
  };

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
        this.user = user;
        console.log('Usuario cargado exitosamente:', this.user);
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
      }
    });
  }

  imageSelected(file: File) {
    this.image = file;
    console.log(file)
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
          this.user.username = updatedUser.username;
          this.user.email = updatedUser.email;
          this.user.client.name = updatedUser.client.name;
          this.user.client.surname = updatedUser.client.surname;
          this.user.client.dni = updatedUser.client.dni;
          this.user.client.photo = updatedUser.client.photo;

          toast.success("Usuario Editado correctamente");
          this.form.reset()
        },
        error: (error) => {
          console.log(JSON.stringify(editUser));
          console.error('Error al editar el usuario:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      console.error('Formulario inválido');
      this.isSubmitting = false;
    }
  }

}

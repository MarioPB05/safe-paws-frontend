import {EditClient} from '@core/models/client.model';

export interface EditUser {
  username: string | null | undefined;
  email: string | null | undefined;
  client: EditClient;
}

export interface User {
  username: string;
  email: string;
  client:{
    name: string;
    surname: string;
    dni: string;
    photo: string;
  }
}

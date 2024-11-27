import {AddressRequest} from '@core/models/map.model';

export interface GetPostResponse{
  id: number;
  name: string;
  description: string;
  photo: string;
  status: string; // Por ejemplo: "PENDING", "ADOPTED"
  type: string; // Tipo de animal
  urgent: boolean;
  creationDate: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

export interface CreatePostRequest {
  name: string;
  description: string;
  typeId: number;
  address: AddressRequest;
}

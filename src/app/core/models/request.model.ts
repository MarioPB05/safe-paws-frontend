import {CreateRequestAnswer} from '@core/models/requestanswer.model';

export interface Request {
  requestId: number;
  requestDate: Date;
  requestStatus: number;
  ownerName: string;
  applierName: string;
  postName: string;
  postPhoto: string;
  message: string;
  addressVillage: string;
  deleted: boolean;
}

export interface CreateRequest {
  message: string,
  postId: number,
  answers: CreateRequestAnswer[]
}


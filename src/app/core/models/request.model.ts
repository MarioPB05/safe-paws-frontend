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


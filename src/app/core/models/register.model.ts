export class RegisterRequest {
  username!: string;
  password!: string;
  email!: string;
  name!: string;
  surname!: string;
  dni!: string;
  birthdate!: string;
  coordinateX!: number;
  coordinateY!: number;
  road!: string;
  neighborhood!: string | null;
  village!: string | null;
  province!: string;
  state!: string;
  postcode!: string | null;
  country!: string;
  countryCode!: string;
}

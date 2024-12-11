export interface Location {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: [string, string, string, string];
}

export interface LocationError {
  error: string;
}

export interface Address {
  road: string;
  neighbourhood: string;
  village: string;
  province: string;
  ISO3166_2_lvl6: string;
  state: string;
  ISO3166_2_lvl4: string;
  postcode: string;
  country: string;
  country_code: string;
}

export interface AddressRequest {
  coordinateX: number;
  coordinateY: number;
  road: string;
  neighborhood: string | null;
  village: string | null;
  province: string;
  state: string;
  postcode: string | null;
  country: string;
  countryCode: string;
}

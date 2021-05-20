export interface GoogleUser {
  id: string;
  displayName: string;
  name: Name;
  emails: Email[];
  photos: Photo[];
  provider: string;
  _raw: string;
  _json: JSON;
}

export interface JSON {
  sub: string;
  name: string;
  given_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export interface Email {
  value: string;
  verified: boolean;
}

export interface Name {
  givenName: string;
}

export interface Photo {
  value: string;
}

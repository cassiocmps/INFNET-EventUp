/** All fields are strings because they come directly from <input> elements. */
export interface EventFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  price: string;
}

export type EventFormErrors = Record<keyof EventFormData, string>;

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export type SignUpFormErrors = Record<keyof SignUpFormData, string>;

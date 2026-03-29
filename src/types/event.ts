export type EventCategory =
  | "workshop"
  | "fair"
  | "seminar"
  | "conference"
  | "meetup"
  | "sports"
  | "cultural"
  | "community"
  | "charity"
  | "other";

export type EventStatus = "active" | "cancelled";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  organizerId: string;
  organizerName: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  enrolled: number;
  price: number;
  status: EventStatus;
  createdAt: string;
}

export interface Category {
  value: EventCategory;
  label: string;
}

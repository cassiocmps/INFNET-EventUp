export type NotificationType = "update" | "cancellation";

export interface Notification {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

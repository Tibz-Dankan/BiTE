type Notification = {
  showCardNotification: boolean;
  cardNotificationType: "success" | "error" | "info" | "warning";
  cardMessage: string;
  autoCloseInMS?: number;
};

type TNotificationPayload = {
  type: "success" | "error" | "info" | "warning";
  message: string;
  autoCloseInMS?: number;
};

type NotificationAction = {
  showCardNotification: (
    notification: TNotification["notificationPayload"]
  ) => void;
  hideCardNotification: () => void;
};

export type TNotification = {
  notification: Prettify<Notification>;
  notificationPayload: Prettify<TNotificationPayload>;
  notificationAction: Prettify<NotificationAction>;
};

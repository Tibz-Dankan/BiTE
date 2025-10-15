import { create } from "zustand";
import type { TNotification } from "../types/notification";

type State = {
  notification: TNotification["notification"];
};

export const useNotificationStore = create<
  State & TNotification["notificationAction"]
>((set) => ({
  notification: {
    showCardNotification: false,
    cardNotificationType: "success",
    cardMessage: "",
    autoCloseInMS: 5000,
  },
  showCardNotification: (notification: TNotification["notificationPayload"]) =>
    set({
      notification: {
        showCardNotification: true,
        cardNotificationType: notification.type,
        cardMessage: notification.message,
        autoCloseInMS: notification.autoCloseInMS,
      },
    }),
  hideCardNotification: () =>
    set({
      notification: {
        showCardNotification: false,
        cardNotificationType: "success",
        cardMessage: "",
        autoCloseInMS: 5000,
      },
    }),
}));

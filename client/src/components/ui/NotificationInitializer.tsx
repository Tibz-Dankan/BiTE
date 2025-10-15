import React from "react";
import { useNotificationStore } from "../../stores/notification";
import { NotificationCard } from "./NotificationCard";

export const NotificationInitializer: React.FC = () => {
  const notification = useNotificationStore((state) => state.notification);
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  return (
    <div>
      {notification.showCardNotification && (
        <div>
          <NotificationCard
            type={notification.cardNotificationType}
            message={notification.cardMessage}
            onClose={hideCardNotification}
            autoCloseInMS={notification.autoCloseInMS}
          />
        </div>
      )}
    </div>
  );
};

import React, { Fragment, useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NotificationCardProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: () => void;
  autoCloseInMS?: number;
}

export const NotificationCard: React.FC<NotificationCardProps> = (props) => {
  const type = props.type;
  const message = props.message;
  const autoCloseInMS = props.autoCloseInMS ? props.autoCloseInMS : 5000;

  useEffect(() => {
    const toastEmitHandler = () => {
      toast(message, {
        position: "top-right",
        type: type,
        autoClose: autoCloseInMS,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    };

    toastEmitHandler();
  }, [autoCloseInMS, message, type]);

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Fragment>
  );
};

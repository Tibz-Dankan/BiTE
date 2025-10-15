// import ReactDOM from "react-dom";
// import React, { Fragment } from "react";
// import { Check, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

// interface NotificationCardProps {
//   type: string | null;
//   onClose: () => void;
//   message: string | null;
// }

// export const NotificationCard: React.FC<NotificationCardProps> = (props) => {
//   const type = props.type;
//   let bgColor;
//   let textColor;
//   let borderColor;
//   let icon;
//   let title;

//   if (type === "success") {
//     title = "success";
//     icon = <Check className="text-success w-5 h-5" />;
//     bgColor = "bg-(--success)";
//     textColor = "text-(--success)";
//     borderColor = "border-(--success)";
//   } else if (type === "error") {
//     title = "error";
//     icon = <AlertCircle className="text-error w-5 h-5" />;
//     bgColor = "bg-(--error)";
//     textColor = "text-(--error)";
//     borderColor = "border-(--error)";
//   } else if (type === "info") {
//     title = "info";
//     icon = <Info className="text-info w-5 h-5" />;
//     bgColor = "bg-(--info)";
//     textColor = "text-(--info)";
//     borderColor = "border-(--info)";
//   } else if (type === "warning") {
//     title = "warning";
//     icon = <AlertTriangle className="text-warning w-5 h-5" />;
//     bgColor = "bg-(--warning)";
//     textColor = "text-(--warning)";
//     borderColor = "border-(--warning)";
//   } else {
//     title = "info";
//     icon = <Info className="text-info w-5 h-5" />;
//     bgColor = "bg-(--info)";
//     textColor = "text-(--info)";
//     borderColor = "border-(--info)";
//   }

//   const createAppendPortalElement = () => {
//     const portalElement = document.createElement("div");
//     portalElement.setAttribute("id", "notification");
//     const body = document.body;
//     body.appendChild(portalElement);
//   };

//   createAppendPortalElement();

//   return (
//     <Fragment>
//       {ReactDOM.createPortal(
//         <div
//           className="w-full fixed top-0 grid place-items-center
//            z-[80]"
//         >
//           <div
//             className="absolute top-5 md:right-5  z-[10000] flex w-72 h-auto
//              animate-move-in-left items-start rounded-[2px]
//             bg-white pl-3 text-lg shadow-xl"
//           >
//             <div
//               className={`absolute left-0 top-0 h-full w-3 ${bgColor}
//                border-y-[1px] rounded-l-[2px] ${borderColor}`}
//             />
//             <div
//               className={`flex-1 border-[1px] border-gray-300/50 flex-col
//                  items-start rounded-[2px] p-2 text-lg`}
//             >
//               <span
//                 className="absolute right-2 top-2 cursor-pointer"
//                 onClick={props.onClose}
//               >
//                 <X className="text-[#868e96] w-5 h-5" />
//               </span>
//               <div
//                 className={`flex items-center justify-start gap-2 ${textColor}`}
//               >
//                 <div>{icon}</div>
//                 <span className="first-letter:uppercase">{title}</span>
//               </div>
//               <div className="text-gray-700">
//                 <span className="text-sm leading-[4px]">{props.message}</span>
//               </div>
//             </div>
//           </div>
//         </div>,
//         document.getElementById("notification")!
//       )}
//     </Fragment>
//   );
// };

// <ToastContainer
//     position="top-right"
//     autoClose={5000}
//     hideProgressBar={false}
//     newestOnTop={false}
//     closeOnClick
//     rtl={false}
//     pauseOnFocusLoss
//     draggable
//     pauseOnHover
//   />

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
        // autoClose: 5000,
        autoClose: autoCloseInMS,
        hideProgressBar: false,
        // closeOnClick: false,
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

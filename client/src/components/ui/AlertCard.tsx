import React, { Fragment } from "react";
import { CheckCircle, XCircle, InfoIcon, AlertTriangle } from "lucide-react";

interface AlertCardCardProps {
  type: string | null;
  message: string | null;
}

export const AlertCard: React.FC<AlertCardCardProps> = (props) => {
  const type = props.type;
  let bgColor;
  let iconBgColor;
  let textColor;
  let borderColor;
  let icon;

  if (type === "success") {
    icon = <CheckCircle className={`text-gray-50 w-5 h-5`} />;
    bgColor = "bg-(--success-bg)";
    iconBgColor = "bg-(--success)";
    textColor = "text-(--success)";
    textColor = "text-green-500";
    borderColor = "border-(--success)";
    borderColor = "border-green-200";
  } else if (type === "error") {
    icon = <XCircle className={`text-gray-50 w-5 h-5`} />;
    bgColor = "bg-(--error-bg)";
    iconBgColor = "bg-(--error)";
    textColor = "text-(--error)";
    borderColor = "border-(--error)";
  } else if (type === "info") {
    icon = <InfoIcon className={`text-gray-50 w-5 h-5`} />;
    bgColor = "bg-(--info-bg)";
    iconBgColor = "bg-(--info)";
    textColor = "text-(--info)";
    borderColor = "border-(--info)";
  } else if (type === "warning") {
    icon = <AlertTriangle className={`text-gray-50 w-5 h-5`} />;
    bgColor = "bg-(--warning-bg)";
    iconBgColor = "bg-(--warning)";
    textColor = "text-(--warning)";
    borderColor = "border-(--warning)";
  } else {
    icon = <InfoIcon className={`text-gray-50 w-5 h-5`} />;
    bgColor = "bg-(--info-bg)";
    iconBgColor = "bg-(--info)";
    textColor = "text-(--info)";
    borderColor = "border-(--info)";
  }

  return (
    <Fragment>
      <div
        className={`${bgColor} border-[1px] ${borderColor} p-2 flex items-center 
         gap-2 rounded-lg`}
      >
        <div
          className={`${iconBgColor} flex items-center justify-center p-2 
           rounded-md`}
        >
          <span>{icon}</span>
        </div>
        <div className={`flex-1`}>
          <div className="text-gray-700">
            <span className={`text-sm leading-[4px] ${textColor}`}>
              {props.message}
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

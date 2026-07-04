import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface SatsRewardStatusBadgeProps {
  status: string;
}

export const SatsRewardStatusBadge: React.FC<SatsRewardStatusBadgeProps> = ({
  status,
}) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "PENDING":
        return {
          label: "Pending",
          icon: Clock,
          color: "text-amber-600",
          bgColor: "bg-amber-100",
        };
      case "FAILED":
        return {
          label: "Failed",
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: "text-slate-600",
          bgColor: "bg-slate-100",
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.bgColor}`}
    >
      <StatusIcon size={14} className={statusInfo.color} />
      <span className={`text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    </div>
  );
};

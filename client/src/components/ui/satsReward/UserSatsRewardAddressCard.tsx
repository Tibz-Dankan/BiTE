import React from "react";
import { useNotificationStore } from "../../../stores/notification";
import { Copy, ShieldCheck, ShieldAlert, Wallet, Star } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import type { SatsRewardAddress } from "../../../types/satsReward";

interface UserSatsRewardAddressCardProps {
  address: SatsRewardAddress;
}

export const UserSatsRewardAddressCard: React.FC<
  UserSatsRewardAddressCardProps
> = ({ address }) => {
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(address.address);
    showCardNotification({
      type: "success",
      message: "Address copied to clipboard!",
    });
  };

  return (
    <div
      className="w-full bg-white rounded-2xl shadow-md border
       border-slate-100 p-4 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl ${
              address.isDefault
                ? "bg-amber-50 text-amber-600"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <Wallet size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800">Payout Address</h3>
              {address.isDefault && (
                <div
                  className="flex items-center gap-1 bg-amber-100 text-amber-600
                  px-2 py-0.5 rounded-full"
                >
                  <Star size={10} fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase">
                    Default
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Added on {formatDate(address.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div
        className="w-full flex items-center justify-between gap-4 bg-slate-50 
         p-4 rounded-xl mb-4 relative z-10"
      >
        <p
          className="flex-1 text-sm font-mono text-slate-700 break-all
          leading-relaxed"
        >
          {address.address}
        </p>
        <button
          onClick={handleCopy}
          className="w-10 h-10 p-2 hover:bg-slate-50 rounded-lg text-slate-400 
          transition-colors flex items-center justify-center z-20 cursor-pointer"
          title="Copy Address"
        >
          <Copy size={18} />
        </button>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {address.isVerified ? (
            <div
              className="flex items-center gap-1.5 text-green-600 bg-green-50
              px-3 py-1 rounded-full"
            >
              <ShieldCheck size={14} />
              <span className="text-xs font-bold uppercase tracking-tight">
                Verified
              </span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 text-amber-600 bg-amber-50
              px-3 py-1 rounded-full"
            >
              <ShieldAlert size={14} />
              <span className="text-xs font-bold uppercase tracking-tight">
                Unverified
              </span>
            </div>
          )}
        </div>

        {!address.isVerified && (
          <button
            type="button"
            className="text-xs font-bold text-(--primary) hover:underline"
          >
            Verify Now
          </button>
        )}
      </div>
    </div>
  );
};

import React from "react";
import { AdminRankingList } from "../../ui/ranking/AdminRankingList";

export const AdminRankingView: React.FC = () => {
  return (
    <div className="w-full mt-4 px-4 lg:px-0">
      <AdminRankingList />
    </div>
  );
};

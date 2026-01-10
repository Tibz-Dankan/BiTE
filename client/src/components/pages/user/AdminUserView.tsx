import React, { Fragment } from "react";
import { AdminUserList } from "../../ui/user/AdminUserList";

export const AdminUserView: React.FC = () => {
  return (
    <Fragment>
      <div className="w-full flex-col px-0 py-4 sm:p-4 md:p-8">
        <AdminUserList />
      </div>
    </Fragment>
  );
};

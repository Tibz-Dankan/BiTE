import { DashboardSidebar } from "./Sidebar";
import { DashboardHeader } from "./Header";
import type { TRoute } from "../../types/routes";
import { DashboardFooter } from "./Footer";

interface DashboardLayoutProps {
  routes: TRoute;
  children: React.ReactNode;
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <>
      <DashboardSidebar routes={props.routes} />
      <div
        className="w-full lg:ml-64 lg:w-[calc(100vw-280px)] min-h-screen
        flex flex-col justify-between"
      >
        <DashboardHeader routes={props.routes} />
        <main className="w-full flex-1 px-4 md:px-6 mx-auto mb-24">
          {props.children}
        </main>
        <DashboardFooter />
      </div>
    </>
  );
}

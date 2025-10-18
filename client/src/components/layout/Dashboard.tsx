import { DashboardSidebar } from "./Sidebar";
import { DashboardHeader } from "./Header";
import type { TRoute } from "../../types/routes";

interface DashboardLayoutProps {
  routes: TRoute;
  children: React.ReactNode;
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <>
      <DashboardSidebar routes={props.routes} />
      <div className="w-full lg:ml-64 lg:w-[calc(100vw-256px)] min-h-screen">
        <DashboardHeader routes={props.routes} />
        <main className="w-full p-4 md:p-6 lg:p-8 mx-auto">
          {props.children}
        </main>
      </div>
    </>
  );
}

import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import type { TRoute } from "../../types/routes";

interface DashboardLayoutProps {
  routes: TRoute;
  children: React.ReactNode;
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <>
      <DashboardSidebar routes={props.routes} />
      <div className="w-full pl-[240px] bg-[#f0f1f3] min-h-screen">
        <DashboardHeader routes={props.routes} />
        <main className="w-full p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {props.children}
        </main>
      </div>
    </>
  );
}

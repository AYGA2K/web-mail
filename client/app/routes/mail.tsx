import { Outlet } from "@remix-run/react";
import MailSidebar from "~/components/sidebar";
import MailTopNav from "~/components/top-nav";

export default function MailLayout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <MailSidebar />
      <div className="flex flex-col">
        <MailTopNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

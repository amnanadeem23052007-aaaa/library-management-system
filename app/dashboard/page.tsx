import DashboardCards from "@/components/dashboard/DashboardCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentBooks from "@/components/dashboard/RecentBooks";
import RecentMembers from "@/components/dashboard/RecentMembers";

export default function Dashboard() {
  return (
    <div className="space-y-8 sm:space-y-10" style={{ padding: "10px" }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ padding: "10px" }}>
          Library Dashboard
        </h1>
        <p className="mt-1.5 text-base text-slate-500 dark:text-slate-400" style={{ padding: "10px" }}>
          Welcome back, Librarian 👋 Here is an overview of your library operations.
        </p>
      </div>

      {/* Stats */}
      <section style={{ padding: "10px" }}>
        <DashboardCards />
      </section>

      {/* ROW 1: Recent Books full-width */}
      <section style={{ padding: "10px" }}>
        <RecentBooks />
      </section>

      {/* ROW 2: Quick Actions full-width below Recent Books */}
      <section style={{ padding: "10px" }}>
        <QuickActions />
      </section>

      {/* Members */}
      <section style={{ padding: "10px" }}>
        <RecentMembers />
      </section>
    </div>
  );
}   
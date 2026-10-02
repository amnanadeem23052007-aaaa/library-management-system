import MemberDashboardLayout from "@/components/layout/MemberDashboardLayout";
import { MemberRefreshProvider } from "@/components/member/MemberRefreshContext";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MemberRefreshProvider>
      <MemberDashboardLayout>
        {children}
      </MemberDashboardLayout>
    </MemberRefreshProvider>
  );
}
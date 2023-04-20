import { Dashboard } from "@/components/dashboard";
import { Header } from "@/components/header";
import { StyledDashboardPage } from "./style";
import { StyledDashboard } from "@/components/dashboard/style";

export default function DashboardPage() {
  return (
    <>
      <Header page="dashboard" />
      <StyledDashboardPage>
        <StyledDashboard>
          <Dashboard />
        </StyledDashboard>
      </StyledDashboardPage>
    </>
  );
}

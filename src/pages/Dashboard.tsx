import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import IndividualDashboard from "@/components/dashboard/IndividualDashboard";
import VerifierDashboard from "@/components/dashboard/VerifierDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

const Dashboard = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {role === "admin" && <AdminDashboard />}
      {role === "verifier" && <VerifierDashboard />}
      {(role === "individual" || !role) && <IndividualDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;

import { isAdminRequest } from "@/lib/admin-auth.server";
import { AdminDashboard, AdminLogin } from "@/components/bakery/admin-panel";
import { orders, subscribers } from "@/lib/store.server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminRequest();
  if (!authed) return <AdminLogin />;
  return <AdminDashboard orders={[...orders()].reverse()} subscribers={[...subscribers()].reverse()} />;
}

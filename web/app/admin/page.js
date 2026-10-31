import AdminOrders from "@/components/AdminOrders";

export const metadata = {
  title: "Orders · BlockBoost Ads",
  robots: { index: false, follow: false }, // keep it out of Google
};

// Page 3: the private orders page. It's locked by the admin key (see components/AdminOrders.js).
export default function AdminPage() {
  return (
    <main>
      <AdminOrders />
    </main>
  );
}

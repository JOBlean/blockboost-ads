import OrderForm from "@/components/OrderForm";
import { PACKAGES } from "@/lib/db";

export const metadata = { title: "Order an ad · BlockBoost Ads" };

// Page 2: where a customer places an order. The form itself is in components/OrderForm.js.
// searchParams holds the "?package=billboard" part of the link from the home page.
export default async function OrderPage({ searchParams }) {
  const { package: chosen } = await searchParams;
  return (
    <main>
      <div className="page-head">
        <p className="label">Order</p>
        <h1>Order your ad</h1>
        <p>Tell us about your game. Nothing is charged now: we message you to confirm first.</p>
      </div>
      <OrderForm packages={PACKAGES} initialPackage={chosen} />
    </main>
  );
}

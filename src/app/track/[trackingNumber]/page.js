import { redirect } from "next/navigation";

export default async function TrackPackageByNumberPage({ params }) {
  const { trackingNumber } = await params;
  redirect(`/track?trackingNumber=${encodeURIComponent(trackingNumber || "")}`);
}

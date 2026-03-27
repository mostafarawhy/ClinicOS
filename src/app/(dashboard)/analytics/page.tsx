import { getAnalyticsData } from "@/lib/queries/analytics";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return <AnalyticsClient data={data} />;
}

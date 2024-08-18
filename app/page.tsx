import { Dashboard } from "@/components/dashboard";
import { Recommendation } from "@/models";
import { EngagementDTO } from "@/types/engagement-dto";
import { headers } from "next/headers";

export default async function Home() {
  const baseUrl = headers().get("Host")!;

  const { engagements } = await fetch(
    new URL("/api/engagements", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ engagements: EngagementDTO[] }>);

  const { recommendations } = await fetch(
    new URL("/api/recommendations", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ recommendations: Recommendation[] }>);

  return (
    <Dashboard engagements={engagements} recommendations={recommendations} />
  );
}

export const dynamic = "force-dynamic";

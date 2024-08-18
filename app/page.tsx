import { Dashboard } from "@/components/dashboard";
import { MetricDTO } from "@/types/metric-dto";
import { PaginatedEngagementsDTO } from "@/types/paginated-engagements-dto";
import { RankingDTO } from "@/types/ranking-dto";
import { RecommendationDTO } from "@/types/recommendation-dto";
import { headers } from "next/headers";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const baseUrl = headers().get("Host")!;

  const page = Number(searchParams["page"]) || 1;
  const pageSize = Number(searchParams["pageSize"]) || 10;

  const { engagements } = await fetch(
    new URL(
      `/api/engagements?page=${page}&pageSize=${pageSize}`,
      `http://${baseUrl}`
    ),
    { cache: "no-store" }
  ).then(
    (res) => res.json() as Promise<{ engagements: PaginatedEngagementsDTO }>
  );

  const { recommendations } = await fetch(
    new URL("/api/recommendations", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then(
    (res) => res.json() as Promise<{ recommendations: RecommendationDTO[] }>
  );

  const { metric } = await fetch(new URL("/api/metrics", `http://${baseUrl}`), {
    cache: "no-store",
  }).then((res) => res.json() as Promise<{ metric: MetricDTO }>);

  const { ranking } = await fetch(
    new URL("/api/course-ranking", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ ranking: RankingDTO }>);

  return (
    <Dashboard
      engagements={engagements}
      recommendations={recommendations}
      metric={metric}
      ranking={ranking}
    />
  );
}

export const dynamic = "force-dynamic";

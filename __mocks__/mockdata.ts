import { PaginatedEngagementsDTO } from "@/types/paginated-engagements-dto";
import { MetricDTO } from "@/types/metric-dto";
import { RankingDTO } from "@/types/ranking-dto";
import { RecommendationDTO } from "@/types/recommendation-dto";

// Mock data
export const mockEngagements: PaginatedEngagementsDTO = {
  page: 1,
  pageSize: 10,
  total: 1000,
  items: [
    {
      id: "66c1c4b67390dc2ee4c23c9c",
      userName: "Mrs. Louise Weissnat",
      courseTitle: "AI Applications for Business Success",
      timestamp: "2024-08-18T09:53:58.242Z",
      timeSpent: 3315,
    },
  ],
};

export const mockRecommendations: RecommendationDTO[] = [
  {
    id: "66c1c4be7390dc2ee4c2410b",
    userId: "66c1c4b67390dc2ee4c23c64",
    courseId: "66c1c4b67390dc2ee4c23c87",
    createdAt: "2024-08-18T09:54:06.414Z",
  },
];

export const mockMetric: MetricDTO = {
  effectiveness: 66,
};

export const mockRanking: RankingDTO = {
  bestCourses: [
    {
      id: "66c1c4b67390dc2ee4c23c8c",
      title: "Machine Learning with Decision Trees and Random Forests",
      avgTimeSpent: 5551.83,
    },
  ],
  worstCourses: [
    {
      id: "66c1c4b67390dc2ee4c23c94",
      title: "Introduction to Business Analytics",
      avgTimeSpent: 4314.47,
    },
  ],
};

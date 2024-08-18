import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "@/components/dashboard";
import {
  mockEngagements,
  mockRecommendations,
  mockMetric,
  mockRanking,
} from "../__mocks__/mockdata";

describe("Dashboard", () => {
  it("renders dashboard component", () => {
    render(
      <Dashboard
        engagements={mockEngagements}
        recommendations={mockRecommendations}
        metric={mockMetric}
        ranking={mockRanking}
      />
    );

    const element = screen.getByText("Recommendations"); // Act

    expect(element).toBeInTheDocument(); // Assert
  });

  it("shows engagements information", () => {
    render(
      <Dashboard
        engagements={mockEngagements}
        recommendations={mockRecommendations}
        metric={mockMetric}
        ranking={mockRanking}
      />
    );

    const element = screen.getByText("Mrs. Louise Weissnat"); // Act

    expect(element).toBeInTheDocument(); // Assert
  });
});

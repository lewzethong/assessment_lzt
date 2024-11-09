import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FollowerCard from "@/components/follower-card";

describe("FollowerCard", () => {
  const mockFollower = {
    login: "testuser",
    id: 1,
    node_id: "test123",
    avatar_url: "https://example.com/avatar.jpg",
    html_url: "https://github.com/testuser",
    gravatar_id: "",
    url: "",
    followers_url: "",
    following_url: "",
    gists_url: "",
    starred_url: "",
    subscriptions_url: "",
    organizations_url: "",
    repos_url: "",
    events_url: "",
    received_events_url: "",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  };

  it("renders follower information correctly", () => {
    render(<FollowerCard follower={mockFollower} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByAltText("testuser")).toBeInTheDocument();
    expect(screen.getByText("View Repository")).toBeInTheDocument();
  });

  it("has correct GitHub profile link", () => {
    render(<FollowerCard follower={mockFollower} />);

    const link = screen.getByText("View Repository");
    expect(link).toHaveAttribute("href", mockFollower.html_url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

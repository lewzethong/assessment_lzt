import { Repository, UserDetails, Follower } from "./types";

export const getRepositories = async (): Promise<Repository[]> => {
  try {
    const response = await fetch("https://api.github.com/repositories");
    if (!response.ok) throw new Error("Failed to fetch repositories");
    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch repositories");
  }
};

export const getRepositoryByUser = async (
  username: string
): Promise<UserDetails> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error("Failed to fetch user data");
    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
};

export const getUserFollowers = async (
  username: string
): Promise<Follower[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/followers`
    );
    if (!response.ok) throw new Error("Failed to fetch followers");
    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch followers");
  }
};

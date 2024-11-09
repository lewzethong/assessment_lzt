import { Repository } from "./types";

export const getRepositories = async (): Promise<Repository[]> => {
  try {
    const response = await fetch("https://api.github.com/repositories");
    if (!response.ok) throw new Error("Failed to fetch repositories");
    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch repositories");
  }
};

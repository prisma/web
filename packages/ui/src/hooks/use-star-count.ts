import { useEffect, useState } from "react";

const GITHUB_API_URL = "https://api.github.com/repos/prisma/prisma";

type Repo = {
  name: string;
  stargazers_count: number;
};

export const useStarCount = () => {
  const [starCount, setStarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(GITHUB_API_URL);

        if (!response.ok) {
          throw new Error("Error fetching GitHub repository data");
        }

        const data: Repo = await response.json();
        setStarCount(data.stargazers_count);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStarCount();
  }, []);

  return { starCount, isLoading, error };
};

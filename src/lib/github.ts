import { unstable_cache } from "next/cache";

const FALLBACK_GITHUB_USERNAME = "DeryFerd";
const GITHUB_FETCH_TIMEOUT_MS = 8_000;
const rawGitHubUsername =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? FALLBACK_GITHUB_USERNAME;
const GITHUB_USERNAME = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(rawGitHubUsername)
  ? rawGitHubUsername
  : FALLBACK_GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REVALIDATE_SECONDS = 600;

interface GitHubUserResponse {
  login: string;
  html_url: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepoResponse {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  pushed_at: string;
  topics: string[];
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionResponse {
  total?: {
    lastYear?: number;
  };
  contributions?: ContributionDay[];
}

export interface GitHubProofData {
  username: string;
  profileUrl: string;
  avatarUrl: string | null;
  publicRepos: number | null;
  followers: number | null;
  following: number | null;
  createdAt: string | null;
  topTopics: string[];
  lastYearContributions: number | null;
  contributions: ContributionDay[];
  recentRepos: Array<{
    id: number;
    name: string;
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
    pushedAt: string;
    topics: string[];
  }>;
}

function getGitHubHeaders() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "dery-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GITHUB_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      next: { revalidate: REVALIDATE_SECONDS },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

const loadGitHubProofData = unstable_cache(
  async (): Promise<GitHubProofData> => {
  const [user, repos, contributions] = await Promise.all([
    fetchJson<GitHubUserResponse>(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: getGitHubHeaders(),
    }),
    fetchJson<GitHubRepoResponse[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=4&type=owner`,
      {
        headers: getGitHubHeaders(),
      },
    ),
    fetchJson<ContributionResponse>(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
    ),
  ]);

  const recentRepos =
    repos?.filter((repo) => !repo.fork).map((repo) => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      topics: repo.topics ?? [],
    })) ?? [];

  const normalizedContributions = [...(contributions?.contributions ?? [])].sort(
    (left, right) => left.date.localeCompare(right.date),
  );

  // Calculate top topics from all repos
  const topicCounts = new Map<string, number>();
  recentRepos.forEach((repo) => {
    repo.topics.forEach((topic) => {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    });
  });
  const topTopics = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([topic]) => topic);

  return {
    username: user?.login ?? GITHUB_USERNAME,
    profileUrl: user?.html_url ?? `https://github.com/${GITHUB_USERNAME}`,
    avatarUrl: user?.avatar_url ?? null,
    publicRepos: user?.public_repos ?? null,
    followers: user?.followers ?? null,
    following: user?.following ?? null,
    createdAt: user?.created_at ?? null,
    topTopics,
    lastYearContributions: contributions?.total?.lastYear ?? null,
    contributions: normalizedContributions,
    recentRepos,
  };
  },
  ["github-proof-data"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getGitHubProofData(): Promise<GitHubProofData> {
  return loadGitHubProofData();
}

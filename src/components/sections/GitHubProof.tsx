import type { CSSProperties } from "react";
import Link from "next/link";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import SectionHeadline from "@/components/ui/SectionHeadline";
import SectionSubheadline from "@/components/ui/SectionSubheadline";
import { getGitHubProofData } from "@/lib/github";
import styles from "./GitHubProof.module.css";

function formatRepoDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatInsightDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getDisplayLevel(count: number, level: number) {
  if (count <= 0) return 0;
  return Math.max(level, 1);
}

function formatMonthLabel(value: string) {
  const [year, month] = value.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function getMonthMarkers(contributions: Array<{ date: string }>) {
  const markers: Array<{ key: string; label: string; columnStart: number }> = [];
  let lastMonthKey = "";
  let lastColumnStart = -99;

  contributions.forEach((day, index) => {
    const monthKey = day.date.slice(0, 7);

    if (monthKey === lastMonthKey) {
      return;
    }

    const columnStart = Math.floor(index / 7) + 1;

    if (columnStart - lastColumnStart < 3) {
      lastMonthKey = monthKey;
      return;
    }

    markers.push({
      key: monthKey,
      label: formatMonthLabel(day.date),
      columnStart,
    });

    lastMonthKey = monthKey;
    lastColumnStart = columnStart;
  });

  return markers;
}

function getLongestStreak(
  contributions: Array<{ count: number }>,
) {
  let currentStreak = 0;
  let maxStreak = 0;

  contributions.forEach((day) => {
    if (day.count > 0) {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
      return;
    }

    currentStreak = 0;
  });

  return maxStreak;
}

function getPeakMonth(
  contributions: Array<{ date: string; count: number }>,
): { key: string; total: number } | null {
  const totals = new Map<string, number>();

  contributions.forEach((day) => {
    const monthKey = day.date.slice(0, 7);
    totals.set(monthKey, (totals.get(monthKey) ?? 0) + day.count);
  });

  let peakMonth: { key: string; total: number } | null = null;

  totals.forEach((total, key) => {
    if (!peakMonth || total > peakMonth.total) {
      peakMonth = { key, total };
    }
  });

  return peakMonth;
}

function buildMapNarrative({
  peakMonth,
  latestPush,
  activeDays,
  longestStreak,
}: {
  peakMonth: { key: string; total: number } | null;
  latestPush:
    | {
        name: string;
        language: string | null;
        pushedAt: string;
      }
    | null;
  activeDays: number;
  longestStreak: number;
}) {
  if (!peakMonth && !latestPush) {
    return "Public activity is visible here as a steady record of shipped work over the last year.";
  }

  const peakMonthLabel = peakMonth
    ? formatInsightDate(`${peakMonth.key}-01`)
    : "the most active stretch";
  const pushLabel = latestPush ? latestPush.name : "the latest repository";
  const pushDate = latestPush ? formatRepoDate(latestPush.pushedAt) : "recently";
  const languageLabel = latestPush?.language
    ? ` in ${latestPush.language}`
    : "";

  if (longestStreak >= 14) {
    return `Momentum peaked in ${peakMonthLabel}, and the latest visible push sits in ${pushLabel}${languageLabel}, updated ${pushDate}. That rhythm was backed by a ${longestStreak}-day streak across ${activeDays} active days.`;
  }

  if (activeDays >= 140) {
    return `Peak public output landed in ${peakMonthLabel}, while ${pushLabel}${languageLabel} remains the freshest visible push from ${pushDate}. The broader pattern still holds across ${activeDays} active days.`;
  }

  return `The strongest visible push landed in ${peakMonthLabel}, and the latest repo movement now points to ${pushLabel}${languageLabel}, updated ${pushDate}. It reads as steady iteration rather than a one-off spike.`;
}

export default async function GitHubProof() {
  const data = await getGitHubProofData();
  const activeDays = data.contributions.filter((day) => day.count > 0).length;
  const weekCount = Math.max(Math.ceil(data.contributions.length / 7), 1);
  const monthMarkers = getMonthMarkers(data.contributions);
  const longestStreak = getLongestStreak(data.contributions);
  const peakMonth = getPeakMonth(data.contributions);
  const latestPush = data.recentRepos[0] ?? null;
  const mapNarrative = buildMapNarrative({
    peakMonth,
    latestPush,
    activeDays,
    longestStreak,
  });
  const mapStyle = {
    "--week-count": weekCount,
  } as CSSProperties;

  return (
    <section className={`section ${styles.proof}`} id="proof">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerIcon} aria-hidden="true">
                *
              </span>
              <p className={styles.kicker}>Public proof</p>
            </div>
            <SectionHeadline
              text="A record of what I'm building."
              className={styles.title}
            />
            <SectionSubheadline
              text="Code is my primary language. While GitHub squares don't show the full complexity of a project, they do show my commitment to shipping something every day and iterating in the open."
              className={styles.text}
            />
            <div className={styles.identityRow}>
              {data.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.avatarUrl}
                  alt={`${data.username} GitHub avatar`}
                  className={styles.avatar}
                />
              ) : null}
              <div>
                <p className={styles.identityLabel}>GitHub</p>
                <Link
                  href={data.profileUrl}
                  className={styles.identityLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{data.username}
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Public repos</p>
              <AnimatedNumber
                className={styles.statValue}
                value={data.publicRepos}
              />
            </article>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Followers</p>
              <AnimatedNumber
                className={styles.statValue}
                value={data.followers}
              />
            </article>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Contributions</p>
              <AnimatedNumber
                className={styles.statValue}
                value={data.lastYearContributions}
              />
              <p className={styles.statMeta}>Last year</p>
            </article>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Active days</p>
              <AnimatedNumber className={styles.statValue} value={activeDays} />
              <p className={styles.statMeta}>With visible activity</p>
            </article>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Member since</p>
              <p className={styles.statValue}>
                {data.createdAt
                  ? new Date(data.createdAt).getFullYear()
                  : "N/A"}
              </p>
              <p className={styles.statMeta}>
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "GitHub member"}
              </p>
            </article>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Top topics</p>
              <div className={styles.statTopics}>
                {data.topTopics.length > 0 ? (
                  data.topTopics.slice(0, 3).map((topic) => (
                    <span key={topic} className={styles.topicTag}>
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className={styles.topicEmpty}>—</span>
                )}
              </div>
              <p className={styles.statMeta}>
                {data.topTopics.length > 0
                  ? `${data.topTopics.length} frequent tags`
                  : "Repository topics"}
              </p>
            </article>
          </div>
        </div>

        <div className={styles.board}>
          <div className={styles.mapPanel}>
            <div className={styles.panelHead}>
              <div>
                <p className={styles.panelLabel}>Contribution map</p>
                <p className={styles.panelCaption}>
                  Daily public activity over the last 365 days.
                </p>
              </div>
              <Link
                href={data.profileUrl}
                className={styles.panelLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open GitHub
              </Link>
            </div>

            {data.contributions.length > 0 ? (
              <div className={styles.mapWrap}>
                <div className={styles.dayLabels} aria-hidden="true">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>
                <div className={styles.mapScroll} style={mapStyle}>
                  <div className={styles.monthLabels} aria-hidden="true">
                    {monthMarkers.map((marker) => (
                      <span
                        key={marker.key}
                        className={styles.monthLabel}
                        style={{ gridColumnStart: marker.columnStart }}
                      >
                        {marker.label}
                      </span>
                    ))}
                  </div>
                  <div className={styles.mapGrid}>
                    {data.contributions.map((day) => (
                      <span
                        key={day.date}
                        className={styles.day}
                        data-level={getDisplayLevel(day.count, day.level)}
                        data-active={day.count > 0}
                        title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className={styles.emptyState}>
                Live contribution data is unavailable right now, but the GitHub
                profile link above still points to the source.
              </p>
            )}

            {data.contributions.length > 0 ? (
              <div className={styles.mapInsights}>
                <div className={styles.insightGrid}>
                  <article className={styles.insightItem}>
                    <p className={styles.insightLabel}>Longest streak</p>
                    <p className={styles.insightValue}>
                      {longestStreak > 0 ? `${longestStreak} days` : "Building"}
                    </p>
                    <p className={styles.insightMeta}>
                      Consecutive visible activity days
                    </p>
                  </article>

                  <article className={styles.insightItem}>
                    <p className={styles.insightLabel}>Peak month</p>
                    <p className={styles.insightValue}>
                      {peakMonth ? formatInsightDate(`${peakMonth.key}-01`) : "N/A"}
                    </p>
                    <p className={styles.insightMeta}>
                      {peakMonth
                        ? `${peakMonth.total} contribution${peakMonth.total === 1 ? "" : "s"}`
                        : "Monthly activity signal"}
                    </p>
                  </article>

                  <article className={styles.insightItem}>
                    <p className={styles.insightLabel}>Latest push</p>
                    <p className={styles.insightValue}>
                      {latestPush ? latestPush.name : "GitHub"}
                    </p>
                    <p className={styles.insightMeta}>
                      {latestPush
                        ? `Updated ${formatRepoDate(latestPush.pushedAt)}`
                        : "Recent repository activity"}
                    </p>
                  </article>
                </div>

                <div className={styles.mapLegend} aria-hidden="true">
                  <span className={styles.legendLabel}>Intensity</span>
                  <div className={styles.legendScale}>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={styles.legendDay}
                        data-level={level}
                      />
                    ))}
                  </div>
                  <span className={styles.legendMeta}>Low to high</span>
                </div>

                <p className={styles.mapNarrative}>{mapNarrative}</p>
              </div>
            ) : null}
          </div>

          <div className={styles.repoPanel}>
            <div className={styles.panelHead}>
              <div>
                <p className={styles.panelLabel}>Recent repository activity</p>
                <p className={styles.panelCaption}>
                  A quick read on what has been pushed most recently.
                </p>
              </div>
            </div>

            <div className={styles.repoList}>
              {data.recentRepos.length > 0 ? (
                data.recentRepos.map((repo, index) => (
                  <article key={repo.id} className={styles.repoItem}>
                    <div className={styles.repoMeta}>
                      <span className={styles.repoNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.repoDate}>
                        Updated {formatRepoDate(repo.pushedAt)}
                      </span>
                    </div>
                    <div className={styles.repoBody}>
                      <Link
                        href={repo.url}
                        className={styles.repoName}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </Link>
                      <p className={styles.repoDescription}>
                        {repo.description ??
                          "Repository with recent public activity."}
                      </p>
                      <div className={styles.repoTags}>
                        {repo.language ? <span>{repo.language}</span> : null}
                        <span>{repo.stars} stars</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p className={styles.emptyState}>
                  Recent repository data is unavailable at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

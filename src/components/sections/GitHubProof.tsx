import type { CSSProperties } from "react";
import Link from "next/link";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { getGitHubProofData } from "@/lib/github";
import styles from "./GitHubProof.module.css";

function formatRepoDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
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

export default async function GitHubProof() {
  const data = await getGitHubProofData();
  const activeDays = data.contributions.filter((day) => day.count > 0).length;
  const weekCount = Math.max(Math.ceil(data.contributions.length / 7), 1);
  const monthMarkers = getMonthMarkers(data.contributions);
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
            <h2 className={styles.title}>Public proof of steady execution.</h2>
            <p className={styles.text}>
              Repository activity is not the whole story, but it helps show
              consistency, iteration, and how often technical work turns into
              shipped output.
            </p>
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
                  rel="noreferrer"
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
                rel="noreferrer"
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
                        rel="noreferrer"
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

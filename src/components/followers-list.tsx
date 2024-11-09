"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Follower } from "@/utils/api/types";
import styles from "@/styles/components/followers-list.module.scss";
import FollowerCard from "./follower-card";

const FOLLOWERS_PER_PAGE = 10;
const LOAD_DELAY = 1000;

interface FollowersListProps {
  followers: Follower[];
}

const FollowersList = ({ followers }: FollowersListProps) => {
  const [visibleFollowers, setVisibleFollowers] = useState<Follower[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleFollowers(followers.slice(0, FOLLOWERS_PER_PAGE));
    setHasMore(followers.length > FOLLOWERS_PER_PAGE);
  }, [followers]);

  const loadMoreFollowers = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const start = page * FOLLOWERS_PER_PAGE;
      const end = start + FOLLOWERS_PER_PAGE;
      const nextBatch = followers.slice(start, end);

      if (nextBatch.length > 0) {
        setVisibleFollowers((prev) => [...prev, ...nextBatch]);
        setPage((p) => p + 1);
        setHasMore(end < followers.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, LOAD_DELAY);
  }, [page, followers, loadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore) {
          loadMoreFollowers();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loadMoreFollowers, loadingMore]);

  return (
    <div className={styles.followersContainer}>
      <h2>Followers</h2>
      <div className={styles.followersList}>
        {visibleFollowers.map((follower) => (
          <FollowerCard key={follower.id} follower={follower} />
        ))}
      </div>

      {loadingMore && (
        <div className={styles.loadingMore}>Loading more followers...</div>
      )}

      {hasMore && !loadingMore && (
        <div ref={loaderRef} className={styles.loadingTrigger} />
      )}

      {!hasMore && followers.length > 0 && (
        <div className={styles.endMessage}>End of followers list</div>
      )}
      {!hasMore && followers.length === 0 && (
        <div className={styles.noFollowers}>This user has no followers yet</div>
      )}
    </div>
  );
};

export default FollowersList;

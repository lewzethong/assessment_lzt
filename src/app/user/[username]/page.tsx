"use client";

import { useEffect, useState } from "react";
import {
  getRepositoryByUser,
  getUserFollowers,
} from "@/utils/api/repositories";
import { UserDetails, Follower } from "@/utils/api/types";
import styles from "@/styles/pages/user-detail.module.scss";
import Breadcrumb from "@/components/breadcrumb";
import FollowersList from "@/components/followers-list";

const UserDetailPage = ({ params }: { params: { username: string } }) => {
  const [owner, setOwner] = useState<UserDetails | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ownerData, followersData] = await Promise.all([
          getRepositoryByUser(params.username),
          getUserFollowers(params.username),
        ]);

        setOwner(ownerData);
        setFollowers(followersData);
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setOwner(null);
      setFollowers([]);
      setError(null);
    };
  }, [params.username]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading user details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>User not found</div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <Breadcrumb
        username={owner.login}
        avatarUrl={owner.avatar_url}
        name={owner.name}
      />
      <FollowersList followers={followers} />
    </main>
  );
};

export default UserDetailPage;

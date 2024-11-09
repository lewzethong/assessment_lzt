import Link from "next/link";
import { Follower } from "@/utils/api/types";
import styles from "@/styles/components/follower-card.module.scss";

interface FollowerCardProps {
  follower: Follower;
}

const FollowerCard = ({ follower }: FollowerCardProps) => {
  return (
    <div className={styles.followerCard}>
      <img
        src={follower.avatar_url}
        alt={follower.login}
        className={styles.followerAvatar}
      />
      <div className={styles.followerInfo}>
        <h3>{follower.login}</h3>
        <Link
          href={follower.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View GitHub Profile
        </Link>
      </div>
    </div>
  );
};

export default FollowerCard;

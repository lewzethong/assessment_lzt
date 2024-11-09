import Link from "next/link";
import { MdChevronRight } from "react-icons/md";
import styles from "@/styles/components/breadcrumb.module.scss";

interface BreadcrumbProps {
  username: string;
  avatarUrl: string;
  name: string | null;
}

const Breadcrumb = ({ username, avatarUrl, name }: BreadcrumbProps) => {
  return (
    <div className={styles.breadcrumb}>
      <Link href="/">Repositories</Link>
      <MdChevronRight />
      <div className={styles.userInfo}>
        <div className={styles.profileBadge}>
          <img src={avatarUrl} alt={username} />
        </div>
        <span className={styles.userName}>{name || username}</span>
      </div>
    </div>
  );
};

export default Breadcrumb;

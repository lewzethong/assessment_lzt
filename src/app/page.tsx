"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { getRepositories } from "@/utils/api/repositories";
import { Repository } from "@/utils/api/types";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import Link from "next/link";
import styles from "@/styles/Home.module.scss";

interface DescriptionCellProps {
  description: string | null;
  repoId: number;
  expandedDescriptions: number[];
  toggleDescription: (id: number) => void;
}

const DescriptionCell = ({
  description,
  repoId,
  expandedDescriptions,
  toggleDescription,
}: DescriptionCellProps) => {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        const element = descriptionRef.current;
        const lineHeight = parseInt(
          window.getComputedStyle(element).lineHeight
        );
        const isOverflowing = element.scrollHeight > lineHeight * 2;
        setHasOverflow(isOverflowing);
      }
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (descriptionRef.current) {
      resizeObserver.observe(descriptionRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [description]);

  if (!description) return null;

  const isExpanded = expandedDescriptions.includes(repoId);

  return (
    <div className={styles.descriptionCell}>
      <div
        ref={descriptionRef}
        className={`${styles.description} ${isExpanded ? styles.expanded : ""}`}
      >
        {description}
      </div>
      {hasOverflow && (
        <button
          className={styles.showMoreBtn}
          onClick={() => toggleDescription(repoId)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default function HomePage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [visibleRepositories, setVisibleRepositories] = useState<Repository[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>(
    []
  );
  const loaderRef = useRef<HTMLDivElement>(null);

  // Filter repositories based on search - moved outside useEffect
  const getFilteredRepositories = useCallback(() => {
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.owner.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repositories, searchTerm]);

  // Initial fetch
  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const data = await getRepositories();
      setRepositories(data);
      const initial = data.slice(0, 10);
      setVisibleRepositories(initial);
      setHasMore(data.length > 10);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch repositories");
      setLoading(false);
    }
  };

  // Reset when search changes
  useEffect(() => {
    const filtered = getFilteredRepositories();
    const initial = filtered.slice(0, 10);
    setVisibleRepositories(initial);
    setHasMore(filtered.length > 10);
    setCurrentPage(1);
  }, [searchTerm, getFilteredRepositories]);

  const loadMore = useCallback(() => {
    if (loadingMore) return;

    const filtered = getFilteredRepositories();
    setLoadingMore(true);

    setTimeout(() => {
      // Add slight delay to prevent rapid updates
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * 10;
      const endIndex = startIndex + 10;
      const nextBatch = filtered.slice(startIndex, endIndex);

      if (nextBatch.length > 0) {
        setVisibleRepositories((prev) => [...prev, ...nextBatch]);
        setCurrentPage(nextPage);
        setHasMore(endIndex < filtered.length);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 300);
  }, [currentPage, loadingMore, getFilteredRepositories]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && window.innerWidth < 768) {
          loadMore();
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
  }, [hasMore, loadMore, loadingMore]);

  const toggleDescription = (repoId: number) => {
    setExpandedDescriptions((prev) =>
      prev.includes(repoId)
        ? prev.filter((id) => id !== repoId)
        : [...prev, repoId]
    );
  };

  // Calculate paginated repositories for desktop view
  const paginatedRepositories = useMemo(() => {
    const filtered = getFilteredRepositories();
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage, pageSize, getFilteredRepositories]);

  const totalPages = useMemo(() => {
    return Math.ceil(getFilteredRepositories().length / pageSize);
  }, [pageSize, getFilteredRepositories]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <main className={styles.container}>
      <h1>Homepage</h1>

      <div className={styles.contentContainer}>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search repositories..."
            className={styles.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table view (desktop) */}
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Owner</th>
                <th>Repository</th>
                <th>URL</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRepositories.map((repo) => (
                <tr key={repo.id}>
                  <td className={styles.avatarCell}>
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      title={repo.owner.login}
                    />
                  </td>
                  <td>
                    <Link
                      href={`/user/${repo.owner.login}`}
                      className={styles.ownerLink}
                    >
                      {repo.owner.login}
                    </Link>
                  </td>
                  <td>{repo.name}</td>
                  <td className={styles.urlCell}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View "{repo.name}" repository
                    </a>
                  </td>
                  <td>
                    <DescriptionCell
                      description={repo.description}
                      repoId={repo.id}
                      expandedDescriptions={expandedDescriptions}
                      toggleDescription={toggleDescription}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.paginationContainer}>
            <div className={styles.pageSize}>
              <span className={styles.label}>Rows per page:</span>
              <select
                className={styles.select}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className={styles.count}>
                {(currentPage - 1) * pageSize + 1}-{currentPage * pageSize} of{" "}
                {repositories.length}
              </span>
            </div>

            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                title="First page"
              >
                <MdFirstPage size={20} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                title="Previous page"
              >
                <MdNavigateBefore size={20} />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                title="Next page"
              >
                <MdNavigateNext size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                title="Last page"
              >
                <MdLastPage size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Card view (mobile) with infinite scroll */}
        <div className={styles.cardGrid}>
          {visibleRepositories.map((repo) => (
            <div key={repo.id} className={styles.card}>
              <div className={styles.header}>
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  title={repo.owner.login}
                />
                <div className={styles.headerInfo}>
                  <h2>
                    <Link
                      href={`/user/${repo.owner.login}`}
                      className={styles.ownerLink}
                    >
                      {repo.owner.login}
                    </Link>
                  </h2>
                  <p className={styles.repoName}>
                    Repository: <span>{repo.name}</span>
                  </p>
                </div>
              </div>
              {repo.description && (
                <div className={styles.description}>{repo.description}</div>
              )}
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                View "{repo.name}" repository
              </a>
            </div>
          ))}
          {hasMore && (
            <div ref={loaderRef} className={styles.loadingMore}>
              Loading more...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

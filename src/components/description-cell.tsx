import { useState, useRef, useEffect } from "react";
import styles from "@/styles/components/description-cell.module.scss";

interface DescriptionCellProps {
  description: string | null;
  repoId: number;
  expandedDescriptions: number[];
  toggleDescription: (id: number) => void;
}

export const DescriptionCell = ({
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

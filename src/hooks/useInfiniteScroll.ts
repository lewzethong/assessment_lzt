import { useEffect, useState } from "react";

export const useInfiniteScroll = (callback: () => void) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Trigger when user has scrolled to the bottom (with 100px threshold)
      if (scrollHeight - scrollTop <= clientHeight + 100 && !isFetching) {
        setIsFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;

    callback();
    setIsFetching(false);
  }, [isFetching, callback]);

  return { isFetching };
};

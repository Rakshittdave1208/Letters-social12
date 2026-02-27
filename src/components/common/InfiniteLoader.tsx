import { useEffect, useRef } from "react";

type Props = {
  onLoadMore: () => void;
  hasNextPage?: boolean;
  isFetching?: boolean;
};

export default function InfiniteLoader({
  onLoadMore,
  hasNextPage,
  isFetching,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, onLoadMore]);

  return <div ref={ref} className="h-10" />;
}
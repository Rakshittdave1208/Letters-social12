import PageLayout from "../../features/posts/components/layout/PageLayout";
import AsyncBoundary from "./AsyncBoundary";

type Props = {
  isLoading: boolean;
  error: unknown;
  children: React.ReactNode;
};

export default function AppPage({
  isLoading,
  error,
  children,
}: Props) {
  return (
    <PageLayout>
      <AsyncBoundary isLoading={isLoading} error={error}>
        {children}
      </AsyncBoundary>
    </PageLayout>
  );
}
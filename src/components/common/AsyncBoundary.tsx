type Props = {
  isLoading: boolean;
  error: unknown;
  children: React.ReactNode;
};

export default function AsyncBoundary({
  isLoading,
  error,
  children,
}: Props) {
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Something went wrong.
      </div>
    );
  }

  return <>{children}</>;
}
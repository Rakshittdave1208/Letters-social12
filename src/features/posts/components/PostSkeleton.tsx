import Card from "../../../components/ui/Card";
import Skeleton from "../../../components/ui/Skeleton";

export default function PostSkeleton() {
  return (
    <Card>
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </Card>
  );
}
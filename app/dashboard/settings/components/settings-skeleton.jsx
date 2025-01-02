import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsSkeleton = () => {
  return (
    <Card>
      <CardContent className="pt-4">
        <div value="profile">
          <div className="space-y-4">
            {/* Form Fields Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
            {/* Submit Button Skeleton */}
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsSkeleton;
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton = () => {
  return (
    <Card>
      <div>
        <div className="flex flex-col items-center space-y-6 p-6 pb-2">
          <div className="relative">
            {/* Avatar Skeleton */}
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="absolute bottom-0 right-0 h-8 w-8 rounded-full" />
          </div>

          {/* Tabs Skeleton */}
          <div className="grid w-full max-w-md grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </div>

        <CardContent className="pt-4">
          <div>
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
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>
              {/* Submit Button Skeleton */}
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProfileSkeleton;
import React, { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PageContainerProps {
  children: ReactNode;
  scrollable?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  scrollable = true
}) => {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100vh-52px)]">
          <div className="h-full p-4 md:px-6">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full p-4 md:px-6">{children}</div>
      )}
    </>
  );
}

export default PageContainer
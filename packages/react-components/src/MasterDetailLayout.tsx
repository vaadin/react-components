import { MasterDetailLayout as _MasterDetailLayout } from './generated/MasterDetailLayout.js';
import React, { useLayoutEffect, useRef, useState } from 'react';

export * from './generated/MasterDetailLayout.js';

type MasterProps = React.PropsWithChildren<{}>;
type DetailProps = React.PropsWithChildren<{}>;

function Master({ children }: MasterProps) {
  return children;
}

function Detail({ children }: DetailProps) {
  const [hasContent, setHasContent] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hasChildren = ref.current ? ref.current.childElementCount > 0 : false;
    setHasContent(hasChildren);
  });

  return (
    <div ref={ref} slot={hasContent ? 'detail' : 'detail_hidden'} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}

const MasterDetailLayout = _MasterDetailLayout as React.ComponentType<
  React.ComponentProps<typeof _MasterDetailLayout>
> & {
  Master: React.FC<MasterProps>;
  Detail: React.FC<DetailProps>;
};
MasterDetailLayout.Master = Master;
MasterDetailLayout.Detail = Detail;

export { MasterDetailLayout };

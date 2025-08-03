/*Компонент підключає React Query через <QueryClientProvider> і передає в нього вже готові дані з сервера, щоб не завантажувати їх заново на клієнті.*/

'use client';

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  type DehydratedState,
} from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

type TanStackProviderProps = {
  children: ReactNode;
  dehydratedState?: DehydratedState;
};

export default function TanStackProvider({
  children,
  dehydratedState,
}: TanStackProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}

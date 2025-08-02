import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import NoteDetailsClient from './NoteDetails.client';

type Props = {
  params: { id: string };
};

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = params;
  const queryClient = new QueryClient();

  // console.log('Prefetching note with id:', params.id);

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  // console.log('Prefetch done');

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanStackProvider>
      <HydrationBoundary state={dehydratedState}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </TanStackProvider>
  );
}

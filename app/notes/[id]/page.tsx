import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import NoteDetailsClient from '../NoteDetails.client';

interface NoteDetailsPageProps {
  params: { id: string };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const queryClient = new QueryClient();

  console.log('Prefetching note with id:', params.id);

  await queryClient.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  console.log('Prefetch done');

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanStackProvider>
      <HydrationBoundary state={dehydratedState}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </TanStackProvider>
  );
}

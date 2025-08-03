/*Компонент для відображення деталей нотатки з використанням SSR
Здійснює попереднє завантаження даних
Гідратацію кешу
 Передачу данних клієнтському компоненту NoteDetailsClient.*/

import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import TanstackProvider from '@/components/TanStackProvider/TanStackProvider';
import NoteDetailsClient from './NoteDetails.client';

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanstackProvider dehydratedState={dehydratedState}>
      <NoteDetailsClient />
    </TanstackProvider>
  );
}

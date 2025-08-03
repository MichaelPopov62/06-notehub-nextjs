// Серверний компонент NotesPage - забезпечує SSR та гідрацію даних

import { QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Notes from './Notes.client';

export default async function NotesPage() {
  const queryClient = new QueryClient();
  // initialNotes - початкові дані нотаток, отримані на сервері для гідрації
  const initialNotes = await fetchNotes({ page: 1, perPage: 10, search: '' });

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, ''],
    queryFn: () => Promise.resolve(initialNotes),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <TanStackProvider dehydratedState={dehydratedState}>
      <Notes initialNotes={initialNotes} />
    </TanStackProvider>
  );
}

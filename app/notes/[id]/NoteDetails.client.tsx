// // /*Компонент: Клієнтський ('use client'.Працює в парі з SSR-компонентом page.tsx
// //  Що робить: Отримання ID з URL
// //  Запит даних
// //  Показує стан завантаження через лоадинг
// //  Стан помилки
// //  Відображає деталі нотатки*/

'use client';
// import { fetchNotes } from '@/lib/api';
// import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetailsClient.module.css';

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  // виконання вимоги: перевести  параметр id з рядка у число,
  const idNumber = id ? Number(id) : NaN;
  const isValidId = !isNaN(idNumber);

  //  всі нотатки для перегляду id(перевіряю на викликах)- перевірка
  // useEffect(() => {
  //   async function showNotesList() {
  //     const { notes } = await fetchNotes();
  //     console.log('Список нотаток для тесту:');
  //     notes.forEach((note) => console.log(` ${note.id} — ${note.title}`));
  //   }

  //   showNotesList();
  // }, []);

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(idNumber.toString()),
    enabled: isValidId,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    const message = (error as Error)?.message || 'Error loading note.';
    return <p>Error: {message}</p>;
  }

  if (!note) return <p>Note not found.</p>;

  const formattedDate = note.updatedAt
    ? ` Updated: ${new Date(note.updatedAt).toLocaleString()}`
    : `Created: ${new Date(note.createdAt).toLocaleString()}`;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formattedDate}</p>
      </div>
    </div>
  );
}

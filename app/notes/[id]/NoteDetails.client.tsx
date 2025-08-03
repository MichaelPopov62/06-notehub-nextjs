/*Компонент: Клієнтський ('use client'.Працює в парі з SSR-компонентом page.tsx
 Що робить: Отримання ID з URL
 Запит даних
 Показує стан завантаження через лоадинг
 Стан помилки
 Відображає деталі нотатки*/

'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { useParams } from 'next/navigation';
import css from './NoteDetailsClient.module.css';

export default function NoteDetailsClient() {
  const params = useParams();

  // Якщо id - число, конвертуємо рядок у число
  const id = params.id ? Number(params.id) : null;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id?.toString() ?? ''),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

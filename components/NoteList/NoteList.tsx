/*Компонент який показує список нотаток і дозволяє видаляти кожну з них.
Після видалення кеш оновлюється, щоб показати актуальні дані.*/

import { useState } from 'react';
import type { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api';
import css from './NoteList.module.css';
import Link from 'next/link';

// Типи пропсів
interface NoteListProps {
  notes: Note[]; // список нотатків
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Налаштовання мутаціі для видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] }); // оновленя кешу
      setErrorMessage(null);
      setSuccessMessage(`Note ${variables} successfully deleted`);
      // додаю прибирання повідомлення через 3 секунди
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || 'Failed to delete note');
      setSuccessMessage(null);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id.toString());
  };

  //Список нотатків
  return (
    <>
      {errorMessage && <p className={css.error}>{errorMessage}</p>}
      {successMessage && <p className={css.successMessage}>{successMessage}</p>}
      {deleteMutation.isPending && (
        <p className={css.loading}>Delete a note...</p>
      )}
      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              {<span className={css.tag}>{note.tag}</span>}

              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>

              <button
                className={css.button}
                type="button"
                onClick={() => handleDelete(note.id.toString())}
                disabled={deleteMutation.isPending}
              >
                {/*користувач бачить зміну надпису кнопки якщо відбуваеться
                видалення*/}
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

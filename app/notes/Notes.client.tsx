// /*Це клієнтський компонент, який реалізує повну логіку для сторінки /notes, зокрема:
// Пошук
// Пагінацію
// Отримання данних
// Лоадер
// Обробляє помилки запиту
// Відображає нотаток
// Повідомляє про відсутність результату
// Створення нототка через модалку
// Закриття модалки через ESC
// */

'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, type FetchNotesResponse } from '@/lib/api';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import css from './page.module.css';

const PER_PAGE = 10;
const MIN_LOADING_TIME = 100;

interface NotesClientProps {
  initialNotes: FetchNotesResponse;
}

export default function Notes({ initialNotes }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const updateSearchQuery = useDebouncedCallback((newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
  }, 300);

  const { data, isLoading, isError, isSuccess } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ['notes', currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: searchQuery,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    initialData:
      currentPage === 1 && searchQuery === '' ? initialNotes : undefined,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setShowLoader(true);
    } else {
      timeoutId = setTimeout(() => setShowLoader(false), MIN_LOADING_TIME);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const handlePageChange = (selected: number) => setCurrentPage(selected);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={updateSearchQuery} />

        {!showLoader && isSuccess && data?.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create Note +
        </button>
      </header>

      <>
        {showLoader && <Loader message="Interesting notes...." />}

        {!showLoader && isError && (
          <Loader
            message="There was a pardon for the enchanted notes"
            color="#D62727"
          />
        )}

        {!showLoader && isSuccess && data?.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}

        {!showLoader &&
          isSuccess &&
          data?.notes.length === 0 &&
          searchQuery.trim() !== '' && (
            <p className={css.noResults}>Notation not found after the search</p>
          )}
      </>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

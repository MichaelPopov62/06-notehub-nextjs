/*API-сервіс для роботи з нотатками через бекенд
Використовується у SSR та CSR компонентах 
Авторизаційний токен
Адреса бекенду*/

import axios from 'axios';
import type { Note } from '../types/note';
import type { AxiosError } from 'axios';

// Токен авторизації
const NEXT_PUBLIC_NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
// Базова URL-адреса бекенду
const BASE_URL = 'https://notehub-public.goit.study/api';

// Інтерфейс параметрів для отримання нотаток через API
export interface FetchNotesParams {
  page?: number;
  search?: string;
  perPage?: number;
}

// Інтерфейс даних нової нотатки для створення
export interface DataNewNotes {
  title: string;
  content: string;
  tag: string;
}

// Інтерфейс відповіді сервера при отриманні нотаток
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Функція отримання нотаток з бекенду
export async function fetchNotes({
  page = 1,
  perPage = 10,
  search = '',
}: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: {
      page,
      perPage,
      // передаю параметр пошуку лише якщо він не порожній
      ...(search.trim() !== '' ? { search } : {}),
    },
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });

  const data = response.data;

  if (!data.notes || !Array.isArray(data.notes)) {
    return {
      notes: [],
      totalPages: 0,
    };
  }
  /* Повертаю отримані нотатки і загальну кількість сторінок
Якщо сервер не надіслав кількість сторінок, вважаємо, що їх 1. */
  return {
    notes: data.notes,
    totalPages: data.totalPages ?? 1,
  };
}

export async function fetchNoteById(id: string): Promise<Note> {
  // console.log('Token:', NEXT_PUBLIC_NOTEHUB_TOKEN);
  try {
    const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      },
    });
    // console.log(response.data);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    // Глобальна критична помилка (або відсутність відповіді)
    if (!axiosError.response || axiosError.response.status >= 500) {
      throw new Error(axiosError.message || 'Server error while fetching note');
    }

    // Локальна помилка
    const message =
      axiosError.response?.data?.message || `Note with id ${id} not found`;

    throw new Error(message);
  }
}

// Функція створення нової нотатки
export async function createNote(newNote: DataNewNotes): Promise<Note> {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, newNote, {
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}

// Функція видалення нотатки за ID
export async function deleteNote(id: string): Promise<Note> {
  // Відправляю DELETE-запит з ID нотатки та токеном авторизації
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}

/*Глобальний обробник помилок для маршруту /notes/[id].
Використовується, якщо сервер або мережа не змогли повернути дані нотатки.
*/

'use client';

import React from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function NoteDetailsError({ error, reset }: ErrorProps) {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

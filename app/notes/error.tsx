/*Глобальний обробник помилок для маршруту /notes.
Діє коли проблеми створює не користувач.
Користувач може повторити спробу (reset()).*/

'use client';

import React from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function NotesListError({ error, reset }: ErrorProps) {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

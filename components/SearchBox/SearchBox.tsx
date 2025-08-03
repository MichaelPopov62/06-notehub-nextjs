/*Код реалізує пошукове поле (input)
Контролюється зовнішнім станом через проп value.
 Кожна зміна тексту викликає функцію onSearch з новим значенням, щоб батьківський компонент міг обробити пошуковий запит.*/

'use client';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onSearch: (query: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); // Виклик функції з новим текстом
  };

  return (
    <input
      className={css.searchInput}
      type="text"
      placeholder="Search notes"
      value={value} // контрольований input
      onChange={handleChange}
    />
  );
}

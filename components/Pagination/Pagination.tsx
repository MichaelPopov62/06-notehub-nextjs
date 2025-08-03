/* Компонент Pagination реалізує пагінацію сторінок з використанням бібліотеки ReactPaginate.
Отримує кількість сторінок, поточну сторінку та колбек для зміни сторінки.
Відображає навігацію по сторінках та передає номер обраної сторінки у батьківський компонен*/

import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: number) => void; //selected берется не из кода, а генерируется ReactPaginate.
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      // Отримую об'єкт з властивістю selected — беру саме це число (номер вибраної сторінки).
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      pageRangeDisplayed={5}
      marginPagesDisplayed={3}
      previousLabel="←"
      nextLabel="→"
    />
  );
}

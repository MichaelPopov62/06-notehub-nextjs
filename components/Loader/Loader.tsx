import { HashLoader } from 'react-spinners';
import css from './Loader.module.css';

interface LoaderProps {
  message?: string;
  size?: number;
  color?: string;
  speedMultiplier?: number;
}

export default function Loader({
  message = ' Loading...',
  size = 60,
  color = '#2737d6',
  speedMultiplier = 2,
}: LoaderProps) {
  return (
    <div className={css.loaderWrapper}>
      <HashLoader size={size} color={color} speedMultiplier={speedMultiplier} />
      <p className={css.text}>{message}</p>
    </div>
  );
}

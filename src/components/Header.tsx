import reactLogo from '../assets/react.svg';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Genewiz Microservices POC</h1>
      <p className={styles.subtitle}>Order Management System</p>
      <img src={reactLogo} alt="React Logo" className={styles.logo} />
    </header>
  );
};


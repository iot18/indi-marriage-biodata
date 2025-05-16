import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        &copy; {new Date().getFullYear()} Biodata SaaS. All rights reserved.
      </div>
    </footer>
  );
}

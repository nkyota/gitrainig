import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Git Basics
        </Link>

        <button 
          className={styles.menuButton} 
          onClick={toggleMenu}
          aria-label="メニューを開く"
        >
          <span className={styles.menuIcon}></span>
        </button>

        <div className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/learn" className={styles.navLink}>
                学習を始める
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/learn/simulator" className={styles.navLink}>
                Gitシミュレーター
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/learn/challenges" className={styles.navLink}>
                チャレンジ
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink}>
                Gitについて
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

import styles from '../styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>Git Basics</h3>
            <p className={styles.description}>
              初心者のためのGit学習サイト。
              インタラクティブな学習体験でGitの基本を身につけましょう。
            </p>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.title}>リンク</h3>
            <ul className={styles.links}>
              <li>
                <Link href="/learn" className={styles.link}>
                  学習を始める
                </Link>
              </li>
              <li>
                <Link href="/learn/simulator" className={styles.link}>
                  Gitシミュレーター
                </Link>
              </li>
              <li>
                <Link href="/learn/challenges" className={styles.link}>
                  チャレンジ
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.link}>
                  Gitについて
                </Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.title}>リソース</h3>
            <ul className={styles.links}>
              <li>
                <a 
                  href="https://git-scm.com/doc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Git公式ドキュメント
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Git Basics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

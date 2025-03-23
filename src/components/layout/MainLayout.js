import Head from 'next/head';
import styles from '../styles/Layout.module.css';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children, title = 'Git Basics - 初心者のためのGit学習サイト' }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Gitの基本を初心者にもわかりやすく学べるインタラクティブな学習サイト" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className={styles.main}>
        {children}
      </main>

      <Footer />
    </div>
  );
}

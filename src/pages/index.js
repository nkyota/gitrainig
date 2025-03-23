import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Git Basics - 初心者のためのGit学習サイト</title>
        <meta name="description" content="Gitの基本を初心者にもわかりやすく学べるインタラクティブな学習サイト" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Git Basics
        </h1>

        <p className={styles.description}>
          Gitの基本を初心者にもわかりやすく学べるインタラクティブな学習サイト
        </p>

        <div className={styles.grid}>
          <a href="/learn" className={styles.card}>
            <h2>学習を始める &rarr;</h2>
            <p>段階的なレッスンでGitの基本を学びましょう。</p>
          </a>

          <a href="/learn/simulator" className={styles.card}>
            <h2>Gitシミュレーター &rarr;</h2>
            <p>実際のGitコマンドを試して、結果を視覚的に確認できます。</p>
          </a>

          <a href="/learn/challenges" className={styles.card}>
            <h2>チャレンジ &rarr;</h2>
            <p>実践的な問題に挑戦して、Gitスキルを磨きましょう。</p>
          </a>

          <a href="/about" className={styles.card}>
            <h2>Gitについて &rarr;</h2>
            <p>Gitとは何か、なぜ必要なのかを学びましょう。</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Git Basics - 初心者のためのGit学習サイト
        </a>
      </footer>
    </div>
  );
}

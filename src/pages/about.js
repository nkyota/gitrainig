import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gitについて | Git Basics</title>
        <meta name="description" content="Gitの基本概念と歴史について学びましょう" />
      </Head>

      <h1 className={styles.title}>Gitについて</h1>
      
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Gitとは</h2>
          <p>
            Gitは、プログラムのソースコードなどの変更履歴を記録・追跡するための分散型バージョン管理システムです。
            Linuxカーネルのソースコード管理のために、Linuxの創始者であるLinus Torvalds氏によって開発されました。
          </p>
          <p>
            Gitの主な特徴は以下の通りです：
          </p>
          <ul>
            <li>分散型リポジトリ - 各開発者がリポジトリの完全なコピーを持ちます</li>
            <li>ブランチ機能 - 複数の開発ラインを並行して進めることができます</li>
            <li>高速な操作 - ほとんどの操作がローカルで行われます</li>
            <li>データの整合性 - 変更履歴の改ざんが困難な設計になっています</li>
          </ul>
        </section>
        
        <section className={styles.section}>
          <h2>Gitの歴史</h2>
          <p>
            Gitは2005年に開発が始まりました。それまでLinuxカーネルの開発では商用のBitKeeperというバージョン管理システムが使用されていましたが、
            BitKeeperの無償利用が終了したことをきっかけに、Linus Torvalds氏が新しいバージョン管理システムの開発を決意しました。
          </p>
          <p>
            Gitの設計目標は以下の通りでした：
          </p>
          <ul>
            <li>速度</li>
            <li>シンプルな設計</li>
            <li>並行開発のための強力なブランチサポート</li>
            <li>完全に分散化されたワークフロー</li>
            <li>Linuxカーネルのような大規模プロジェクトの効率的な管理</li>
          </ul>
          <p>
            現在、Gitは世界中の開発者に広く使用されており、GitHub、GitLab、Bitbucketなどの人気のあるコード共有プラットフォームの基盤となっています。
          </p>
        </section>
        
        <section className={styles.section}>
          <h2>Gitを学ぶメリット</h2>
          <p>
            Gitを学ぶことには、以下のようなメリットがあります：
          </p>
          <ul>
            <li>ソフトウェア開発の現場で広く使われているスキルが身につく</li>
            <li>複数人での共同開発がスムーズになる</li>
            <li>コードの変更履歴を追跡できるため、問題が発生した際に原因を特定しやすい</li>
            <li>実験的な機能開発を安全に行える</li>
            <li>オープンソースプロジェクトへの貢献が容易になる</li>
          </ul>
        </section>
        
        <div className={styles.cta}>
          <p>Gitの基本を学んでみませんか？</p>
          <Link href="/learn" className={styles.button}>
            学習を始める
          </Link>
        </div>
      </div>
    </div>
  );
}

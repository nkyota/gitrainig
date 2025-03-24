import { useState } from 'react';
import styles from '../../styles/Challenges.module.css';
import Head from 'next/head';

export default function ChallengesPage() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  
  // チャレンジのリスト
  const challenges = [
    {
      id: 1,
      title: 'リポジトリの初期化',
      description: '新しいリポジトリを初期化して最初のコミットを作成してください。',
      tasks: [
        'git init コマンドを実行する',
        'ファイルを追加する',
        'git add でステージングする',
        'git commit で最初のコミットを作成する'
      ],
      difficulty: '初級'
    },
    {
      id: 2,
      title: 'ブランチの操作',
      description: '新しいブランチを作成して切り替え、変更をコミットしましょう。',
      tasks: [
        'git branch feature で新しいブランチを作成',
        'git checkout feature でブランチを切り替え',
        '変更を加えてコミット',
        'git checkout main で元のブランチに戻る'
      ],
      difficulty: '中級'
    },
    {
      id: 3,
      title: 'マージの実践',
      description: 'ブランチをマージして変更を統合する方法を学びましょう。',
      tasks: [
        'git merge コマンドでブランチを統合',
        'コンフリクトの解決方法を確認',
        'マージコミットの作成'
      ],
      difficulty: '上級'
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Git チャレンジ - 実践的な課題に挑戦</title>
        <meta name="description" content="実践的なGitの課題に挑戦して、スキルを磨きましょう。" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Git チャレンジ</h1>
        
        <p className={styles.description}>
          実践的な課題に挑戦して、Gitスキルを磨きましょう。
        </p>
        
        <div className={styles.challenges}>
          {challenges.map((challenge, index) => (
            <div 
              key={challenge.id}
              className={`${styles.challenge} ${currentChallenge === index ? styles.active : ''}`}
              onClick={() => setCurrentChallenge(index)}
            >
              <h2>{challenge.title} <span className={styles.difficulty}>{challenge.difficulty}</span></h2>
              <p>{challenge.description}</p>
              
              {currentChallenge === index && (
                <div className={styles.challengeDetails}>
                  <h3>タスク</h3>
                  <ul>
                    {challenge.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                  <button className={styles.startButton}>
                    チャレンジを開始
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="/" className={styles.backLink}>
          ← ホームに戻る
        </a>
      </footer>
    </div>
  );
}

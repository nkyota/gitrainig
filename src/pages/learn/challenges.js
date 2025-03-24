import { useState } from 'react';
import styles from '../../styles/Challenges.module.css';
import Head from 'next/head';

export default function ChallengesPage() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState({});
  
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

  const startChallenge = (index) => {
    setActiveChallenge(index);
    // まだ進捗情報がない場合は初期化
    if (!challengeProgress[index]) {
      setChallengeProgress({
        ...challengeProgress,
        [index]: {
          started: true,
          completedTasks: [],
          timeStarted: new Date().toISOString()
        }
      });
    }
  };

  const completeTask = (challengeIndex, taskIndex) => {
    const progress = { ...challengeProgress };
    if (!progress[challengeIndex]) {
      progress[challengeIndex] = {
        started: true,
        completedTasks: [],
        timeStarted: new Date().toISOString()
      };
    }
    
    // タスクが既に完了していれば削除、そうでなければ追加
    const taskAlreadyCompleted = progress[challengeIndex].completedTasks.includes(taskIndex);
    
    if (taskAlreadyCompleted) {
      progress[challengeIndex].completedTasks = progress[challengeIndex].completedTasks.filter(
        t => t !== taskIndex
      );
    } else {
      progress[challengeIndex].completedTasks.push(taskIndex);
    }
    
    setChallengeProgress(progress);
  };

  const renderActiveChallenge = () => {
    if (activeChallenge === null) return null;
    
    const challenge = challenges[activeChallenge];
    const progress = challengeProgress[activeChallenge] || { completedTasks: [] };
    
    return (
      <div className={styles.activeChallenge}>
        <div className={styles.challengeHeader}>
          <h2>{challenge.title}</h2>
          <span className={styles.difficulty}>{challenge.difficulty}</span>
        </div>
        
        <p className={styles.description}>{challenge.description}</p>
        
        <div className={styles.tasks}>
          <h3>タスク</h3>
          <ul>
            {challenge.tasks.map((task, taskIndex) => (
              <li 
                key={taskIndex}
                className={progress.completedTasks.includes(taskIndex) ? styles.completed : ''}
                onClick={() => completeTask(activeChallenge, taskIndex)}
              >
                <input 
                  type="checkbox" 
                  checked={progress.completedTasks.includes(taskIndex)}
                  onChange={() => {}}
                />
                {task}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.challengeActions}>
          <button 
            className={styles.backButton}
            onClick={() => setActiveChallenge(null)}
          >
            チャレンジ一覧に戻る
          </button>
          
          {progress.completedTasks.length === challenge.tasks.length && (
            <div className={styles.successMessage}>
              おめでとうございます！すべてのタスクを完了しました！
            </div>
          )}
        </div>
      </div>
    );
  };

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
        
        {activeChallenge === null ? (
          <div className={styles.challenges}>
            {challenges.map((challenge, index) => (
              <div 
                key={challenge.id}
                className={`${styles.challenge} ${currentChallenge === index ? styles.active : ''}`}
                onClick={() => setCurrentChallenge(index)}
              >
                <h2>
                  {challenge.title} 
                  <span className={styles.difficulty}>{challenge.difficulty}</span>
                  {challengeProgress[index]?.completedTasks?.length === challenge.tasks.length && (
                    <span className={styles.completed}>完了!</span>
                  )}
                </h2>
                <p>{challenge.description}</p>
                
                {currentChallenge === index && (
                  <div className={styles.challengeDetails}>
                    <h3>タスク</h3>
                    <ul>
                      {challenge.tasks.map((task, taskIndex) => (
                        <li key={taskIndex}>{task}</li>
                      ))}
                    </ul>
                    <button 
                      className={styles.startButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        startChallenge(index);
                      }}
                    >
                      チャレンジを開始
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          renderActiveChallenge()
        )}
      </main>

      <footer className={styles.footer}>
        <a href="/" className={styles.backLink}>
          ← ホームに戻る
        </a>
      </footer>
    </div>
  );
}

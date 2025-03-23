import { useState, useEffect } from 'react';
import styles from '../../../styles/SampleLessons.module.css';

// サンプルレッスンデータ
const sampleLessons = [
  {
    id: 'git-basics-101',
    title: 'Git入門: 基本コマンド',
    description: 'Gitの基本的なコマンドと概念を学びます。初めてGitを使う方向けの入門レッスンです。',
    category: '初級',
    difficulty: 'beginner',
    duration: '約30分',
    tags: ['基本', 'コマンド', '入門'],
    steps: [
      {
        title: 'Gitリポジトリの初期化',
        description: 'Gitリポジトリを作成して、バージョン管理を始めましょう。',
        hint: 'git initコマンドを使ってリポジトリを初期化します。',
        targetCommands: ['init'],
        suggestedCommands: [
          { command: 'git init', description: 'リポジトリを初期化' }
        ]
      },
      {
        title: 'ファイルの追加',
        description: 'ファイルをステージングエリアに追加します。これにより、Gitがファイルの変更を追跡できるようになります。',
        hint: 'git addコマンドを使ってファイルをステージングエリアに追加します。',
        targetCommands: ['add'],
        suggestedCommands: [
          { command: 'git add README.md', description: 'ファイルをステージング' },
          { command: 'git add .', description: 'すべての変更をステージング' }
        ]
      },
      {
        title: '最初のコミット',
        description: 'ステージングされた変更をコミットして、Gitの履歴に記録します。',
        hint: 'git commitコマンドを使って変更をコミットします。-mオプションでコミットメッセージを指定します。',
        targetCommands: ['commit'],
        suggestedCommands: [
          { command: 'git commit -m "Initial commit"', description: '変更をコミット' }
        ]
      },
      {
        title: '変更の確認',
        description: 'リポジトリの状態を確認して、どのファイルが変更されているかを確認します。',
        hint: 'git statusコマンドを使ってリポジトリの状態を確認します。',
        targetCommands: ['status'],
        suggestedCommands: [
          { command: 'git status', description: '状態を確認' }
        ]
      },
      {
        title: 'コミット履歴の確認',
        description: 'これまでのコミット履歴を確認します。',
        hint: 'git logコマンドを使ってコミット履歴を表示します。',
        targetCommands: ['log'],
        suggestedCommands: [
          { command: 'git log', description: 'コミット履歴を表示' }
        ]
      }
    ]
  },
  {
    id: 'git-branching',
    title: 'Gitブランチ: 並行開発の基礎',
    description: 'Gitのブランチ機能を使って、複数の機能を並行して開発する方法を学びます。',
    category: '中級',
    difficulty: 'intermediate',
    duration: '約45分',
    tags: ['ブランチ', 'マージ', '中級'],
    steps: [
      {
        title: 'ブランチの作成',
        description: '新しいブランチを作成して、メインの開発ラインから分岐します。',
        hint: 'git branchコマンドを使って新しいブランチを作成します。',
        targetCommands: ['branch'],
        suggestedCommands: [
          { command: 'git branch feature', description: '新しいブランチを作成' }
        ]
      },
      {
        title: 'ブランチの切り替え',
        description: '作成したブランチに切り替えて、そのブランチで作業を始めます。',
        hint: 'git checkoutコマンドを使ってブランチを切り替えます。',
        targetCommands: ['checkout'],
        suggestedCommands: [
          { command: 'git checkout feature', description: 'ブランチを切り替え' }
        ]
      },
      {
        title: 'ブランチでの変更とコミット',
        description: 'ブランチで変更を行い、コミットします。',
        hint: 'ファイルを変更し、git addとgit commitを使って変更をコミットします。',
        targetCommands: ['commit'],
        suggestedCommands: [
          { command: 'git add README.md', description: '変更をステージング' },
          { command: 'git commit -m "Update in feature branch"', description: '変更をコミット' }
        ]
      },
      {
        title: 'メインブランチに戻る',
        description: 'メインブランチ（main）に戻ります。',
        hint: 'git checkoutコマンドを使ってmainブランチに切り替えます。',
        targetCommands: ['checkout'],
        suggestedCommands: [
          { command: 'git checkout main', description: 'メインブランチに切り替え' }
        ]
      },
      {
        title: 'ブランチのマージ',
        description: 'featureブランチの変更をmainブランチにマージします。',
        hint: 'git mergeコマンドを使ってブランチをマージします。',
        targetCommands: ['merge'],
        suggestedCommands: [
          { command: 'git merge feature', description: 'ブランチをマージ' }
        ]
      }
    ]
  },
  {
    id: 'git-collaboration',
    title: 'Gitでのチーム協働: プル＆プッシュ',
    description: 'リモートリポジトリを使って、チームでのGit協働ワークフローを学びます。',
    category: '上級',
    difficulty: 'advanced',
    duration: '約60分',
    tags: ['リモート', 'プル', 'プッシュ', '上級'],
    steps: [
      {
        title: 'リモートリポジトリの追加',
        description: 'リモートリポジトリをローカルリポジトリに追加します。',
        hint: 'git remoteコマンドを使ってリモートリポジトリを追加します。',
        targetCommands: ['remote'],
        suggestedCommands: [
          { command: 'git remote add origin https://github.com/user/repo.git', description: 'リモートを追加' }
        ]
      },
      {
        title: 'リモートからのプル',
        description: 'リモートリポジトリから最新の変更をプルします。',
        hint: 'git pullコマンドを使ってリモートの変更を取得します。',
        targetCommands: ['pull'],
        suggestedCommands: [
          { command: 'git pull origin main', description: 'リモートから変更をプル' }
        ]
      },
      {
        title: 'ローカルでの変更',
        description: 'ローカルで変更を行い、コミットします。',
        hint: 'ファイルを変更し、git addとgit commitを使って変更をコミットします。',
        targetCommands: ['commit'],
        suggestedCommands: [
          { command: 'git add README.md', description: '変更をステージング' },
          { command: 'git commit -m "Update README"', description: '変更をコミット' }
        ]
      },
      {
        title: 'リモートへのプッシュ',
        description: 'ローカルの変更をリモートリポジトリにプッシュします。',
        hint: 'git pushコマンドを使ってローカルの変更をリモートに送信します。',
        targetCommands: ['push'],
        suggestedCommands: [
          { command: 'git push origin main', description: '変更をリモートにプッシュ' }
        ]
      },
      {
        title: 'プルリクエストの作成（シミュレーション）',
        description: 'プルリクエストを作成して、変更をメインブランチにマージする提案をします。',
        hint: 'これは通常GitHubなどのプラットフォーム上で行いますが、ここではシミュレーションとして学びます。',
        targetCommands: ['branch'],
        suggestedCommands: [
          { command: 'git checkout -b pull-request', description: 'プルリクエスト用ブランチを作成' },
          { command: 'git push origin pull-request', description: 'ブランチをプッシュ' }
        ]
      }
    ]
  }
];

// サンプル実績データ
const sampleAchievements = [
  {
    id: 'first-commit',
    title: '最初のコミット',
    description: '初めてのコミットを作成しました！',
    icon: '🎉',
    difficulty: 'bronze',
    type: 'lesson_complete',
    lessonId: 'git-basics-101'
  },
  {
    id: 'branch-master',
    title: 'ブランチマスター',
    description: 'ブランチを作成してマージしました。',
    icon: '🌿',
    difficulty: 'silver',
    type: 'lesson_complete',
    lessonId: 'git-branching'
  },
  {
    id: 'team-player',
    title: 'チームプレイヤー',
    description: 'リモートリポジトリとの連携を学びました。',
    icon: '👥',
    difficulty: 'gold',
    type: 'lesson_complete',
    lessonId: 'git-collaboration'
  },
  {
    id: 'command-novice',
    title: 'コマンド初心者',
    description: '10個のGitコマンドを実行しました。',
    icon: '💻',
    difficulty: 'bronze',
    type: 'command_usage',
    command: 'any',
    requiredCount: 10
  },
  {
    id: 'command-adept',
    title: 'コマンド達人',
    description: '50個のGitコマンドを実行しました。',
    icon: '⌨️',
    difficulty: 'silver',
    type: 'command_usage',
    command: 'any',
    requiredCount: 50
  },
  {
    id: 'point-collector',
    title: 'ポイントコレクター',
    description: '100ポイントを獲得しました。',
    icon: '🏆',
    difficulty: 'gold',
    type: 'points_total',
    requiredPoints: 100
  },
  {
    id: 'git-apprentice',
    title: 'Git見習い',
    description: '1つのレッスンを完了しました。',
    icon: '🔰',
    difficulty: 'bronze',
    type: 'lessons_complete_count',
    requiredCount: 1
  },
  {
    id: 'git-journeyman',
    title: 'Git職人',
    description: '2つのレッスンを完了しました。',
    icon: '📚',
    difficulty: 'silver',
    type: 'lessons_complete_count',
    requiredCount: 2
  },
  {
    id: 'git-master',
    title: 'Gitマスター',
    description: 'すべてのレッスンを完了しました。',
    icon: '🎓',
    difficulty: 'platinum',
    type: 'lessons_complete_count',
    requiredCount: 3
  },
  {
    id: 'secret-achievement',
    title: '隠された実績',
    description: '特別な条件を満たして隠された実績を解除しました。',
    icon: '🔍',
    difficulty: 'gold',
    type: 'special',
    hidden: true
  }
];

// サンプルユーザー進捗データ
const initialUserProgress = {
  'git-basics-101': {
    completionPercentage: 40,
    earnedPoints: 15,
    commandUsage: {
      'init': 1,
      'add': 2,
      'commit': 1
    }
  }
};

// サンプルレッスンを取得する静的メソッドを追加
function getLessons() {
  return sampleLessons;
}

// サンプル実績を取得する静的メソッド
function getAchievements() {
  return sampleAchievements;
}

export default function SampleLessons() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [showAchievements, setShowAchievements] = useState(false);
  
  // レッスン選択ハンドラー
  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowAchievements(false);
  };
  
  // レッスン完了ハンドラー
  const handleLessonComplete = (lessonId, earnedPoints) => {
    setUserProgress(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        completionPercentage: 100,
        earnedPoints: (prev[lessonId]?.earnedPoints || 0) + earnedPoints
      }
    }));
  };
  
  // 実績表示切り替えハンドラー
  const toggleAchievements = () => {
    setShowAchievements(!showAchievements);
    setSelectedLesson(null);
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Git学習サンプル</h1>
      
      <div className={styles.content}>
        {/* レッスン一覧 */}
        <div className={styles.lessonList}>
          {sampleLessons.map(lesson => (
            <div 
              key={lesson.id} 
              className={styles.lessonCard}
              onClick={() => handleSelectLesson(lesson)}
            >
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <div className={styles.lessonMeta}>
                <span className={styles.category}>{lesson.category}</span>
                <span className={styles.duration}>{lesson.duration}</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${userProgress[lesson.id]?.completionPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 実績ボタン */}
        <button 
          className={styles.achievementsButton}
          onClick={toggleAchievements}
        >
          {showAchievements ? 'レッスンに戻る' : '実績を表示'}
        </button>
      </div>
    </div>
  );
}

// 静的メソッドをコンポーネントに追加
SampleLessons.getLessons = getLessons;
SampleLessons.getAchievements = getAchievements;

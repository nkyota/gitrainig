import { useState, useEffect } from 'react';
import styles from '../../styles/SampleLessons.module.css';

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
  
  // サンプルデータをインポート
  const LessonSelector = (props) => {
    const { lessons, onSelectLesson, userProgress } = props;
    
    // LessonSelectorコンポーネントの実装をここに記述
    // 実際のプロジェクトでは、このコンポーネントは別ファイルからインポートします
    
    return (
      <div className={styles.sampleLessonSelector}>
        <h2>レッスン一覧（サンプル）</h2>
        <div className={styles.lessonList}>
          {lessons.map(lesson => (
            <div 
              key={lesson.id} 
              className={styles.lessonCard}
              onClick={() => onSelectLesson(lesson)}
            >
              <h3>{lesson.title}</h3>
              <div className={styles.lessonMeta}>
                <span className={styles[`difficulty-${lesson.difficulty}`]}>
                  {lesson.difficulty === 'beginner' ? '初級' : 
                   lesson.difficulty === 'intermediate' ? '中級' : '上級'}
                </span>
                <span>{lesson.duration}</span>
              </div>
              <p>{lesson.description}</p>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${userProgress[lesson.id]?.completionPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const GitLearningModule = (props) => {
    const { lesson, onComplete } = props;
    
    // GitLearningModuleコンポーネントの実装をここに記述
    // 実際のプロジェクトでは、このコンポーネントは別ファイルからインポートします
    
    return (
      <div className={styles.sampleLearningModule}>
        <h2>{lesson.title}</h2>
        <p>{lesson.description}</p>
        <div className={styles.stepsList}>
          <h3>レッスンステップ：</h3>
          <ol>
            {lesson.steps.map((step, index) => (
              <li key={index}>
                <strong>{step.title}</strong>: {step.description}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.sampleNote}>
          <p>
            <strong>注意:</strong> これはサンプル表示です。実際の実装では、
            EnhancedGitVisualizer、InteractiveCommandTerminal、
            GitLearningModuleコンポーネントが統合されて、
            インタラクティブなGit学習体験を提供します。
          </p>
        </div>
        <button 
          className={styles.completeButton}
          onClick={() => onComplete(lesson.id, 25)}
        >
          レッスンを完了としてマーク（デモ用）
        </button>
      </div>
    );
  };
  
  const AchievementSystem = (props) => {
    const { userProgress, achievements } = props;
    
    // AchievementSystemコンポーネントの実装をここに記述
    // 実際のプロジェクトでは、このコンポーネントは別ファイルからインポートします
    
    return (
      <div className={styles.sampleAchievements}>
        <h2>実績一覧（サンプル）</h2>
        <div className={styles.achievementList}>
          {achievements.map(achievement => {
            const isEarned = achievement.id === 'git-apprentice' && 
              Object.values(userProgress).some(p => p.completionPercentage === 100);
            
            return (
              <div 
                key={achievement.id} 
                className={`${styles.achievementCard} ${isEarned ? styles.earned : ''}`}
              >
                <div className={styles.achievementIcon}>{achievement.icon}</div>
                <div className={styles.achievementInfo}>
                  <h3>{achievement.hidden && !isEarned ? '???' : achievement.title}</h3>
                  <p>{achievement.hidden && !isEarned ? 
                    'この実績は秘密です。プレイを続けて解除しましょう。' : 
                    achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Git Basics - 強化版サンプル</h1>
        <div className={styles.navigation}>
          <button 
            className={`${styles.navButton} ${!showAchievements && !selectedLesson ? styles.active : ''}`}
            onClick={() => {
              setSelectedLesson(null);
              setShowAchievements(false);
            }}
          >
            レッスン一覧
          </button>
          <button 
            className={`${styles.navButton} ${showAchievements ? styles.active : ''}`}
            onClick={toggleAchievements}
          >
            実績
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {showAchievements ? (
          <AchievementSystem 
            userProgress={userProgress}
            achievements={sampleAchievements}
          />
        ) : selectedLesson ? (
          <GitLearningModule 
            lesson={selectedLesson}
            onComplete={handleLessonComplete}
          />
        ) : (
          <LessonSelector 
            lessons={sampleLessons}
            onSelectLesson={handleSelectLesson}
            userProgress={userProgress}
          />
        )}
      </div>
      
      <div className={styles.footer}>
        <p>
          このサンプルページは、Git Basicsトレーニングウェブサイトの強化版コンポーネントを
          デモンストレーションするために作成されました。実際の実装では、より高度な
          インタラクティブ機能とビジュアライゼーションが提供されます。
        </p>
      </div>
    </div>
  );
}

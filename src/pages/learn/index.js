import { useState, useEffect } from 'react';
import styles from '../../styles/Learn.module.css';
import { GitSimulatorProvider } from '../../lib/git-simulator/GitSimulator';

// 拡張版コンポーネントをインポート
import GitLearningModule from '../../components/learning/enhanced/GitLearningModule';
import LessonSelector from '../../components/learning/enhanced/LessonSelector';
import SampleLessons from '../../components/learning/enhanced/SampleLessons';

// レッスンデータ
const lessons = [
  {
    id: 'git-basics',
    title: 'Gitの基本',
    description: 'Gitの基本的な概念とコマンドを学びます。',
    steps: [
      {
        title: 'Gitとは',
        description: `
          Gitは分散型バージョン管理システムです。ソフトウェア開発において、ソースコードの変更履歴を記録・追跡するために使用されます。
          
          Gitの主な特徴:
          - 分散型: 各開発者がリポジトリの完全なコピーを持ちます
          - ブランチ機能: 並行開発を容易にします
          - マージ機能: 異なる開発ラインを統合できます
          - 高速: ほとんどの操作がローカルで行われます
          
          Gitを使うことで、複数の開発者が同じプロジェクトで効率的に協力し合うことができます。
        `,
        image: '/images/git-overview.png',
        imageAlt: 'Gitの概要図'
      },
      {
        title: 'リポジトリとは',
        description: `
          リポジトリ（Repository）は、プロジェクトのファイルとその変更履歴を保存する場所です。
          
          Gitには2種類のリポジトリがあります:
          
          1. ローカルリポジトリ: 自分のコンピュータ上にあるリポジトリ
          2. リモートリポジトリ: サーバー上にあるリポジトリ（GitHub, GitLabなど）
          
          \`git init\`コマンドを使用して、新しいローカルリポジトリを作成できます。
          \`git clone\`コマンドを使用して、既存のリモートリポジトリをローカルにコピーできます。
        `,
        codeExample: `# 新しいリポジトリを初期化
git init

# リモートリポジトリをクローン
git clone https://github.com/username/repository.git`
      },
      {
        title: 'コミットとは',
        description: `
          コミット（Commit）は、ファイルの変更を記録する操作です。各コミットには一意のIDが割り当てられ、変更内容、作者、日時などの情報が含まれます。
          
          コミットの流れ:
          1. ファイルを変更する
          2. 変更をステージングエリアに追加する（\`git add\`）
          3. 変更をコミットする（\`git commit\`）
          
          コミットメッセージは、変更内容を簡潔に説明するものです。良いコミットメッセージは、他の開発者や将来の自分が変更内容を理解するのに役立ちます。
        `,
        codeExample: `# 変更をステージングエリアに追加
git add file.txt

# 変更をコミット
git commit -m "ファイルを追加"`
      },
      {
        title: 'ブランチとは',
        description: `
          ブランチ（Branch）は、開発ラインを分岐させる機能です。メインの開発ラインから分岐して、独立した作業を行うことができます。
          
          ブランチの利点:
          - 並行開発: 複数の機能やバグ修正を同時に進められる
          - 安定性: メインブランチを安定した状態に保てる
          - 実験: リスクの高い変更を安全に試せる
          
          デフォルトのブランチは「main」（または「master」）と呼ばれます。
          新しい機能開発やバグ修正は、通常、専用のブランチで行います。
        `,
        codeExample: `# 新しいブランチを作成
git branch feature-branch

# ブランチを切り替える
git checkout feature-branch

# ブランチを作成して切り替える（上記2コマンドの組み合わせ）
git checkout -b feature-branch`
      },
      {
        title: 'マージとは',
        description: `
          マージ（Merge）は、あるブランチの変更を別のブランチに統合する操作です。
          
          例えば、feature-branchで新機能の開発が完了したら、その変更をmainブランチにマージします。
          
          マージの種類:
          - Fast-forward: 単純に履歴を前に進める
          - 3-way merge: 共通の祖先と2つのブランチの状態を比較して統合
          
          マージ中に競合（Conflict）が発生することがあります。これは、同じファイルの同じ部分が両方のブランチで異なる方法で変更された場合に起こります。競合は手動で解決する必要があります。
        `,
        codeExample: `# mainブランチに切り替え
git checkout main

# feature-branchの変更をmainにマージ
git merge feature-branch`
      }
    ]
  },
  {
    id: 'branching-basics',
    title: 'ブランチングの基本',
    description: 'Gitのブランチ機能を使った開発フローを学びます。',
    steps: [
      {
        title: 'ブランチを使った開発フロー',
        description: `
          ブランチを使った一般的な開発フローは以下のようになります:
          
          1. メインブランチ（main）から新しい機能ブランチを作成
          2. 機能ブランチで開発を行い、定期的にコミット
          3. 開発が完了したら、メインブランチに変更をマージ
          4. 不要になったブランチを削除
          
          このフローにより、メインブランチを常に安定した状態に保ちながら、複数の機能開発を並行して進めることができます。
        `,
        image: '/images/git-workflow.png',
        imageAlt: 'Gitブランチワークフロー'
      },
      {
        title: 'ブランチの作成と切り替え',
        description: `
          新しいブランチを作成するには\`git branch\`コマンドを使用します。
          ブランチを切り替えるには\`git checkout\`コマンドを使用します。
          
          \`git checkout -b\`コマンドを使用すると、ブランチの作成と切り替えを一度に行うことができます。
          
          現在のブランチを確認するには\`git branch\`コマンドを使用します。現在のブランチには「*」が表示されます。
        `,
        codeExample: `# 新しいブランチを作成
git branch feature-login

# ブランチを切り替える
git checkout feature-login

# ブランチを作成して切り替える（上記2コマンドの組み合わせ）
git checkout -b feature-login

# ブランチ一覧を表示
git branch`
      },
      {
        title: 'ブランチのマージ',
        description: `
          ブランチの変更を別のブランチにマージするには\`git merge\`コマンドを使用します。
          
          マージの手順:
          1. マージ先のブランチに切り替える（例: main）
          2. マージ元のブランチをマージする（例: feature-login）
          
          マージが成功すると、マージ先のブランチにマージ元の変更が反映されます。
          
          マージ後、不要になったブランチは\`git branch -d\`コマンドで削除できます。
        `,
        codeExample: `# mainブランチに切り替え
git checkout main

# feature-loginブランチをmainにマージ
git merge feature-login

# マージ済みのブランチを削除
git branch -d feature-login`
      },
      {
        title: 'マージ競合の解決',
        description: `
          マージ中に競合（Conflict）が発生することがあります。これは、同じファイルの同じ部分が両方のブランチで異なる方法で変更された場合に起こります。
          
          競合が発生すると、Gitは競合箇所をファイル内にマークします:
          
          \`\`\`
          <<<<<<< HEAD
          現在のブランチの内容
          =======
          マージするブランチの内容
          >>>>>>> feature-branch
          \`\`\`
          
          競合を解決するには:
          1. 競合箇所を編集して最終的な内容に修正
          2. マーカー（<<<<<<, =======, >>>>>>>）を削除
          3. 変更をステージングエリアに追加
          4. マージを完了するためにコミット
        `,
        codeExample: `# 競合を解決した後
git add conflicted-file.txt
git commit -m "Resolve merge conflict"`
      }
    ]
  }
];

// SampleLessonsからサンプルレッスンを取得
// エラー回避のためにtry-catchで囲み、エラー時は空配列を使用
let additionalLessons = [];
try {
  if (typeof SampleLessons.getLessons === 'function') {
    additionalLessons = SampleLessons.getLessons();
  }
} catch (error) {
  console.error('Error loading additional lessons:', error);
}

const allLessons = [...lessons, ...additionalLessons];

export default function LearnPage() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  // ローカルストレージから完了したレッスンとポイントを読み込む
  useEffect(() => {
    try {
      const savedLessons = localStorage.getItem('git-basics-completed-lessons');
      if (savedLessons) {
        setCompletedLessons(JSON.parse(savedLessons));
      }
      
      const savedPoints = localStorage.getItem('git-basics-user-points');
      if (savedPoints) {
        setUserPoints(parseInt(savedPoints, 10));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, []);

  // レッスン完了時の処理
  const handleLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      
      // ポイント加算（レッスン完了で10ポイント）
      const newPoints = userPoints + 10;
      setUserPoints(newPoints);
      
      try {
        localStorage.setItem('git-basics-completed-lessons', JSON.stringify(newCompleted));
        localStorage.setItem('git-basics-user-points', newPoints.toString());
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    }
  };

  return (
    <GitSimulatorProvider>
      <div className={styles.container}>
        <h1 className={styles.title}>Git学習コース</h1>
        
        <div className={styles.content}>
          <div className={styles.sidebar}>
            {/* 拡張版のLessonSelectorコンポーネントを使用 */}
            <LessonSelector 
              lessons={allLessons}
              completedLessons={completedLessons}
              selectedLessonId={selectedLesson?.id}
              onSelectLesson={setSelectedLesson}
              userPoints={userPoints}
            />
          </div>
          
          <div className={styles.lessonContent}>
            {selectedLesson ? (
              // 拡張版のGitLearningModuleコンポーネントを使用
              <GitLearningModule 
                lesson={selectedLesson}
                onComplete={handleLessonComplete}
                userPoints={userPoints}
                setUserPoints={setUserPoints}
              />
            ) : (
              <div className={styles.welcomeMessage}>
                <h2>Gitの学習を始めましょう</h2>
                <p>左側のメニューからレッスンを選択してください。</p>
                <p>初めての方は「Gitの基本」から始めることをお勧めします。</p>
                <p>レッスンを完了するとポイントが獲得でき、実績を解除できます。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GitSimulatorProvider>
  );
}

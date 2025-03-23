import { useState, useEffect } from 'react';
import styles from '../../styles/Learn.module.css';
import { GitSimulatorProvider } from '../../lib/git-simulator/GitSimulator';
import MainLayout from '../../components/layout/MainLayout';

// シンプル化したレッスンデータ
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
      }
    ]
  }
];

// シンプル化したレッスンセレクターコンポーネント
function SimpleLessonSelector({ lessons, onSelectLesson, selectedLessonId }) {
  return (
    <div className={styles.lessonSelector}>
      <h2>レッスン一覧</h2>
      <ul className={styles.lessonList}>
        {lessons.map(lesson => (
          <li 
            key={lesson.id}
            className={`${styles.lessonItem} ${selectedLessonId === lesson.id ? styles.selected : ''}`}
            onClick={() => onSelectLesson(lesson)}
          >
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// シンプル化したレッスンコンテンツコンポーネント
function SimpleLessonContent({ lesson }) {
  if (!lesson) return null;
  
  return (
    <div className={styles.lessonContent}>
      <h2>{lesson.title}</h2>
      <p>{lesson.description}</p>
      
      {lesson.steps.map((step, index) => (
        <div key={index} className={styles.lessonStep}>
          <h3>{step.title}</h3>
          <div className={styles.stepDescription}>
            {step.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          
          {step.codeExample && (
            <div className={styles.codeExample}>
              <pre>{step.codeExample}</pre>
            </div>
          )}
          
          {step.image && (
            <div className={styles.imageContainer}>
              <img src={step.image} alt={step.imageAlt || 'レッスン画像'} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// シンプル化したLearnページコンポーネント
export default function LearnPage() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  // 初期レッスン選択
  useEffect(() => {
    if (lessons.length > 0) {
      setSelectedLesson(lessons[0]);
    }
  }, []);
  
  return (
    <GitSimulatorProvider>
      <div className={styles.container}>
        <h1 className={styles.title}>Git学習コース</h1>
        
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <SimpleLessonSelector 
              lessons={lessons}
              selectedLessonId={selectedLesson?.id}
              onSelectLesson={setSelectedLesson}
            />
          </div>
          
          <div className={styles.mainContent}>
            {selectedLesson ? (
              <SimpleLessonContent lesson={selectedLesson} />
            ) : (
              <div className={styles.welcomeMessage}>
                <h2>Gitの学習を始めましょう</h2>
                <p>左側のメニューからレッスンを選択してください。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GitSimulatorProvider>
  );
}

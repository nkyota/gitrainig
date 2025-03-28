import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { useGitSimulator } from '../lib/git-simulator/GitSimulator';
import InteractiveCommandTerminal from '../components/learning/enhanced/InteractiveCommandTerminal';
import EnhancedGitVisualizer from '../components/learning/enhanced/EnhancedGitVisualizer';

export default function Home() {
  const { repository, commandHistory, executeCommand, resetRepository } = useGitSimulator();
  const [showInstructions, setShowInstructions] = useState(true);

  // コマンド履歴を管理するための状態
  const [terminalHistory, setTerminalHistory] = useState(commandHistory);

  const handleCommandExecute = (command) => {
    // コマンド入力を履歴に追加
    setTerminalHistory(prev => [...prev, { type: 'input', content: command }]);
    
    // コマンドを実行
    const result = executeCommand(command);
    
    // 結果を履歴に追加
    if (result) {
      setTerminalHistory(prev => [...prev, { type: 'output', content: result }]);
    }
    
    return result;
  };

  const handleReset = () => {
    if (confirm('リポジトリをリセットしますか？すべての進捗が失われます。')) {
      resetRepository();
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Git Basics - Gitシミュレーター</title>
        <meta name="description" content="実際のGitコマンドを試して、結果を視覚的に確認できるGitシミュレーター" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Gitシミュレーター
        </h1>
        
        <p className={styles.description}>
          実際のGitコマンドを入力して、結果を視覚的に確認できます。
          ターミナルに「help」と入力すると、利用可能なコマンドの一覧が表示されます。
        </p>
        
        {showInstructions && (
          <div className={styles.instructions}>
            <h2>使い方</h2>
            <ol>
              <li><code>git init</code> でリポジトリを初期化します</li>
              <li><code>git commit -m "メッセージ"</code> で変更をコミットします</li>
              <li><code>git branch ブランチ名</code> で新しいブランチを作成します</li>
              <li><code>git checkout ブランチ名</code> でブランチを切り替えます</li>
              <li><code>git log</code> でコミット履歴を確認します</li>
            </ol>
            <button 
              className={styles.closeButton}
              onClick={() => setShowInstructions(false)}
            >
              閉じる
            </button>
          </div>
        )}
        
        <div className={styles.simulatorContainer}>
          <div className={styles.visualizerContainer}>
            <EnhancedGitVisualizer repository={repository} onCommandExecute={handleCommandExecute} />
          </div>
          
          <div className={styles.terminalContainer}>
            <InteractiveCommandTerminal 
              onCommandExecute={handleCommandExecute}
              commandHistory={terminalHistory}
            />
            
            <div className={styles.actions}>
              <button 
                className={styles.resetButton}
                onClick={handleReset}
              >
                リポジトリをリセット
              </button>
              <button 
                className={styles.helpButton}
                onClick={() => setShowInstructions(!showInstructions)}
              >
                {showInstructions ? '使い方を隠す' : '使い方を表示'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Git Basics - Gitシミュレーター
        </a>
      </footer>
    </div>
  );
}

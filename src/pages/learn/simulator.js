import { useState } from 'react';
import styles from '../../styles/GitSimulator.module.css';
import CommandTerminal from '../../components/learning/CommandTerminal';
import GitVisualizer from '../../components/learning/GitVisualizer';
import { useGitSimulator } from '../../lib/git-simulator/GitSimulator';

export default function SimulatorPage() {
  const { repository, commandHistory, executeCommand, resetRepository } = useGitSimulator();
  const [showInstructions, setShowInstructions] = useState(true);

  const handleCommandExecute = (command) => {
    return executeCommand(command);
  };

  const handleReset = () => {
    if (confirm('リポジトリをリセットしますか？すべての進捗が失われます。')) {
      resetRepository();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gitシミュレーター</h1>
      
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
          <GitVisualizer repository={repository} />
        </div>
        
        <div className={styles.terminalContainer}>
          <CommandTerminal 
            onCommandExecute={handleCommandExecute}
            commandHistory={commandHistory}
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
    </div>
  );
}

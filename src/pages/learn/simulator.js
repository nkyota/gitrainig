import { useState } from 'react';
import styles from '../../styles/GitSimulator.module.css';
import { useGitSimulator } from '../../lib/git-simulator/GitSimulator';

// 拡張版コンポーネントをインポート
import InteractiveCommandTerminal from '../../components/learning/enhanced/InteractiveCommandTerminal';
import EnhancedGitVisualizer from '../../components/learning/enhanced/EnhancedGitVisualizer';
import AchievementSystem from '../../components/learning/enhanced/AchievementSystem';

export default function SimulatorPage() {
  const { repository, commandHistory, executeCommand, resetRepository } = useGitSimulator();
  const [showInstructions, setShowInstructions] = useState(true);
  const [achievements, setAchievements] = useState([]);

  const handleCommandExecute = (command) => {
    const result = executeCommand(command);
    
    // コマンド実行に基づいて実績を更新
    if (result.success) {
      updateAchievements(command);
    }
    
    return result;
  };

  const updateAchievements = (command) => {
    // 実績の条件をチェックして更新
    const newAchievements = [...achievements];
    
    // 初めてのコミット
    if (command.startsWith('git commit') && !achievements.includes('first-commit')) {
      newAchievements.push('first-commit');
    }
    
    // 初めてのブランチ作成
    if (command.startsWith('git branch') && !achievements.includes('first-branch')) {
      newAchievements.push('first-branch');
    }
    
    // 初めてのチェックアウト
    if (command.startsWith('git checkout') && !achievements.includes('first-checkout')) {
      newAchievements.push('first-checkout');
    }
    
    // 実績が更新された場合のみ状態を更新
    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
    }
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
          <EnhancedGitVisualizer repository={repository} />
        </div>
        
        <div className={styles.terminalContainer}>
          <InteractiveCommandTerminal 
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
      
      {/* 実績システムを追加 */}
      <AchievementSystem achievements={achievements} />
    </div>
  );
}

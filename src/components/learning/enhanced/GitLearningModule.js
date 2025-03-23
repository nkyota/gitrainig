import { useState, useEffect } from 'react';
import styles from '../../../styles/GitLearningModule.module.css';
import EnhancedGitVisualizer from './EnhancedGitVisualizer';
import InteractiveCommandTerminal from './InteractiveCommandTerminal';

export default function GitLearningModule({ lesson, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [repository, setRepository] = useState({
    commits: [],
    branches: [],
    head: null,
    currentBranch: 'main',
    workingDirectory: {},
    stagingArea: {}
  });
  const [commandHistory, setCommandHistory] = useState([]);
  const [suggestedCommands, setSuggestedCommands] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showCongratulation, setShowCongratulation] = useState(false);

  // レッスンが変更されたら状態をリセット
  useEffect(() => {
    if (lesson) {
      setCurrentStep(0);
      setIsCompleted(false);
      resetRepository();
      setCommandHistory([]);
      setSuggestedCommands(getInitialSuggestedCommands());
      setEarnedPoints(0);
    }
  }, [lesson]);

  // 現在のステップに基づいてサジェストコマンドを更新
  useEffect(() => {
    if (lesson && lesson.steps && lesson.steps[currentStep]) {
      const step = lesson.steps[currentStep];
      if (step.suggestedCommands) {
        setSuggestedCommands(step.suggestedCommands);
      } else {
        setSuggestedCommands(getInitialSuggestedCommands());
      }
    }
  }, [currentStep, lesson]);

  // リポジトリをリセット
  const resetRepository = () => {
    setRepository({
      commits: [],
      branches: [],
      head: null,
      currentBranch: 'main',
      workingDirectory: {},
      stagingArea: {}
    });
  };

  // 初期サジェストコマンド
  const getInitialSuggestedCommands = () => {
    return [
      { command: 'git init', description: 'リポジトリを初期化' },
      { command: 'git status', description: '状態を確認' },
      { command: 'git add README.md', description: 'ファイルをステージング' },
      { command: 'git commit -m "Initial commit"', description: '変更をコミット' }
    ];
  };

  // コマンド実行処理
  const executeCommand = (command) => {
    // コマンド履歴に追加
    setCommandHistory(prev => [...prev, { type: 'input', content: command }]);
    
    // コマンドの解析
    const cmdParts = command.trim().split(' ');
    
    // gitコマンドでない場合
    if (cmdParts[0] !== 'git') {
      return `'${cmdParts[0]}' はコマンドとして認識されていません。Gitコマンドは 'git' で始まります。`;
    }
    
    // gitコマンドの処理
    const gitCmd = cmdParts[1];
    
    let result = '';
    let pointsEarned = 0;
    
    switch (gitCmd) {
      case 'init':
        if (repository.commits.length > 0) {
          result = 'リポジトリはすでに初期化されています。';
        } else {
          // リポジトリを初期化
          setRepository(prev => ({
            ...prev,
            branches: [{ name: 'main', commitId: null }],
            currentBranch: 'main'
          }));
          result = '空のGitリポジトリを .git/ に初期化しました';
          pointsEarned = 5;
          
          // 現在のステップの目標が達成されたか確認
          checkStepCompletion('init');
        }
        break;
        
      case 'status':
        // リポジトリの状態を表示
        result = getStatusOutput();
        pointsEarned = 1;
        break;
        
      case 'add':
        // ファイルをステージングエリアに追加
        if (cmdParts.length < 3 && cmdParts[2] !== '.') {
          result = 'エラー: 追加するファイルを指定してください。例: git add <ファイル名> または git add .';
        } else {
          const fileName = cmdParts[2] === '.' ? 'README.md' : cmdParts[2];
          
          // ワーキングディレクトリにファイルがない場合は作成
          if (!repository.workingDirectory[fileName]) {
            setRepository(prev => ({
              ...prev,
              workingDirectory: {
                ...prev.workingDirectory,
                [fileName]: { status: 'added', content: `# ${fileName}\nこれはサンプルファイルです。` }
              }
            }));
          }
          
          // ファイルをステージングエリアに追加
          setRepository(prev => ({
            ...prev,
            stagingArea: {
              ...prev.stagingArea,
              [fileName]: { 
                status: prev.workingDirectory[fileName]?.status || 'added',
                content: prev.workingDirectory[fileName]?.content || `# ${fileName}\nこれはサンプルファイルです。`
              }
            }
          }));
          
          result = `変更をステージングしました: ${fileName}`;
          pointsEarned = 3;
          
          // 現在のステップの目標が達成されたか確認
          checkStepCompletion('add');
        }
        break;
        
      case 'commit':
        // 変更をコミット
        if (!cmdParts.includes('-m')) {
          result = 'エラー: コミットメッセージを指定してください。例: git commit -m "コミットメッセージ"';
        } else {
          const messageIndex = cmdParts.indexOf('-m') + 1;
          if (messageIndex >= cmdParts.length) {
            result = 'エラー: コミットメッセージが指定されていません。';
          } else {
            // コミットメッセージを取得（引用符で囲まれている場合は引用符を除去）
            let message = cmdParts.slice(messageIndex).join(' ');
            if (message.startsWith('"') && message.endsWith('"')) {
              message = message.slice(1, -1);
            }
            
            if (Object.keys(repository.stagingArea).length === 0) {
              result = 'エラー: コミットするための変更がステージングされていません。';
            } else {
              // 新しいコミットを作成
              const newCommit = {
                id: generateCommitId(),
                message: message,
                parentId: repository.head,
                branch: repository.currentBranch,
                date: new Date().toISOString(),
                changes: { ...repository.stagingArea }
              };
              
              // コミットを追加
              setRepository(prev => {
                // 現在のブランチを更新
                const updatedBranches = prev.branches.map(branch => 
                  branch.name === prev.currentBranch 
                    ? { ...branch, commitId: newCommit.id } 
                    : branch
                );
                
                return {
                  ...prev,
                  commits: [newCommit, ...prev.commits],
                  branches: updatedBranches,
                  head: newCommit.id,
                  stagingArea: {} // ステージングエリアをクリア
                };
              });
              
              result = `[${repository.currentBranch} ${newCommit.id.substring(0, 7)}] ${message}`;
              pointsEarned = 10;
              
              // 現在のステップの目標が達成されたか確認
              checkStepCompletion('commit');
            }
          }
        }
        break;
        
      case 'branch':
        // ブランチの操作
        if (cmdParts.length < 3) {
          // ブランチ一覧を表示
          if (repository.branches.length === 0) {
            result = 'ブランチがありません。';
          } else {
            result = repository.branches.map(branch => 
              `${branch.name === repository.currentBranch ? '* ' : '  '}${branch.name}`
            ).join('\n');
          }
        } else {
          const branchName = cmdParts[2];
          
          // ブランチが既に存在するか確認
          if (repository.branches.some(b => b.name === branchName)) {
            result = `エラー: ブランチ '${branchName}' は既に存在します。`;
          } else {
            // 新しいブランチを作成
            setRepository(prev => ({
              ...prev,
              branches: [
                ...prev.branches,
                { name: branchName, commitId: prev.head }
              ]
            }));
            
            result = `ブランチ '${branchName}' を作成しました。`;
            pointsEarned = 5;
            
            // 現在のステップの目標が達成されたか確認
            checkStepCompletion('branch');
          }
        }
        break;
        
      case 'checkout':
        // ブランチの切り替え
        if (cmdParts.length < 3) {
          result = 'エラー: 切り替え先のブランチを指定してください。例: git checkout <ブランチ名>';
        } else {
          const targetBranch = cmdParts[2];
          
          // 新しいブランチを作成して切り替える場合
          if (cmdParts.includes('-b')) {
            const newBranchIndex = cmdParts.indexOf('-b') + 1;
            const newBranchName = cmdParts[newBranchIndex];
            
            if (!newBranchName) {
              result = 'エラー: 新しいブランチ名を指定してください。例: git checkout -b <新しいブランチ名>';
            } else if (repository.branches.some(b => b.name === newBranchName)) {
              result = `エラー: ブランチ '${newBranchName}' は既に存在します。`;
            } else {
              // 新しいブランチを作成して切り替え
              setRepository(prev => ({
                ...prev,
                branches: [
                  ...prev.branches,
                  { name: newBranchName, commitId: prev.head }
                ],
                currentBranch: newBranchName
              }));
              
              result = `ブランチ '${newBranchName}' を作成し、切り替えました。`;
              pointsEarned = 8;
              
              // 現在のステップの目標が達成されたか確認
              checkStepCompletion('checkout', { newBranch: true });
            }
          } else {
            // 既存のブランチに切り替える
            const branch = repository.branches.find(b => b.name === targetBranch);
            
            if (!branch) {
              result = `エラー: ブランチ '${targetBranch}' が見つかりません。`;
            } else {
              setRepository(prev => ({
                ...prev,
                currentBranch: targetBranch,
                head: branch.commitId
              }));
              
              result = `ブランチ '${targetBranch}' に切り替えました。`;
              pointsEarned = 5;
              
              // 現在のステップの目標が達成されたか確認
              checkStepCompletion('checkout');
            }
          }
        }
        break;
        
      case 'log':
        // コミット履歴を表示
        if (repository.commits.length === 0) {
          result = 'コミット履歴がありません。';
        } else {
          result = repository.commits.map(commit => 
            `commit ${commit.id}\n` +
            `Author: User <user@example.com>\n` +
            `Date: ${new Date(commit.date).toLocaleString()}\n\n` +
            `    ${commit.message}\n`
          ).join('\n');
          
          pointsEarned = 2;
        }
        break;
        
      case 'merge':
        // ブランチのマージ
        if (cmdParts.length < 3) {
          result = 'エラー: マージするブランチを指定してください。例: git merge <ブランチ名>';
        } else {
          const sourceBranch = cmdParts[2];
          const targetBranch = repository.currentBranch;
          
          // ソースブランチが存在するか確認
          const sourceBranchObj = repository.branches.find(b => b.name === sourceBranch);
          if (!sourceBranchObj) {
            result = `エラー: ブランチ '${sourceBranch}' が見つかりません。`;
          } else if (sourceBranch === targetBranch) {
            result = `エラー: 現在のブランチ '${targetBranch}' に同じブランチをマージすることはできません。`;
          } else {
            // マージコミットを作成
            const sourceCommit = repository.commits.find(c => c.id === sourceBranchObj.commitId);
            const targetCommitId = repository.branches.find(b => b.name === targetBranch)?.commitId;
            
            if (!sourceCommit) {
              result = `エラー: ブランチ '${sourceBranch}' にコミットがありません。`;
            } else {
              const mergeCommit = {
                id: generateCommitId(),
                message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
                parentId: targetCommitId,
                secondParentId: sourceCommit.id,
                branch: targetBranch,
                date: new Date().toISOString(),
                changes: {}
              };
              
              // コミットを追加
              setRepository(prev => {
                // 現在のブランチを更新
                const updatedBranches = prev.branches.map(branch => 
                  branch.name === targetBranch 
                    ? { ...branch, commitId: mergeCommit.id } 
                    : branch
                );
                
                return {
                  ...prev,
                  commits: [mergeCommit, ...prev.commits],
                  branches: updatedBranches,
                  head: mergeCommit.id
                };
              });
              
              result = `ブランチ '${sourceBranch}' を '${targetBranch}' にマージしました。`;
              pointsEarned = 15;
              
              // 現在のステップの目標が達成されたか確認
              checkStepCompletion('merge');
            }
          }
        }
        break;
        
      default:
        result = `'git ${gitCmd}' は現在このシミュレーターでサポートされていないコマンドです。`;
    }
    
    // ポイントを加算
    if (pointsEarned > 0) {
      setEarnedPoints(prev => {
        const newPoints = prev + pointsEarned;
        // ポイント獲得時にお祝いメッセージを表示
        if (pointsEarned >= 5) {
          setShowCongratulation(true);
          setTimeout(() => setShowCongratulation(false), 3000);
        }
        return newPoints;
      });
      
      // コマンド実行結果にポイント獲得を追加
      result += `\n\n+${pointsEarned} ポイント獲得！`;
    }
    
    return result;
  };

  // リポジトリの状態を文字列で取得
  const getStatusOutput = () => {
    if (repository.commits.length === 0) {
      return 'リポジトリが初期化されていません。git init を実行してください。';
    }
    
    let output = `ブランチ ${repository.currentBranch}\n`;
    
    if (repository.head) {
      const headCommit = repository.commits.find(c => c.id === repository.head);
      if (headCommit) {
        output += `コミット: ${headCommit.id.substring(0, 7)} ${headCommit.message}\n`;
      }
    }
    
    output += '\n変更されたファイル:\n';
    
    if (Object.keys(repository.workingDirectory).length === 0) {
      output += '  (なし)\n';
    } else {
      Object.keys(repository.workingDirectory).forEach(file => {
        const status = repository.workingDirectory[file].status;
        output += `  ${status === 'added' ? '新規: ' : status === 'modified' ? '変更: ' : '削除: '}${file}\n`;
      });
    }
    
    output += '\nステージングされた変更:\n';
    
    if (Object.keys(repository.stagingArea).length === 0) {
      output += '  (なし)\n';
    } else {
      Object.keys(repository.stagingArea).forEach(file => {
        const status = repository.stagingArea[file].status;
        output += `  ${status === 'added' ? '新規: ' : status === 'modified' ? '変更: ' : '削除: '}${file}\n`;
      });
    }
    
    return output;
  };

  // ランダムなコミットIDを生成
  const generateCommitId = () => {
    return Array.from({ length: 40 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
  };

  // 現在のステップの目標が達成されたか確認
  const checkStepCompletion = (command, options = {}) => {
    if (!lesson || !lesson.steps || !lesson.steps[currentStep]) return;
    
    const step = lesson.steps[currentStep];
    
    // ステップの目標コマンドが指定されている場合
    if (step.targetCommands && step.targetCommands.includes(command)) {
      // 特定のコマンドに追加条件がある場合
      if (command === 'checkout' && step.targetCommands.includes('checkout-b') && !options.newBranch) {
        return; // checkout -b が必要なのに通常の checkout の場合はスキップ
      }
      
      // 次のステップに進む
      if (currentStep < lesson.steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setShowHint(false);
      } else {
        // レッスン完了
        setIsCompleted(true);
        if (onComplete) {
          onComplete(lesson.id, earnedPoints);
        }
      }
    }
  };

  // 次のステップに進む
  const nextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    } else {
      // レッスン完了
      setIsCompleted(true);
      if (onComplete) {
        onComplete(lesson.id, earnedPoints);
      }
    }
  };

  // 前のステップに戻る
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  // ヒントを表示
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // レッスンが存在しない場合
  if (!lesson) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>レッスンが選択されていません。</p>
        </div>
      </div>
    );
  }

  const { title, description, steps } = lesson;
  const step = steps[currentStep];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.progress}>
          <div 
            className={styles.progressBar}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className={styles.pointsContainer}>
          <span className={styles.pointsLabel}>ポイント:</span>
          <span className={styles.pointsValue}>{earnedPoints}</span>
        </div>
      </div>

      {showCongratulation && (
        <div className={styles.congratulation}>
          <div className={styles.congratulationContent}>
            <span className={styles.congratulationEmoji}>🎉</span>
            <span className={styles.congratulationText}>素晴らしい！ポイントを獲得しました！</span>
          </div>
        </div>
      )}

      <div className={styles.content}>
        {isCompleted ? (
          <div className={styles.completion}>
            <h3>レッスン完了！</h3>
            <p>{description}</p>
            <p>おめでとうございます！このレッスンを完了しました。</p>
            <p>獲得ポイント: <strong>{earnedPoints}</strong></p>
            <button 
              className={styles.button}
              onClick={() => {
                setIsCompleted(false);
                setCurrentStep(0);
                resetRepository();
                setCommandHistory([]);
                setSuggestedCommands(getInitialSuggestedCommands());
              }}
            >
              もう一度学習する
            </button>
          </div>
        ) : (
          <>
            <div className={styles.lessonContent}>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <div className={styles.stepDescription}>
                  {step.description}
                </div>
                
                {step.codeExample && (
                  <div className={styles.codeBlock}>
                    <pre>
                      <code>{step.codeExample}</code>
                    </pre>
                  </div>
                )}
                
                {step.image && (
                  <div className={styles.imageContainer}>
                    <img 
                      src={step.image} 
                      alt={step.imageAlt || step.title} 
                      className={styles.image}
                    />
                  </div>
                )}
                
                <div className={styles.hintContainer}>
                  <button 
                    className={styles.hintButton}
                    onClick={toggleHint}
                  >
                    {showHint ? 'ヒントを隠す' : 'ヒントを表示'}
                  </button>
                  
                  {showHint && step.hint && (
                    <div className={styles.hint}>
                      <h4>ヒント:</h4>
                      <p>{step.hint}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.visualizerContainer}>
                <EnhancedGitVisualizer 
                  repository={repository}
                  onCommandExecute={executeCommand}
                />
              </div>
              
              <div className={styles.terminalContainer}>
                <InteractiveCommandTerminal 
                  onCommandExecute={executeCommand}
                  commandHistory={commandHistory}
                  suggestedCommands={suggestedCommands}
                  showHints={true}
                />
              </div>
            </div>

            <div className={styles.navigation}>
              <button 
                className={`${styles.button} ${currentStep === 0 ? styles.disabled : ''}`}
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                前へ
              </button>
              <div className={styles.stepIndicator}>
                {currentStep + 1} / {steps.length}
              </div>
              <button 
                className={styles.button}
                onClick={nextStep}
              >
                {currentStep === steps.length - 1 ? '完了' : '次へ'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import styles from '../../styles/EnhancedGitVisualizer.module.css';

export default function EnhancedGitVisualizer({ repository, onCommandExecute }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'network', 'timeline'

  // ズームイン
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  // ズームアウト
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  // コミットの選択
  const handleCommitSelect = (commit) => {
    setSelectedCommit(commit);
    setShowDiff(true);
  };

  // 表示モードの切り替え
  const changeViewMode = (mode) => {
    setViewMode(mode);
  };

  // リポジトリが空の場合
  if (!repository || !repository.commits || repository.commits.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>リポジトリが空です。最初のコミットを作成してください。</p>
          <div className={styles.commandSuggestion}>
            <p>試してみましょう:</p>
            <div className={styles.commandExample} onClick={() => onCommandExecute && onCommandExecute('git init')}>
              <code>git init</code>
              <span className={styles.runButton}>実行</span>
            </div>
            <div className={styles.commandExample} onClick={() => onCommandExecute && onCommandExecute('git add README.md')}>
              <code>git add README.md</code>
              <span className={styles.runButton}>実行</span>
            </div>
            <div className={styles.commandExample} onClick={() => onCommandExecute && onCommandExecute('git commit -m "Initial commit"')}>
              <code>git commit -m "Initial commit"</code>
              <span className={styles.runButton}>実行</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.viewModes}>
          <button 
            onClick={() => changeViewMode('tree')} 
            className={`${styles.viewModeButton} ${viewMode === 'tree' ? styles.active : ''}`}
          >
            ツリー表示
          </button>
          <button 
            onClick={() => changeViewMode('network')} 
            className={`${styles.viewModeButton} ${viewMode === 'network' ? styles.active : ''}`}
          >
            ネットワーク表示
          </button>
          <button 
            onClick={() => changeViewMode('timeline')} 
            className={`${styles.viewModeButton} ${viewMode === 'timeline' ? styles.active : ''}`}
          >
            タイムライン表示
          </button>
        </div>
        <div className={styles.zoomControls}>
          <button onClick={zoomOut} className={styles.toolbarButton}>
            縮小
          </button>
          <span className={styles.zoomLevel}>{Math.round(zoomLevel * 100)}%</span>
          <button onClick={zoomIn} className={styles.toolbarButton}>
            拡大
          </button>
        </div>
      </div>

      <div className={styles.visualizerContainer}>
        <div 
          className={`${styles.visualizer} ${styles[viewMode]}`}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* コミットグラフの表示 */}
          <div className={styles.commitGraph}>
            {repository.commits.map((commit, index) => (
              <div 
                key={commit.id} 
                className={`${styles.commit} ${commit.id === repository.head ? styles.head : ''} ${selectedCommit?.id === commit.id ? styles.selected : ''}`}
                style={{ top: `${index * 60}px` }}
                onClick={() => handleCommitSelect(commit)}
              >
                <div className={styles.commitNode}></div>
                <div className={styles.commitInfo}>
                  <div className={styles.commitId}>{commit.id.substring(0, 7)}</div>
                  <div className={styles.commitMessage}>{commit.message}</div>
                  <div className={styles.commitDate}>{commit.date || '日時不明'}</div>
                </div>
                
                {/* ブランチラベルの表示 */}
                <div className={styles.branchLabels}>
                  {repository.branches
                    .filter(branch => branch.commitId === commit.id)
                    .map(branch => (
                      <span 
                        key={branch.name} 
                        className={`${styles.branchLabel} ${branch.name === repository.currentBranch ? styles.currentBranch : ''}`}
                      >
                        {branch.name}
                      </span>
                    ))
                  }
                </div>
              </div>
            ))}
            
            {/* コミット間の線の表示 */}
            {repository.commits.map((commit, index) => {
              if (index === 0) return null;
              
              // 親コミットへの参照を取得
              const parentCommit = repository.commits.find(c => c.id === commit.parentId);
              const parentIndex = repository.commits.findIndex(c => c.id === commit.parentId);
              
              if (parentIndex === -1) return null;
              
              return (
                <div 
                  key={`line-${commit.id}`}
                  className={styles.commitLine}
                  style={{
                    top: `${Math.min(index, parentIndex) * 60 + 30}px`,
                    height: `${Math.abs(index - parentIndex) * 60}px`,
                    left: commit.branch !== parentCommit?.branch ? '30px' : '20px',
                    width: commit.branch !== parentCommit?.branch ? '30px' : '2px'
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* リポジトリの状態表示 */}
        <div className={styles.repoStateContainer}>
          <div className={styles.repoStateSection}>
            <h3>ワーキングディレクトリ</h3>
            <div className={styles.fileList}>
              {repository.workingDirectory && Object.keys(repository.workingDirectory).map(file => (
                <div key={file} className={styles.file}>
                  <span className={styles.fileName}>{file}</span>
                  <span className={`${styles.fileStatus} ${getStatusClass(repository.workingDirectory[file].status)}`}>
                    {getStatusLabel(repository.workingDirectory[file].status)}
                  </span>
                </div>
              ))}
              {(!repository.workingDirectory || Object.keys(repository.workingDirectory).length === 0) && (
                <div className={styles.emptyMessage}>変更されたファイルはありません</div>
              )}
            </div>
          </div>
          
          <div className={styles.repoStateSection}>
            <h3>ステージングエリア</h3>
            <div className={styles.fileList}>
              {repository.stagingArea && Object.keys(repository.stagingArea).map(file => (
                <div key={file} className={styles.file}>
                  <span className={styles.fileName}>{file}</span>
                  <span className={`${styles.fileStatus} ${getStatusClass('staged')}`}>
                    ステージング済み
                  </span>
                </div>
              ))}
              {(!repository.stagingArea || Object.keys(repository.stagingArea).length === 0) && (
                <div className={styles.emptyMessage}>ステージングされたファイルはありません</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 選択されたコミットの詳細表示 */}
      {selectedCommit && showDiff && (
        <div className={styles.commitDetails}>
          <div className={styles.commitDetailsHeader}>
            <h3>コミット詳細: {selectedCommit.id.substring(0, 7)}</h3>
            <button className={styles.closeButton} onClick={() => setShowDiff(false)}>×</button>
          </div>
          <div className={styles.commitDetailsContent}>
            <div className={styles.commitMeta}>
              <p><strong>メッセージ:</strong> {selectedCommit.message}</p>
              <p><strong>作者:</strong> {selectedCommit.author || '不明'}</p>
              <p><strong>日時:</strong> {selectedCommit.date || '日時不明'}</p>
            </div>
            <div className={styles.commitDiff}>
              <h4>変更内容</h4>
              {selectedCommit.changes ? (
                Object.keys(selectedCommit.changes).map(file => (
                  <div key={file} className={styles.fileDiff}>
                    <div className={styles.fileDiffHeader}>{file}</div>
                    <pre className={styles.diffContent}>
                      {selectedCommit.changes[file]}
                    </pre>
                  </div>
                ))
              ) : (
                <p>変更内容の詳細は利用できません</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* コマンドサジェスト */}
      <div className={styles.commandSuggestions}>
        <h3>次に試せるコマンド</h3>
        <div className={styles.suggestedCommands}>
          {getSuggestedCommands(repository).map((command, index) => (
            <div 
              key={index} 
              className={styles.commandExample}
              onClick={() => onCommandExecute && onCommandExecute(command.command)}
            >
              <code>{command.command}</code>
              <span className={styles.commandDescription}>{command.description}</span>
              <span className={styles.runButton}>実行</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ファイルステータスに応じたクラス名を取得
function getStatusClass(status) {
  switch(status) {
    case 'modified': return styles.modified;
    case 'added': return styles.added;
    case 'deleted': return styles.deleted;
    case 'staged': return styles.staged;
    default: return '';
  }
}

// ファイルステータスに応じたラベルを取得
function getStatusLabel(status) {
  switch(status) {
    case 'modified': return '変更';
    case 'added': return '新規';
    case 'deleted': return '削除';
    default: return status;
  }
}

// リポジトリの状態に応じたサジェストコマンドを取得
function getSuggestedCommands(repository) {
  const commands = [];
  
  // ワーキングディレクトリに変更がある場合
  if (repository.workingDirectory && Object.keys(repository.workingDirectory).length > 0) {
    commands.push({
      command: 'git status',
      description: '変更されたファイルの状態を確認'
    });
    commands.push({
      command: 'git add .',
      description: 'すべての変更をステージングエリアに追加'
    });
  }
  
  // ステージングエリアにファイルがある場合
  if (repository.stagingArea && Object.keys(repository.stagingArea).length > 0) {
    commands.push({
      command: 'git commit -m "コミットメッセージ"',
      description: 'ステージングされた変更をコミット'
    });
  }
  
  // コミットが存在する場合
  if (repository.commits && repository.commits.length > 0) {
    commands.push({
      command: 'git log',
      description: 'コミット履歴を表示'
    });
    commands.push({
      command: 'git branch feature-branch',
      description: '新しいブランチを作成'
    });
  }
  
  // ブランチが複数ある場合
  if (repository.branches && repository.branches.length > 1) {
    const otherBranch = repository.branches.find(b => b.name !== repository.currentBranch);
    if (otherBranch) {
      commands.push({
        command: `git checkout ${otherBranch.name}`,
        description: `${otherBranch.name}ブランチに切り替え`
      });
      commands.push({
        command: `git merge ${otherBranch.name}`,
        description: `現在のブランチに${otherBranch.name}をマージ`
      });
    }
  }
  
  // コマンドが少ない場合は基本コマンドを追加
  if (commands.length < 3) {
    if (!commands.some(c => c.command.includes('git status'))) {
      commands.push({
        command: 'git status',
        description: 'リポジトリの状態を確認'
      });
    }
    if (!commands.some(c => c.command.includes('git log'))) {
      commands.push({
        command: 'git log',
        description: 'コミット履歴を表示'
      });
    }
  }
  
  return commands.slice(0, 5); // 最大5つのコマンドを返す
}

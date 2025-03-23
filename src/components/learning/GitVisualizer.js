import { useState } from 'react';
import styles from '../../styles/GitVisualizer.module.css';

export default function GitVisualizer({ repository }) {
  // リポジトリの状態を視覚化するコンポーネント
  // repository: {
  //   commits: [], // コミット履歴
  //   branches: [], // ブランチ情報
  //   head: '', // 現在のHEADの位置
  //   workingDirectory: {}, // 作業ディレクトリの状態
  //   stagingArea: {} // ステージングエリアの状態
  // }

  const [zoomLevel, setZoomLevel] = useState(1);

  // ズームイン
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  // ズームアウト
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  // リポジトリが空の場合
  if (!repository || !repository.commits || repository.commits.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>リポジトリが空です。最初のコミットを作成してください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={zoomIn} className={styles.toolbarButton}>
          拡大
        </button>
        <button onClick={zoomOut} className={styles.toolbarButton}>
          縮小
        </button>
      </div>

      <div 
        className={styles.visualizer}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* コミットグラフの表示 */}
        <div className={styles.commitGraph}>
          {repository.commits.map((commit, index) => (
            <div 
              key={commit.id} 
              className={`${styles.commit} ${commit.id === repository.head ? styles.head : ''}`}
              style={{ top: `${index * 60}px` }}
            >
              <div className={styles.commitNode}></div>
              <div className={styles.commitInfo}>
                <div className={styles.commitId}>{commit.id.substring(0, 7)}</div>
                <div className={styles.commitMessage}>{commit.message}</div>
              </div>
              
              {/* ブランチラベルの表示 */}
              <div className={styles.branchLabels}>
                {repository.branches
                  .filter(branch => branch.commitId === commit.id)
                  .map(branch => (
                    <span key={branch.name} className={styles.branchLabel}>
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
            return (
              <div 
                key={`line-${commit.id}`}
                className={styles.commitLine}
                style={{
                  top: `${(index - 0.5) * 60}px`,
                  height: '60px'
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

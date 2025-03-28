# Gitトレーニングアプリケーション修正タスク

## 修正項目
- [x] ①learn/simulatorページのネットワーク表示とタイムライン表示の修正
- [x] ②learn/simulatorページの「次に試せるコマンド」の実行ボタン機能修正
- [x] ③learn/simulatorページの差分ファイル表示の改善
- [x] ④learn/simulatorページから実績機能の削除
- [x] ⑤Gitシミュレーターをトップページに移動（学習をはじめる、チャレンジ、Gitについての項目は削除）

## 詳細タスク
### ①ネットワーク表示とタイムライン表示の修正
- [x] EnhancedGitVisualizer.module.cssにネットワーク表示のスタイルを実装
- [x] EnhancedGitVisualizer.module.cssにタイムライン表示のスタイルを実装
- [x] EnhancedGitVisualizer.jsのviewMode切り替え機能を確認・修正

### ②「次に試せるコマンド」の実行ボタン機能修正
- [x] simulator.jsからEnhancedGitVisualizerへのonCommandExecute関数の受け渡しを修正
- [x] EnhancedGitVisualizer.jsの実行ボタンクリックイベントを修正

### ③差分ファイル表示の改善
- [x] コミット詳細表示の差分表示部分を改善
- [x] 差分ファイルの視覚的表示を強化

### ④実績機能の削除
- [x] simulator.jsから実績関連のコードを削除
- [x] AchievementSystemコンポーネントの参照を削除

### ⑤Gitシミュレーターをトップページに移動
- [x] index.jsを修正してGitシミュレーターを表示
- [x] 不要な項目（学習をはじめる、チャレンジ、Gitについて）を削除

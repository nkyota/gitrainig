import { useState, useEffect, useRef } from 'react';
import styles from '../../../styles/InteractiveCommandTerminal.module.css';

export default function InteractiveCommandTerminal({ 
  onCommandExecute, 
  commandHistory = [], 
  suggestedCommands = [],
  showHints = true
}) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(commandHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCommandHelp, setShowCommandHelp] = useState(false);
  const [helpCommand, setHelpCommand] = useState('');
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [selectedAutoCompleteIndex, setSelectedAutoCompleteIndex] = useState(0);
  
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const autoCompleteRef = useRef(null);

  // ターミナルを常に最下部にスクロール
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // 入力フォーカス維持
  useEffect(() => {
    const handleClick = (e) => {
      // オートコンプリートメニューの外側をクリックした場合、メニューを閉じる
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(e.target)) {
        setShowAutoComplete(false);
      }
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // コマンド実行処理
  const executeCommand = () => {
    if (!input.trim()) return;

    // 履歴に追加
    const newHistory = [...history, { type: 'input', content: input }];
    setHistory(newHistory);

    // ヘルプコマンドの処理
    if (input.trim() === 'help') {
      setHistory(prev => [...prev, { 
        type: 'output', 
        content: `利用可能なGitコマンド:
- git init: 新しいGitリポジトリを初期化します
- git add <file>: ファイルをステージングエリアに追加します
- git commit -m "<message>": 変更をコミットします
- git status: ワーキングディレクトリとステージングエリアの状態を表示します
- git log: コミット履歴を表示します
- git branch <name>: 新しいブランチを作成します
- git checkout <branch>: 指定したブランチに切り替えます
- git merge <branch>: 現在のブランチに指定したブランチをマージします

詳細なヘルプは 'git help <command>' を実行してください。` 
      }]);
    } else if (input.trim().startsWith('git help ') || input.trim().startsWith('help ')) {
      const cmdParts = input.trim().split(' ');
      const helpCmd = cmdParts[cmdParts.length - 1];
      setHelpCommand(helpCmd);
      setShowCommandHelp(true);
    } else {
      // 親コンポーネントにコマンド実行を通知
      if (onCommandExecute) {
        const result = onCommandExecute(input);
        
        // 結果を履歴に追加
        if (result) {
          setHistory(prev => [...prev, { type: 'output', content: result }]);
        }
      }
    }

    // 入力をクリア
    setInput('');
    setHistoryIndex(-1);
    setShowAutoComplete(false);
  };

  // オートコンプリートの処理
  const handleAutoComplete = () => {
    if (!input.trim()) return;
    
    const gitCommands = [
      'git init',
      'git add',
      'git commit -m',
      'git status',
      'git log',
      'git branch',
      'git checkout',
      'git merge',
      'git pull',
      'git push',
      'git clone',
      'git fetch',
      'git reset',
      'git revert',
      'git stash',
      'git tag',
      'git remote',
      'git diff'
    ];
    
    const matchingCommands = gitCommands.filter(cmd => 
      cmd.startsWith(input.trim()) && cmd !== input.trim()
    );
    
    if (matchingCommands.length > 0) {
      setAutoCompleteOptions(matchingCommands);
      setShowAutoComplete(true);
      setSelectedAutoCompleteIndex(0);
    } else {
      setShowAutoComplete(false);
    }
  };

  // オートコンプリートオプションの選択
  const selectAutoCompleteOption = (option) => {
    setInput(option);
    setShowAutoComplete(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // キー入力処理
  const handleKeyDown = (e) => {
    if (showAutoComplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAutoCompleteIndex(prev => 
          prev < autoCompleteOptions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAutoCompleteIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectAutoCompleteOption(autoCompleteOptions[selectedAutoCompleteIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutoComplete(false);
      }
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutoComplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // 履歴を遡る
      if (historyIndex < history.filter(item => item.type === 'input').length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        
        const inputCommands = history.filter(item => item.type === 'input');
        const commandIndex = inputCommands.length - 1 - newIndex;
        if (commandIndex >= 0) {
          setInput(inputCommands[commandIndex].content);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // 履歴を進む
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        
        const inputCommands = history.filter(item => item.type === 'input');
        const commandIndex = inputCommands.length - 1 - newIndex;
        if (commandIndex >= 0) {
          setInput(inputCommands[commandIndex].content);
        }
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      setShowCommandHelp(false);
    }
  };

  // 入力変更時の処理
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowAutoComplete(false);
  };

  // コマンドヘルプの内容を取得
  const getCommandHelp = (command) => {
    const helpContent = {
      'init': `git init - 新しいGitリポジトリを初期化します

使用法: git init [オプション]

説明:
  空のGitリポジトリを作成するか、既存のディレクトリをGitリポジトリとして再初期化します。
  このコマンドは、.gitディレクトリを作成し、バージョン管理に必要なファイルを設定します。

オプション:
  --bare       ベアリポジトリを作成します（作業ディレクトリなし）
  --quiet      エラーと警告のみを表示します
  --template=<テンプレートディレクトリ>  テンプレートディレクトリを指定します

例:
  git init     カレントディレクトリに新しいGitリポジトリを作成します`,
      
      'add': `git add - ファイルの内容をインデックス（ステージングエリア）に追加します

使用法: git add [オプション] [--] <パス>...

説明:
  指定したファイルの現在の内容をインデックスに追加します。
  これにより、次のコミットに含める変更を準備します。

オプション:
  -A, --all    すべての変更（新規、修正、削除）をステージングします
  -u, --update 既にトラッキングされているファイルの変更のみをステージングします
  -p, --patch  対話的にハンクを選択してステージングします

例:
  git add file.txt     特定のファイルをステージングします
  git add .            カレントディレクトリ以下のすべての変更をステージングします`,
      
      'commit': `git commit - 変更をリポジトリに記録します

使用法: git commit [オプション]

説明:
  ステージングされた変更をリポジトリに記録します。
  各コミットには、変更内容、作者情報、タイムスタンプが含まれます。

オプション:
  -m, --message <メッセージ>  コミットメッセージを指定します
  -a, --all                  すべての変更をステージングしてからコミットします
  --amend                    直前のコミットを修正します

例:
  git commit -m "バグ修正"    "バグ修正"というメッセージでコミットします
  git commit -am "機能追加"   すべての変更をステージングして"機能追加"というメッセージでコミットします`,
      
      'status': `git status - ワーキングツリーの状態を表示します

使用法: git status [オプション]

説明:
  ワーキングディレクトリとステージングエリアの状態を表示します。
  どのファイルが変更されたか、どのファイルがステージングされているか、
  どのファイルがトラッキングされていないかを確認できます。

オプション:
  -s, --short   短い形式で出力します
  -b, --branch  ブランチ情報も表示します

例:
  git status     詳細な状態を表示します
  git status -s  簡潔な形式で状態を表示します`,
      
      'log': `git log - コミット履歴を表示します

使用法: git log [オプション]

説明:
  コミット履歴を新しい順に表示します。
  各コミットのID、作者、日時、メッセージが表示されます。

オプション:
  --oneline     各コミットを1行で表示します
  -n <数>       表示するコミット数を制限します
  --graph       ブランチとマージの履歴をASCIIグラフで表示します
  --all         すべてのブランチのコミットを表示します

例:
  git log           詳細なコミット履歴を表示します
  git log --oneline 簡潔なコミット履歴を表示します
  git log --graph   グラフ形式でコミット履歴を表示します`,
      
      'branch': `git branch - ブランチを一覧表示、作成、または削除します

使用法: git branch [オプション] [ブランチ名]

説明:
  引数なしで実行すると、ローカルブランチの一覧を表示します。
  ブランチ名を指定すると、新しいブランチを作成します。

オプション:
  -d, --delete <ブランチ>  指定したブランチを削除します
  -a, --all               リモートブランチを含むすべてのブランチを表示します
  -v, --verbose           各ブランチの最新のコミットも表示します

例:
  git branch              ブランチ一覧を表示します
  git branch feature      "feature"という名前の新しいブランチを作成します
  git branch -d feature   "feature"ブランチを削除します`,
      
      'checkout': `git checkout - ブランチを切り替えるか、ワーキングツリーのファイルを復元します

使用法: git checkout [オプション] <ブランチ名>
       git checkout [オプション] -- <ファイル>...

説明:
  ブランチを切り替えるか、ワーキングツリーのファイルをHEADの状態に復元します。

オプション:
  -b <新ブランチ>   新しいブランチを作成して切り替えます
  -f, --force      強制的に切り替えます（ローカルの変更が失われる可能性があります）

例:
  git checkout master        masterブランチに切り替えます
  git checkout -b feature    新しいfeatureブランチを作成して切り替えます
  git checkout -- file.txt   file.txtをHEADの状態に復元します`,
      
      'merge': `git merge - 2つ以上の開発履歴を統合します

使用法: git merge [オプション] <コミット>...

説明:
  現在のブランチに指定したブランチの変更を統合します。

オプション:
  --no-ff              常に新しいコミットを作成します（fast-forwardしない）
  --abort              マージを中止し、マージ前の状態に戻します
  --continue           コンフリクト解決後にマージを続行します

例:
  git merge feature    現在のブランチにfeatureブランチをマージします
  git merge --no-ff feature  fast-forwardせずにfeatureブランチをマージします`,
      
      'pull': `git pull - リモートリポジトリから取得して統合します

使用法: git pull [オプション] [リポジトリ [リファレンス]]

説明:
  リモートリポジトリから変更を取得し、現在のブランチにマージします。
  基本的に「git fetch」と「git merge」を連続して実行するのと同じです。

オプション:
  --rebase             マージの代わりにリベースを使用します
  --no-commit          マージ後に自動的にコミットしません

例:
  git pull             デフォルトのリモートから現在のブランチに対応するブランチを取得してマージします
  git pull origin master  originリポジトリのmasterブランチを取得してマージします`,
      
      'push': `git push - リモートリポジトリに変更を送信します

使用法: git push [オプション] [リポジトリ [リファレンス]]

説明:
  ローカルリポジトリの変更をリモートリポジトリに送信します。

オプション:
  -u, --set-upstream   アップストリームリファレンスを設定します
  --force              強制的にプッシュします（リモートの履歴が失われる可能性があります）
  --tags               すべてのタグをプッシュします

例:
  git push             現在のブランチをデフォルトのリモートにプッシュします
  git push origin feature  featureブランチをoriginリポジトリにプッシュします
  git push -u origin feature  featureブランチをoriginリポジトリにプッシュし、アップストリームとして設定します`
    };
    
    return helpContent[command] || `'${command}' に関するヘルプ情報は利用できません。`;
  };

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <span className={styles.button}></span>
            <span className={styles.button}></span>
            <span className={styles.button}></span>
          </div>
          <div className={styles.title}>Git Interactive Terminal</div>
          <div className={styles.shortcuts}>
            <span className={styles.shortcutItem}>Tab: オートコンプリート</span>
            <span className={styles.shortcutItem}>↑↓: 履歴</span>
            <span className={styles.shortcutItem}>help: コマンド一覧</span>
          </div>
        </div>
        
        <div className={styles.content} ref={terminalRef}>
          {/* ターミナルの初期メッセージ */}
          <div className={styles.welcomeMessage}>
            <p>Git Interactive Terminal へようこそ！</p>
            <p>Gitコマンドを入力して実行できます。「help」と入力すると利用可能なコマンドが表示されます。</p>
            <p>Tab キーでコマンド補完、↑↓キーで履歴を辿れます。</p>
          </div>
          
          {/* コマンド履歴 */}
          {history.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.line} ${item.type === 'input' ? styles.input : styles.output}`}
            >
              {item.type === 'input' ? (
                <>
                  <span className={styles.prompt}>$ </span>
                  <span>{item.content}</span>
                </>
              ) : (
                <pre className={styles.outputContent}>{item.content}</pre>
              )}
            </div>
          ))}
          
          {/* 入力行 */}
          <div className={styles.inputLine}>
            <span className={styles.prompt}>$ </span>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={styles.inputField}
                autoFocus
                placeholder="Gitコマンドを入力..."
              />
              
              {/* オートコンプリートメニュー */}
              {showAutoComplete && autoCompleteOptions.length > 0 && (
                <div className={styles.autoCompleteMenu} ref={autoCompleteRef}>
                  {autoCompleteOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`${styles.autoCompleteOption} ${index === selectedAutoCompleteIndex ? styles.selected : ''}`}
                      onClick={() => selectAutoCompleteOption(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* コマンドヘルプモーダル */}
      {showCommandHelp && (
        <div className={styles.helpModal}>
          <div className={styles.helpModalContent}>
            <div className={styles.helpModalHeader}>
              <h3>コマンドヘルプ: {helpCommand}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCommandHelp(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.helpModalBody}>
              <pre>{getCommandHelp(helpCommand)}</pre>
            </div>
          </div>
        </div>
      )}
      
      {/* サジェストコマンド */}
      {showHints && suggestedCommands.length > 0 && (
        <div className={styles.suggestedCommands}>
          <h4>おすすめのコマンド:</h4>
          <div className={styles.commandList}>
            {suggestedCommands.map((cmd, index) => (
              <div 
                key={index} 
                className={styles.suggestedCommand}
                onClick={() => setInput(cmd.command)}
              >
                <code>{cmd.command}</code>
                {cmd.description && <span className={styles.commandDescription}>{cmd.description}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

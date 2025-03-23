import { createContext, useState, useContext, useEffect } from 'react';

// Gitシミュレーターのコンテキスト
const GitSimulatorContext = createContext();

// Gitシミュレーターのプロバイダーコンポーネント
export function GitSimulatorProvider({ children }) {
  // リポジトリの初期状態
  const initialRepository = {
    commits: [],
    branches: [{ name: 'main', commitId: null }],
    head: null,
    workingDirectory: {},
    stagingArea: {}
  };

  // 状態管理
  const [repository, setRepository] = useState(initialRepository);
  const [commandHistory, setCommandHistory] = useState([]);
  const [lastCommandResult, setLastCommandResult] = useState(null);

  // ローカルストレージからの復元
  useEffect(() => {
    try {
      const savedRepository = localStorage.getItem('git-basics-repository');
      const savedCommandHistory = localStorage.getItem('git-basics-command-history');
      
      if (savedRepository) {
        setRepository(JSON.parse(savedRepository));
      }
      
      if (savedCommandHistory) {
        setCommandHistory(JSON.parse(savedCommandHistory));
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
  }, []);

  // 状態の保存
  useEffect(() => {
    try {
      localStorage.setItem('git-basics-repository', JSON.stringify(repository));
      localStorage.setItem('git-basics-command-history', JSON.stringify(commandHistory));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [repository, commandHistory]);

  // コマンド実行関数
  const executeCommand = (command) => {
    // コマンド履歴に追加
    const newCommandHistory = [...commandHistory, { type: 'input', content: command }];
    setCommandHistory(newCommandHistory);

    // コマンドの解析と実行
    const result = parseAndExecuteCommand(command, repository);
    
    // 結果を履歴に追加
    setCommandHistory([...newCommandHistory, { type: 'output', content: result.message }]);
    setLastCommandResult(result);
    
    // リポジトリの状態を更新
    if (result.success) {
      setRepository(result.repository);
    }
    
    return result.message;
  };

  // リポジトリのリセット
  const resetRepository = () => {
    setRepository(initialRepository);
    setCommandHistory([]);
    setLastCommandResult(null);
    localStorage.removeItem('git-basics-repository');
    localStorage.removeItem('git-basics-command-history');
  };

  // コンテキスト値
  const value = {
    repository,
    commandHistory,
    lastCommandResult,
    executeCommand,
    resetRepository
  };

  return (
    <GitSimulatorContext.Provider value={value}>
      {children}
    </GitSimulatorContext.Provider>
  );
}

// カスタムフック
export function useGitSimulator() {
  const context = useContext(GitSimulatorContext);
  if (context === undefined) {
    throw new Error('useGitSimulator must be used within a GitSimulatorProvider');
  }
  return context;
}

// コマンドの解析と実行
function parseAndExecuteCommand(commandStr, repository) {
  // コマンド文字列を解析
  const args = commandStr.trim().split(/\s+/);
  const command = args[0];
  
  // 初期の結果オブジェクト
  const result = {
    success: false,
    message: '',
    repository: { ...repository }
  };
  
  // コマンドに応じた処理
  switch (command) {
    case 'git':
      return handleGitCommand(args.slice(1), result);
    case 'help':
      return showHelp(result);
    case 'clear':
      return { success: true, message: 'Terminal cleared.', repository };
    default:
      result.message = `Command not found: ${command}. Type 'help' for available commands.`;
      return result;
  }
}

// gitコマンドの処理
function handleGitCommand(args, result) {
  if (args.length === 0) {
    result.message = 'usage: git <command> [<args>]\n\nType "git help" for available commands.';
    return result;
  }
  
  const subCommand = args[0];
  
  switch (subCommand) {
    case 'init':
      return gitInit(result);
    case 'commit':
      return gitCommit(args.slice(1), result);
    case 'branch':
      return gitBranch(args.slice(1), result);
    case 'checkout':
      return gitCheckout(args.slice(1), result);
    case 'status':
      return gitStatus(result);
    case 'log':
      return gitLog(result);
    case 'help':
      return gitHelp(result);
    case 'merge':
      return gitMerge(args.slice(1), result);
    case 'add':
      return gitAdd(args.slice(1), result);
    case 'remote':
      return gitRemote(args.slice(1), result);
    case 'pull':
      return gitPull(args.slice(1), result);
    case 'push':
      return gitPush(args.slice(1), result);
    default:
      result.message = `git: '${subCommand}' is not a git command. See 'git help'.`;
      return result;
  }
}

// git init コマンド
function gitInit(result) {
  const repo = result.repository;
  
  // 既に初期化されている場合
  if (repo.commits.length > 0) {
    result.message = 'Reinitialized existing Git repository.';
    return result;
  }
  
  // 初期化
  const initialCommit = {
    id: generateCommitId(),
    message: 'Initial commit',
    timestamp: new Date().toISOString(),
    parent: null
  };
  
  repo.commits = [initialCommit];
  repo.branches = [{ name: 'main', commitId: initialCommit.id }];
  repo.head = initialCommit.id;
  
  result.success = true;
  result.message = 'Initialized empty Git repository.';
  result.repository = repo;
  
  return result;
}

// git commit コマンド
function gitCommit(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // メッセージオプションの確認
  if (args.length < 2 || args[0] !== '-m') {
    result.message = 'error: option `-m` requires a value\n\nusage: git commit -m <message>';
    return result;
  }
  
  const message = args[1];
  const currentCommit = repo.commits.find(commit => commit.id === repo.head);
  
  // 新しいコミットの作成
  const newCommit = {
    id: generateCommitId(),
    message,
    timestamp: new Date().toISOString(),
    parent: currentCommit.id
  };
  
  // リポジトリの更新
  repo.commits.push(newCommit);
  repo.head = newCommit.id;
  
  // 現在のブランチの更新
  const currentBranch = repo.branches.find(branch => 
    repo.commits.find(commit => commit.id === branch.commitId)?.id === currentCommit.id
  );
  
  if (currentBranch) {
    currentBranch.commitId = newCommit.id;
  }
  
  result.success = true;
  result.message = `[${currentBranch?.name || 'detached HEAD'} ${newCommit.id.substring(0, 7)}] ${message}`;
  result.repository = repo;
  
  return result;
}

// git branch コマンド
function gitBranch(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 引数がない場合はブランチ一覧を表示
  if (args.length === 0) {
    const currentBranch = repo.branches.find(branch => branch.commitId === repo.head);
    
    const branchList = repo.branches.map(branch => 
      `${branch.name === currentBranch?.name ? '* ' : '  '}${branch.name}`
    ).join('\n');
    
    result.success = true;
    result.message = branchList || 'No branches exist yet.';
    return result;
  }
  
  // 新しいブランチの作成
  const branchName = args[0];
  
  // 既存のブランチ名との重複チェック
  if (repo.branches.some(branch => branch.name === branchName)) {
    result.message = `fatal: A branch named '${branchName}' already exists.`;
    return result;
  }
  
  // 新しいブランチの追加
  repo.branches.push({
    name: branchName,
    commitId: repo.head
  });
  
  result.success = true;
  result.message = `Created branch '${branchName}'.`;
  result.repository = repo;
  
  return result;
}

// git checkout コマンド
function gitCheckout(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 引数がない場合
  if (args.length === 0) {
    result.message = 'error: you must specify a branch name or commit id';
    return result;
  }
  
  const target = args[0];
  
  // ブランチへのチェックアウト
  const targetBranch = repo.branches.find(branch => branch.name === target);
  if (targetBranch) {
    repo.head = targetBranch.commitId;
    
    result.success = true;
    result.message = `Switched to branch '${target}'`;
    result.repository = repo;
    return result;
  }
  
  // コミットIDへのチェックアウト
  const targetCommit = repo.commits.find(commit => commit.id.startsWith(target));
  if (targetCommit) {
    repo.head = targetCommit.id;
    
    result.success = true;
    result.message = `Note: checking out '${target}'.\n\nYou are in 'detached HEAD' state.`;
    result.repository = repo;
    return result;
  }
  
  // 新しいブランチの作成とチェックアウト
  if (args.length > 1 && args[0] === '-b') {
    const newBranchName = args[1];
    
    // 既存のブランチ名との重複チェック
    if (repo.branches.some(branch => branch.name === newBranchName)) {
      result.message = `fatal: A branch named '${newBranchName}' already exists.`;
      return result;
    }
    
    // 新しいブランチの追加
    repo.branches.push({
      name: newBranchName,
      commitId: repo.head
    });
    
    result.success = true;
    result.message = `Switched to a new branch '${newBranchName}'`;
    result.repository = repo;
    return result;
  }
  
  result.message = `error: pathspec '${target}' did not match any file(s) known to git.`;
  return result;
}

// git status コマンド
function gitStatus(result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 現在のブランチを特定
  const currentBranch = repo.branches.find(branch => branch.commitId === repo.head);
  const branchName = currentBranch ? currentBranch.name : 'HEAD detached';
  
  result.success = true;
  result.message = `On branch ${branchName}\nNothing to commit, working tree clean`;
  return result;
}

// git log コマンド
function gitLog(result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // コミット履歴の表示
  let currentCommitId = repo.head;
  let logOutput = '';
  
  while (currentCommitId) {
    const commit = repo.commits.find(c => c.id === currentCommitId);
    if (!commit) break;
    
    const date = new Date(commit.timestamp).toLocaleString();
    
    logOutput += `commit ${commit.id}\n`;
    logOutput += `Date: ${date}\n\n`;
    logOutput += `    ${commit.message}\n\n`;
    
    currentCommitId = commit.parent;
  }
  
  result.success = true;
  result.message = logOutput || 'No commits yet.';
  return result;
}

// help コマンド
function showHelp(result) {
  result.success = true;
  result.message = `Available commands:
  git init                   - Initialize a new Git repository
  git commit -m <message>    - Create a new commit
  git branch [branch-name]   - List or create branches
  git checkout <branch-name> - Switch branches
  git checkout -b <branch-name> - Create and switch to a new branch
  git status                 - Show the working tree status
  git log                    - Show commit logs
  git help                   - Show Git help
  help                       - Show this help message
  clear                      - Clear the terminal`;
  return result;
}

// git help コマンド
function gitHelp(result) {
  result.success = true;
  result.message = `usage: git <command> [<args>]

These are common Git commands used in various situations:

start a working area
   init       Create an empty Git repository

work on the current change
   add        Add file contents to the index
   commit     Record changes to the repository

examine the history and state
   log        Show commit logs
   status     Show the working tree status

grow, mark and tweak your common history
   branch     List, create, or delete branches
   checkout   Switch branches or restore working tree files
   merge      Join two or more development histories together

'git help -a' and 'git help -g' list available subcommands and some
concept guides. See 'git help <command>' for more information on a specific command.`;
  return result;
}

// git merge コマンド（新規追加）
function gitMerge(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 引数がない場合
  if (args.length === 0) {
    result.message = 'error: you must specify a branch name to merge';
    return result;
  }
  
  const sourceBranchName = args[0];
  const sourceBranch = repo.branches.find(branch => branch.name === sourceBranchName);
  
  // 指定されたブランチが存在しない場合
  if (!sourceBranch) {
    result.message = `error: branch '${sourceBranchName}' not found.`;
    return result;
  }
  
  // 現在のブランチを特定
  const currentBranch = repo.branches.find(branch => branch.commitId === repo.head);
  
  // HEADがデタッチされている場合
  if (!currentBranch) {
    result.message = 'error: cannot merge into detached HEAD';
    return result;
  }
  
  // 同じブランチをマージしようとした場合
  if (currentBranch.name === sourceBranchName) {
    result.message = `Already up to date. '${sourceBranchName}' is already merged.`;
    return result;
  }
  
  // マージコミットの作成
  const sourceCommit = repo.commits.find(commit => commit.id === sourceBranch.commitId);
  const currentCommit = repo.commits.find(commit => commit.id === currentBranch.commitId);
  
  const mergeCommit = {
    id: generateCommitId(),
    message: `Merge branch '${sourceBranchName}' into ${currentBranch.name}`,
    timestamp: new Date().toISOString(),
    parent: currentCommit.id,
    secondParent: sourceCommit.id
  };
  
  // リポジトリの更新
  repo.commits.push(mergeCommit);
  repo.head = mergeCommit.id;
  currentBranch.commitId = mergeCommit.id;
  
  result.success = true;
  result.message = `Merge made by the 'recursive' strategy.\n${sourceBranchName} -> ${currentBranch.name}`;
  result.repository = repo;
  
  return result;
}

// git add コマンド（新規追加）
function gitAdd(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 引数がない場合
  if (args.length === 0) {
    result.message = 'Nothing specified, nothing added.';
    return result;
  }
  
  const path = args[0];
  
  // 全ファイルの追加（.）
  if (path === '.') {
    result.success = true;
    result.message = 'Added all changes to staging area.';
    return result;
  }
  
  result.success = true;
  result.message = `Added '${path}' to staging area.`;
  return result;
}

// git remote コマンド（新規追加）
function gitRemote(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 引数がない場合は登録済みリモートを表示
  if (args.length === 0) {
    result.success = true;
    result.message = 'No remotes configured.';
    return result;
  }
  
  // リモートの追加
  if (args[0] === 'add' && args.length >= 3) {
    const remoteName = args[1];
    const remoteUrl = args[2];
    
    result.success = true;
    result.message = `Added remote '${remoteName}' (${remoteUrl})`;
    return result;
  }
  
  result.message = 'usage: git remote add <name> <url>';
  return result;
}

// git pull コマンド（新規追加）
function gitPull(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 引数が足りない場合
  if (args.length < 2) {
    result.message = 'usage: git pull <remote> <branch>';
    return result;
  }
  
  const remoteName = args[0];
  const branchName = args[1];
  
  result.success = true;
  result.message = `Pulled changes from ${remoteName}/${branchName}.\nAlready up to date.`;
  return result;
}

// git push コマンド（新規追加）
function gitPush(args, result) {
  const repo = result.repository;
  
  // リポジトリが初期化されていない場合
  if (repo.commits.length === 0) {
    result.message = 'fatal: not a git repository (or any of the parent directories): .git';
    return result;
  }
  
  // 引数が足りない場合
  if (args.length < 2) {
    result.message = 'usage: git push <remote> <branch>';
    return result;
  }
  
  const remoteName = args[0];
  const branchName = args[1];
  
  result.success = true;
  result.message = `Pushed changes to ${remoteName}/${branchName}.\nEverything up-to-date.`;
  return result;
}

// ユニークなコミットIDの生成
function generateCommitId() {
  return Math.random().toString(36).substring(2, 10) + 
         Math.random().toString(36).substring(2, 10);
}

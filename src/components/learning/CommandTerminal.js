import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/CommandTerminal.module.css';

export default function CommandTerminal({ onCommandExecute, commandHistory = [] }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(commandHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // ターミナルを常に最下部にスクロール
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // 入力フォーカス維持
  useEffect(() => {
    const handleClick = () => {
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

    // 親コンポーネントにコマンド実行を通知
    if (onCommandExecute) {
      const result = onCommandExecute(input);
      
      // 結果を履歴に追加
      if (result) {
        setHistory(prev => [...prev, { type: 'output', content: result }]);
      }
    }

    // 入力をクリア
    setInput('');
    setHistoryIndex(-1);
  };

  // キー入力処理
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand();
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
    }
  };

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      <div className={styles.header}>
        <div className={styles.buttons}>
          <span className={styles.button}></span>
          <span className={styles.button}></span>
          <span className={styles.button}></span>
        </div>
        <div className={styles.title}>Git Terminal</div>
      </div>
      
      <div className={styles.content} ref={terminalRef}>
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
              <span>{item.content}</span>
            )}
          </div>
        ))}
        
        <div className={styles.inputLine}>
          <span className={styles.prompt}>$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.inputField}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

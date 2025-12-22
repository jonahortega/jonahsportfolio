import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Loading.css';

const Loading = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);

  const codeLines = [
    '> INITIALIZING SYSTEM...',
    '> LOADING USER PROFILE: JONAH_ORTEGA',
    '> CONNECTING TO NETWORK...',
    '> VERIFYING CREDENTIALS...',
    '> LOADING PORTFOLIO DATA...',
    '> RENDERING INTERFACE...',
    '> SYSTEM READY',
    '',
    '> システム起動中...',
    '> ユーザープロファイル読み込み中...',
    '> ネットワーク接続中...',
    '> 認証確認中...',
    '> ポートフォリオデータ読み込み中...',
    '> インターフェース描画中...',
    '> システム準備完了',
  ];

  useEffect(() => {
    let lineIndex = 0;
    const lineInterval = setInterval(() => {
      if (lineIndex < codeLines.length) {
        setLines((prev) => [...prev, codeLines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(lineInterval);
      }
    }, 150);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-button red"></span>
            <span className="terminal-button yellow"></span>
            <span className="terminal-button green"></span>
          </div>
          <div className="terminal-title">TERMINAL - JONAH_ORTEGA.exe</div>
        </div>
        
        <div className="terminal-body">
          <div className="code-lines">
            {lines.map((line, index) => (
              <motion.div
                key={index}
                className="code-line"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="line-number">{String(index + 1).padStart(3, '0')}</span>
                <span className="line-content">{line}</span>
                {index === lines.length - 1 && (
                  <motion.span
                    className="cursor"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    █
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="progress-section">
            <div className="progress-label">
              <span className="progress-text">LOADING: {progress}%</span>
              <span className="progress-japanese">読み込み中: {progress}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              >
                <div className="progress-glow"></div>
              </motion.div>
              <div className="progress-percentage">{progress}%</div>
            </div>
          </div>

          <div className="status-line">
            <span className="status-text">STATUS: INITIALIZING</span>
            <span className="status-japanese">状態: 初期化中</span>
          </div>
        </div>

        <div className="scan-lines"></div>
        <div className="glitch-overlay"></div>
      </div>
    </motion.div>
  );
};

export default Loading;


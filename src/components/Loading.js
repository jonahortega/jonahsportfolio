import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Loading.css';

const texts = [
  "If code can simulate intelligence, what has always powered life itself? Perhaps God is the source code—abstract, unseen, yet embedded in everything that runs. Is God consciousness, or the logic beneath it? Is life a machine, or a system learning itself over time? Human beings aren't machines, but living systems: adapting, breaking, rebuilding, and evolving through feedback and choice. We move through patterns, rules, and instincts—yet still create meaning where none is guaranteed.",
  "Life may not be programmable, but it is iterable, shaped by decisions, curiosity, and the courage to question who, or what, wrote the first line. If existence is written, then living becomes an act of editing: challenging the logic, breaking the loops, and deciding what remains."
];

const Loading = ({ onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const charIndexRef = useRef(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTyping = (textIndex) => {
      const text = texts[textIndex];
      charIndexRef.current = 0;
      setDisplayedText('');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (charIndexRef.current < text.length) {
          setDisplayedText(text.slice(0, charIndexRef.current + 1));
          charIndexRef.current++;
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          
          if (textIndex === 0) {
            // After first text, wait 5 seconds, then instantly clear and start second text
            timeoutRef.current = setTimeout(() => {
              setDisplayedText(''); // Instantly clear
              // Start typing second text immediately
              startTyping(1);
            }, 5000);
          } else {
            // After second text, wait 10 seconds then complete
            timeoutRef.current = setTimeout(() => {
              onCompleteRef.current();
            }, 10000);
          }
        }
      }, 30);
    };

    // Start typing first text
    startTyping(0);

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // Empty dependency array - only run once on mount

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleContinue = () => {
    // Clear all intervals and timeouts
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Go straight to Jeremiah page
    onCompleteRef.current();
  };

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
          <div className="typing-text-container">
            <div className="typing-text">
              {displayedText}
              {showCursor && <span className="typing-cursor">█</span>}
            </div>
          </div>

          <div className="scan-lines"></div>
          <div className="glitch-overlay"></div>
        </div>
        
        <motion.button
          className="continue-button"
          onClick={handleContinue}
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          CONTINUE →
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Loading;

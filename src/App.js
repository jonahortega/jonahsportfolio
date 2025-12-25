import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Apps from './components/Apps';
import Jeremiah from './components/Jeremiah';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import SpaceBackground from './components/SpaceBackground';
import Loading from './components/Loading';
import { FaArrowLeft } from 'react-icons/fa';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('jeremiah');

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('apps');
  };

  return (
    <div className="App">
      <AnimatePresence>
        {isLoading && <Loading onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      {!isLoading && (
        <>
          <SpaceBackground />
          {(currentView === 'apps' || currentView === 'contact') && <Navigation onViewChange={handleViewChange} currentView={currentView} />}
          
          {/* Back Button - show when viewing app pages (not apps or jeremiah) */}
          {currentView !== 'apps' && currentView !== 'jeremiah' && (
            <motion.button
              className="back-button"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              onClick={handleBack}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft />
              <span>BACK</span>
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            {currentView === 'apps' && (
              <motion.div
                key="apps"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Apps onViewChange={handleViewChange} />
              </motion.div>
            )}
            
            {currentView === 'jeremiah' && (
              <motion.div
                key="jeremiah"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Jeremiah onViewChange={handleViewChange} />
              </motion.div>
            )}
            
            {currentView === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Projects />
              </motion.div>
            )}
            
            {currentView === 'organizations' && (
              <motion.div
                key="organizations"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Experience />
              </motion.div>
            )}
            
            {currentView === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Contact />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      <Analytics />
    </div>
  );
}

export default App;


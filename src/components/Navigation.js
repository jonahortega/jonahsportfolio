import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import './Navigation.css';

const Navigation = ({ onViewChange, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'apps', label: 'Apps', action: () => onViewChange && onViewChange('apps') },
    { id: 'contact', label: 'Contact', action: () => onViewChange && onViewChange('contact') },
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    }
  };

  return (
    <motion.nav
      className={`navigation ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <div className="nav-logo">
          {currentView !== 'apps' && (
            <img 
              src="/profile.jpg" 
              alt="Jonah Ortega" 
              className="nav-profile-image"
              onClick={(e) => {
                e.stopPropagation();
                setImageModalOpen(true);
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <span className="logo-text" onClick={() => onViewChange && onViewChange('apps')}>
            {currentView === 'apps' ? "Jonah's Portfolio" : 'JO'}
          </span>
        </div>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className="nav-link"
                onClick={() => handleNavClick(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModalOpen && (
          <motion.div
            className="image-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImageModalOpen(false)}
          >
            <motion.div
              className="image-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="image-modal-close"
                onClick={() => setImageModalOpen(false)}
              >
                <FaTimes />
              </button>
              <img 
                src="/profile.jpg" 
                alt="Jonah Ortega" 
                className="modal-profile-image"
                onError={(e) => {
              e.target.style.display = 'none';
            }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;


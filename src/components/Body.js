import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaTimes } from 'react-icons/fa';
import './Body.css';

const Body = () => {
  const [headMenuOpen, setHeadMenuOpen] = useState(false);
  const [handsMenuOpen, setHandsMenuOpen] = useState(false);

  const handleHeadClick = () => {
    setHeadMenuOpen(true);
    setHandsMenuOpen(false);
  };

  const handleHandsClick = () => {
    setHandsMenuOpen(true);
    setHeadMenuOpen(false);
  };

  const closeMenus = () => {
    setHeadMenuOpen(false);
    setHandsMenuOpen(false);
  };

  return (
    <section id="body" className="body-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Body
        </motion.h2>

        <div className="skeleton-container">
          {/* Reference image overlay for positioning */}
          <img 
            src="/skeleton-reference.png" 
            alt="Skeleton Reference" 
            className="skeleton-reference"
            style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
          />
          
          <svg
            className="skeleton-svg"
            viewBox="0 0 400 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* SKULL - Detailed and realistic */}
            <motion.g
              className="skeleton-part head-group"
              onClick={handleHeadClick}
              whileHover={{ scale: 1.05 }}
            >
              {/* Cranium */}
              <ellipse cx="200" cy="90" rx="55" ry="65" className="skeleton-bone skull-cranium" />
              
              {/* Eye sockets */}
              <ellipse cx="185" cy="85" rx="12" ry="15" className="skeleton-hole eye-socket" />
              <ellipse cx="215" cy="85" rx="12" ry="15" className="skeleton-hole eye-socket" />
              
              {/* Nasal cavity */}
              <path d="M 195 100 Q 200 115 205 100" className="skeleton-hole nasal-cavity" strokeLinecap="round" />
              
              {/* Maxilla (upper jaw) */}
              <path d="M 160 130 Q 180 140 200 142 Q 220 140 240 130" className="skeleton-bone maxilla" />
              
              {/* Mandible (lower jaw) */}
              <path d="M 160 130 Q 170 150 180 155 Q 200 158 220 155 Q 230 150 240 130" className="skeleton-bone mandible" />
              
              {/* Teeth - upper */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <line
                  key={`upper-${i}`}
                  x1={165 + i * 2.5}
                  y1="135"
                  x2={165 + i * 2.5}
                  y2="140"
                  className="skeleton-detail tooth"
                />
              ))}
              
              {/* Teeth - lower */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <line
                  key={`lower-${i}`}
                  x1={165 + i * 2.5}
                  y1="150"
                  x2={165 + i * 2.5}
                  y2="155"
                  className="skeleton-detail tooth"
                />
              ))}
            </motion.g>

            {/* CERVICAL VERTEBRAE (Neck) */}
            <g className="cervical-spine">
              {Array.from({ length: 7 }).map((_, i) => (
                <rect
                  key={i}
                  x="195"
                  y={155 + i * 6}
                  width="10"
                  height="5"
                  className="skeleton-bone vertebra cervical"
                  rx="2"
                />
              ))}
            </g>

            {/* THORACIC VERTEBRAE & RIBS */}
            <g className="thoracic-section">
              {/* Thoracic vertebrae */}
              {Array.from({ length: 12 }).map((_, i) => (
                <rect
                  key={i}
                  x="195"
                  y={197 + i * 10}
                  width="10"
                  height="8"
                  className="skeleton-bone vertebra thoracic"
                  rx="2"
                />
              ))}
              
              {/* Ribs - Left side */}
              {Array.from({ length: 12 }).map((_, i) => {
                const y = 200 + i * 10;
                const curve = 20 + i * 3;
                return (
                  <path
                    key={`left-rib-${i}`}
                    d={`M 200 ${y} Q ${200 - curve} ${y + 8} ${200 - curve - 15} ${y + 15} Q ${200 - curve - 20} ${y + 20} ${200 - curve - 15} ${y + 25}`}
                    className="skeleton-bone rib left-rib"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
              
              {/* Ribs - Right side */}
              {Array.from({ length: 12 }).map((_, i) => {
                const y = 200 + i * 10;
                const curve = 20 + i * 3;
                return (
                  <path
                    key={`right-rib-${i}`}
                    d={`M 200 ${y} Q ${200 + curve} ${y + 8} ${200 + curve + 15} ${y + 15} Q ${200 + curve + 20} ${y + 20} ${200 + curve + 15} ${y + 25}`}
                    className="skeleton-bone rib right-rib"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* LUMBAR VERTEBRAE */}
            <g className="lumbar-spine">
              {Array.from({ length: 5 }).map((_, i) => (
                <rect
                  key={i}
                  x="195"
                  y={317 + i * 12}
                  width="10"
                  height="10"
                  className="skeleton-bone vertebra lumbar"
                  rx="2"
                />
              ))}
            </g>

            {/* PELVIS */}
            <g className="pelvis-group">
              {/* Ilium */}
              <path
                d="M 180 377 Q 160 390 155 410 Q 155 430 165 440 Q 175 445 180 440"
                className="skeleton-bone ilium"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 220 377 Q 240 390 245 410 Q 245 430 235 440 Q 225 445 220 440"
                className="skeleton-bone ilium"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Pubis */}
              <path
                d="M 180 440 Q 190 450 200 452 Q 210 450 220 440"
                className="skeleton-bone pubis"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Ischium */}
              <path
                d="M 180 440 Q 175 460 180 470"
                className="skeleton-bone ischium"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 220 440 Q 225 460 220 470"
                className="skeleton-bone ischium"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* LEFT ARM - Complete anatomy */}
            <motion.g
              className="skeleton-part arm-group left-arm"
              onClick={handleHandsClick}
              whileHover={{ scale: 1.02 }}
            >
              {/* Clavicle */}
              <line x1="200" y1="180" x2="140" y2="190" className="skeleton-bone clavicle" strokeWidth="3" />
              
              {/* Scapula */}
              <path
                d="M 140 190 Q 120 200 110 220 Q 105 240 110 260 Q 115 275 125 280"
                className="skeleton-bone scapula"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Humerus */}
              <path d="M 125 280 L 100 420" className="skeleton-bone humerus" strokeWidth="5" strokeLinecap="round" />
              
              {/* Radius */}
              <path d="M 100 420 L 85 550" className="skeleton-bone radius" strokeWidth="4" strokeLinecap="round" />
              
              {/* Ulna */}
              <path d="M 105 420 L 95 550" className="skeleton-bone ulna" strokeWidth="4" strokeLinecap="round" />
              
              {/* Hand bones */}
              <motion.g className="hand-group" whileHover={{ scale: 1.15 }}>
                {/* Carpals */}
                <circle cx="90" cy="560" r="12" className="skeleton-bone carpal" />
                
                {/* Metacarpals */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`left-meta-${i}`}
                    x1={80 + i * 5}
                    y1="560"
                    x2={75 + i * 5}
                    y2="600"
                    className="skeleton-bone metacarpal"
                    strokeWidth="2.5"
                  />
                ))}
                
                {/* Proximal phalanges */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`left-prox-${i}`}
                    x1={75 + i * 5}
                    y1="600"
                    x2={73 + i * 5}
                    y2="620"
                    className="skeleton-bone phalanx"
                    strokeWidth="2"
                  />
                ))}
                
                {/* Middle phalanges (fingers 2-4) */}
                {[1, 2, 3].map((i) => (
                  <line
                    key={`left-mid-${i}`}
                    x1={73 + i * 5}
                    y1="620"
                    x2={72 + i * 5}
                    y2="635"
                    className="skeleton-bone phalanx"
                    strokeWidth="1.5"
                  />
                ))}
                
                {/* Distal phalanges */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`left-dist-${i}`}
                    x1={i === 0 ? 73 : 72 + (i - 1) * 5}
                    y1={i === 0 ? 620 : 635}
                    x2={i === 0 ? 72 : 71 + (i - 1) * 5}
                    y2={i === 0 ? 640 : 650}
                    className="skeleton-bone phalanx"
                    strokeWidth="1.5"
                  />
                ))}
              </motion.g>
            </motion.g>

            {/* RIGHT ARM - Complete anatomy */}
            <motion.g
              className="skeleton-part arm-group right-arm"
              onClick={handleHandsClick}
              whileHover={{ scale: 1.02 }}
            >
              {/* Clavicle */}
              <line x1="200" y1="180" x2="260" y2="190" className="skeleton-bone clavicle" strokeWidth="3" />
              
              {/* Scapula */}
              <path
                d="M 260 190 Q 280 200 290 220 Q 295 240 290 260 Q 285 275 275 280"
                className="skeleton-bone scapula"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Humerus */}
              <path d="M 275 280 L 300 420" className="skeleton-bone humerus" strokeWidth="5" strokeLinecap="round" />
              
              {/* Radius */}
              <path d="M 300 420 L 315 550" className="skeleton-bone radius" strokeWidth="4" strokeLinecap="round" />
              
              {/* Ulna */}
              <path d="M 295 420 L 305 550" className="skeleton-bone ulna" strokeWidth="4" strokeLinecap="round" />
              
              {/* Hand bones */}
              <motion.g className="hand-group" whileHover={{ scale: 1.15 }}>
                {/* Carpals */}
                <circle cx="310" cy="560" r="12" className="skeleton-bone carpal" />
                
                {/* Metacarpals */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`right-meta-${i}`}
                    x1={320 - i * 5}
                    y1="560"
                    x2={325 - i * 5}
                    y2="600"
                    className="skeleton-bone metacarpal"
                    strokeWidth="2.5"
                  />
                ))}
                
                {/* Proximal phalanges */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`right-prox-${i}`}
                    x1={325 - i * 5}
                    y1="600"
                    x2={327 - i * 5}
                    y2="620"
                    className="skeleton-bone phalanx"
                    strokeWidth="2"
                  />
                ))}
                
                {/* Middle phalanges (fingers 2-4) */}
                {[1, 2, 3].map((i) => (
                  <line
                    key={`right-mid-${i}`}
                    x1={327 - i * 5}
                    y1="620"
                    x2={328 - i * 5}
                    y2="635"
                    className="skeleton-bone phalanx"
                    strokeWidth="1.5"
                  />
                ))}
                
                {/* Distal phalanges */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`right-dist-${i}`}
                    x1={i === 0 ? 327 : 328 - (i - 1) * 5}
                    y1={i === 0 ? 620 : 635}
                    x2={i === 0 ? 328 : 329 - (i - 1) * 5}
                    y2={i === 0 ? 640 : 650}
                    className="skeleton-bone phalanx"
                    strokeWidth="1.5"
                  />
                ))}
              </motion.g>
            </motion.g>

            {/* LEFT LEG - Complete anatomy */}
            <g className="leg-group left-leg">
              {/* Femur */}
              <path d="M 190 470 L 175 650" className="skeleton-bone femur" strokeWidth="6" strokeLinecap="round" />
              
              {/* Patella */}
              <ellipse cx="175" cy="650" rx="10" ry="15" className="skeleton-bone patella" />
              
              {/* Tibia */}
              <path d="M 175 665 L 170 780" className="skeleton-bone tibia" strokeWidth="5" strokeLinecap="round" />
              
              {/* Fibula */}
              <path d="M 180 665 L 185 780" className="skeleton-bone fibula" strokeWidth="3" strokeLinecap="round" />
              
              {/* Foot */}
              <ellipse cx="165" cy="790" rx="30" ry="18" className="skeleton-bone foot" />
              
              {/* Toes */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`left-toe-${i}`}
                  x1={145 + i * 5}
                  y1="790"
                  x2={140 + i * 5}
                  y2="810"
                  className="skeleton-bone toe"
                  strokeWidth="2"
                />
              ))}
            </g>

            {/* RIGHT LEG - Complete anatomy */}
            <g className="leg-group right-leg">
              {/* Femur */}
              <path d="M 210 470 L 225 650" className="skeleton-bone femur" strokeWidth="6" strokeLinecap="round" />
              
              {/* Patella */}
              <ellipse cx="225" cy="650" rx="10" ry="15" className="skeleton-bone patella" />
              
              {/* Tibia */}
              <path d="M 225 665 L 230 780" className="skeleton-bone tibia" strokeWidth="5" strokeLinecap="round" />
              
              {/* Fibula */}
              <path d="M 220 665 L 215 780" className="skeleton-bone fibula" strokeWidth="3" strokeLinecap="round" />
              
              {/* Foot */}
              <ellipse cx="235" cy="790" rx="30" ry="18" className="skeleton-bone foot" />
              
              {/* Toes */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`right-toe-${i}`}
                  x1={255 - i * 5}
                  y1="790"
                  x2={260 - i * 5}
                  y2="810"
                  className="skeleton-bone toe"
                  strokeWidth="2"
                />
              ))}
            </g>

            {/* JOINTS - All major joints with cyberpunk glow */}
            <circle cx="200" cy="180" r="8" className="skeleton-joint cyberpunk-joint" />
            <circle cx="125" cy="280" r="10" className="skeleton-joint cyberpunk-joint" />
            <circle cx="100" cy="420" r="8" className="skeleton-joint cyberpunk-joint" />
            <circle cx="275" cy="280" r="10" className="skeleton-joint cyberpunk-joint" />
            <circle cx="300" cy="420" r="8" className="skeleton-joint cyberpunk-joint" />
            <circle cx="190" cy="470" r="10" className="skeleton-joint cyberpunk-joint" />
            <circle cx="175" cy="650" r="8" className="skeleton-joint cyberpunk-joint" />
            <circle cx="210" cy="470" r="10" className="skeleton-joint cyberpunk-joint" />
            <circle cx="225" cy="650" r="8" className="skeleton-joint cyberpunk-joint" />
          </svg>

          {/* Head Menu Overlay */}
          <AnimatePresence>
            {headMenuOpen && (
              <motion.div
                className="menu-overlay head-menu"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <button className="close-button" onClick={closeMenus}>
                  <FaTimes />
                </button>
                <h3 className="menu-title">CONNECT</h3>
                <div className="menu-options">
                  <motion.a
                    href="https://www.linkedin.com/in/jonah-ortega"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-option"
                    whileHover={{ scale: 1.1, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLinkedin className="menu-icon" />
                    <span>LinkedIn</span>
                  </motion.a>
                  <motion.a
                    href="https://github.com/jonahortega"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-option"
                    whileHover={{ scale: 1.1, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGithub className="menu-icon" />
                    <span>GitHub</span>
                  </motion.a>
                  <motion.a
                    href="mailto:jonahortega7@me.com"
                    className="menu-option"
                    whileHover={{ scale: 1.1, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEnvelope className="menu-icon" />
                    <span>Email</span>
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hands Menu Overlay */}
          <AnimatePresence>
            {handsMenuOpen && (
              <motion.div
                className="menu-overlay hands-menu"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <button className="close-button" onClick={closeMenus}>
                  <FaTimes />
                </button>
                <h3 className="menu-title">PROJECTS</h3>
                <div className="menu-options">
                  <motion.div
                    className="menu-option"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const element = document.getElementById('projects');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        closeMenus();
                      }
                    }}
                  >
                    <span className="menu-text">View All Projects</span>
                  </motion.div>
                  <motion.div
                    className="menu-option"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="menu-text">Greek Life App</span>
                  </motion.div>
                  <motion.div
                    className="menu-option"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="menu-text">AUP Portal</span>
                  </motion.div>
                  <motion.div
                    className="menu-option"
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="menu-text">AI Analysis</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Body;

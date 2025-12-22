import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaProjectDiagram, FaUser } from 'react-icons/fa';
import './Apps.css';

const Apps = ({ onViewChange }) => {
  const apps = [
    {
      id: 'github',
      name: 'GitHub',
      icon: FaGithub,
      color: '#00ff00',
      url: 'https://github.com/jonahortega',
      description: 'View my code repositories',
      external: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: '#00ff88',
      url: 'https://www.linkedin.com/in/jonah-ortega',
      description: 'Connect on LinkedIn',
      external: true
    },
    {
      id: 'email',
      name: 'Email',
      icon: FaEnvelope,
      color: '#00ff00',
      url: 'mailto:jonahortega7@me.com',
      description: 'Send me an email',
      external: true
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: FaProjectDiagram,
      color: '#00ff88',
      description: 'View my projects',
      view: 'projects'
    },
    {
      id: 'organizations',
      name: 'Organizations',
      icon: FaUser,
      color: '#00ff00',
      description: 'My organizations',
      view: 'organizations'
    },
  ];

  const handleAppClick = (app) => {
    if (app.external) {
      if (app.url && app.url.startsWith('http')) {
        window.open(app.url, '_blank', 'noopener,noreferrer');
      } else if (app.url && app.url.startsWith('mailto')) {
        window.location.href = app.url;
      }
    } else if (app.view && onViewChange) {
      onViewChange(app.view);
    }
  };

  return (
    <section id="apps" className="apps-section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          I BUILD COOL SHIT
        </motion.h2>

        <div className="apps-grid">
          {apps.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.id}
                className="app-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAppClick(app)}
              >
                <div className="app-icon-wrapper" style={{ '--app-color': app.color }}>
                  <Icon className="app-icon" />
                </div>
                <div className="app-name">{app.name}</div>
                <div className="app-description">{app.description}</div>
                <div className="app-indicator">></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Apps;


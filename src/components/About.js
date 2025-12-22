import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          About Me
        </motion.h2>
        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="about-intro">
              I'm an independent builder with experience taking ideas from concept to execution. I focus on hands-on development, learning by doing, and building products outside of coursework.
            </p>
            <p>
              I've founded both a startup project (Greek Life LLC) and the Artificial Intelligence Club at the American University of Paris, leading development and organizing applied discussions around emerging technology.
            </p>
          </motion.div>
          <motion.div
            className="about-stats"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="stat-card">
              <div className="stat-number">2027</div>
              <div className="stat-label">Graduation Year</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3+</div>
              <div className="stat-label">Major Projects</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2</div>
              <div className="stat-label">Organizations Founded</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;


import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'Greek Life Mobile App',
      description: 'Co-founded and built a multi-campus social platform for fraternities, sororities, and clubs. Implemented authentication, map-based discovery, QR ticketing, file storage, and payments. Developed full UI/UX system and coordinated launch strategy for Fall 2026.',
      technologies: ['React Native', 'Supabase', 'Stripe', 'Mapbox'],
      github: 'https://github.com/jonahortega',
      demo: 'https://example.com',
      image: '/greek-life-app.png'
    },
    {
      title: 'AUP Student Portal Redesign',
      description: 'Built an improved version of American University of Paris\'s student portal for class registration and degree tracking. Designed a more efficient, intuitive interface for course searches and schedule building.',
      technologies: ['React', 'JavaScript', 'HTML5', 'CSS3'],
      github: 'https://github.com/AUP-student-portal',
      demo: 'https://example.com',
      image: '/aup-portal.png'
    },
    {
      title: 'AI & Future Jobs Analysis',
      description: 'Analyzed Bureau of Labor Statistics data to model 10-year AI-driven labor trends. Visualized patterns for a 5,000-word APA research paper exploring the impact of artificial intelligence on future employment.',
      technologies: ['Data Analysis', 'Visualization'],
      github: 'https://github.com/jonahortega',
      demo: 'https://example.com',
      image: '/project3.jpg'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Projects
        </motion.h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="project-image">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="project-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="project-placeholder" style={{ display: 'none' }}>
                  <FaCode className="placeholder-icon" />
                  <span>Project Image</span>
                </div>
                <div className="project-overlay">
                  <div className="project-links">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      aria-label="GitHub"
                    >
                      <FaGithub />
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      aria-label="Live Demo"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;


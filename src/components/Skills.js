import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, FaJs, FaPython, FaNode, FaHtml5, FaCss3Alt, 
  FaGitAlt, FaAws, FaDocker, FaDatabase, FaCode
} from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiPostgresql, SiRedis } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: [
        { name: 'Python', icon: FaPython, level: 90 },
        { name: 'Java', icon: FaJs, level: 90 },
        { name: 'SQL', icon: FaDatabase, level: 80 },
        { name: 'C', icon: FaCode, level: 75 }
      ]
    },
    {
      title: 'Frontend & Mobile',
      skills: [
        { name: 'React', icon: FaReact, level: 85 },
        { name: 'React Native', icon: FaReact, level: 85 },
        { name: 'JavaScript', icon: FaJs, level: 85 },
        { name: 'HTML5', icon: FaHtml5, level: 90 },
        { name: 'CSS3', icon: FaCss3Alt, level: 90 }
      ]
    },
    {
      title: 'Tools & Technologies',
      skills: [
        { name: 'Supabase', icon: FaDatabase, level: 80 },
        { name: 'Stripe', icon: FaCode, level: 75 },
        { name: 'Mapbox', icon: FaCode, level: 75 },
        { name: 'Git', icon: FaGitAlt, level: 85 }
      ]
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Skills
        </motion.h2>
        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="skill-category"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            >
              <h3 className="category-title">{category.title}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      className="skill-item"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <div className="skill-icon">
                        <Icon />
                      </div>
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <div className="skill-bar">
                          <motion.div
                            className="skill-progress"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                          ></motion.div>
                        </div>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;


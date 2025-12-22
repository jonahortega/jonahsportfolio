import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Experience.css';

const Experience = () => {
  const organizations = [
    {
      title: 'Founder',
      organization: 'Artificial Intelligence Club',
      location: 'Paris, France',
      period: 'Dec 2025 – Present',
      description: 'Founded and lead AUP\'s first AI-focused student organization alongside Professor Georgi Stojanov, hosting weekly panel discussions and debates on the future of artificial intelligence, ethical implications, emerging technologies, and real-world applications.',
      achievements: [
        'Organized student-driven analysis sessions and coordinated interdisciplinary participation',
        'Developed a curriculum of guided debates and technical workshops',
        'Fostered critical thinking, research skills, and awareness of global AI trends'
      ]
    },
    {
      title: 'Founder',
      organization: 'Greek Life LLC',
      location: 'Remote/Paris, FR',
      period: 'Sep 2024 – Present',
      description: 'Leading full development of a campus engagement mobile app using React Native, Supabase, Stripe, and Mapbox. Building a multi-campus social platform for fraternities, sororities, and clubs.',
      achievements: [
        'Built 20+ interactive screens (auth flows, campus, maps, event feeds, user profiles, ticketing)',
        'Designed UI/UX systems, dynamic maps, and real-time event discovery',
        'Coordinating engineering recruitment, product roadmap, and Fall 2026 launch strategy'
      ]
    },
    {
      title: 'Player',
      organization: 'Futsal Club',
      location: 'Paris, France',
      period: 'Dec 2025 – Present',
      description: 'Key contributor to AUP\'s competitive futsal team, leading the league in goals and helping secure the first league championship title in university history.',
      achievements: [
        'Led the league in goals scored',
        'Helped secure the first league championship title in university history',
        'Contributed to team success through consistent performance and dedication'
      ]
    },
    {
      title: 'Community Service Member',
      organization: 'Impact Club',
      location: 'Paris, France',
      period: 'Dec 2025 – Present',
      description: 'Participated in organized volunteer initiatives across Paris, including neighborhood clean-ups, food distribution, and student-led outreach projects.',
      achievements: [
        'Collaborated with multicultural teams to support local communities',
        'Strengthened social responsibility on campus',
        'Contributed to AUP\'s civic engagement efforts'
      ]
    }
  ];

  return (
    <section id="experience" className="experience">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Organizations
        </motion.h2>
        <div className="timeline">
          {organizations.map((org, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="experience-header">
                  <h3 className="experience-title">
                    <FaUsers className="icon" />
                    {org.title}
                  </h3>
                  <h4 className="experience-company">{org.organization}</h4>
                </div>
                <div className="experience-meta">
                  <span className="experience-period">
                    <FaCalendarAlt className="icon" />
                    {org.period}
                  </span>
                  <span className="experience-location">
                    <FaMapMarkerAlt className="icon" />
                    {org.location}
                  </span>
                </div>
                <p className="experience-description">{org.description}</p>
                <ul className="experience-achievements">
                  {org.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;


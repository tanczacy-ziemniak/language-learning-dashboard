import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import topics from '../data/topics';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link to="/">LanguageQuest</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink 
              to="/" 
              end 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              Dashboard
            </NavLink>
          </li>
          {topics.map(topic => (
            <li key={topic.id}>
              <NavLink 
                to={`/topics/${topic.id}`} 
                className={({ isActive }) => isActive ? styles.active : ''}
              >
                <span className={styles.icon}>{topic.icon}</span>
                {topic.title}
              </NavLink>
            </li>
          ))}
          <li className={styles.managerLink}>
            <NavLink 
              to="/content-manager" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <span className={styles.icon}>✏️</span>
              Polish Content Manager
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.footer}>
        <p>© {new Date().getFullYear()} LanguageQuest</p>
      </div>
    </aside>
  );
};

export default Sidebar;

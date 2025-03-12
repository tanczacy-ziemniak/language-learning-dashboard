import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import creatorGif from './dancing-potato.gif';


const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link to="/">Polish Learning🥔</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink 
              to="/" 
              end 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <span className={styles.icon}>🥔</span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/words" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <span className={styles.icon}>📚</span>
              Words
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/expressions" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <span className={styles.icon}>💬</span>
              Expressions
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/notes" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <span className={styles.icon}>📝</span>
              Notes
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/quiz" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <span className={styles.icon}>🧠</span>
              Quiz
            </NavLink>
          </li>
          <li className={styles.managerLink}>
            <NavLink 
              to="/content-manager" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              <span className={styles.icon}>✏️</span>
              Add Contents
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.footer}>
        <div className={styles.creator}>
          <img 
            src={creatorGif} 
            alt="Creator animation" 
            className={styles.creatorGif}
          />
        </div>
        <p>© {new Date().getFullYear()} tanczacy_ziemniak</p>
      </div>
    </aside>
  );
};

export default Sidebar;

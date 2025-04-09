import React from 'react';
import styles from './footerFront.module.css';
import { Link } from 'react-router-dom';

function FooterFront() {
  return (
    <div className={styles.outerMain}>
      <p className={styles.text}>© Copyrights owned by UK EZHAVA MATRIMONY</p>
      <Link className={styles.subText} to="https://scipytechnologies.com" target="_blank" rel="noopener noreferrer">
        Developed by Scipy Technologies
      </Link>    </div>
  );
}

export default FooterFront;

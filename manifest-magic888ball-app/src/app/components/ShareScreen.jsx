import React from 'react';
import Image from 'next/image';
import styles from './ShareScreen.module.css';
import Button from './Button';
import EightBall from './EightBall';

const ShareScreen = ({ message, onNavigate }) => {
  return (
    <div id="shareScreen" className={styles.starryBackground}>
      <div className={styles.dogBanner}>YOUR SIGN FROM THE UNIVERSE</div>
      <div className={styles.eightBallContainer}>
        <EightBall message={message} isShaking={false} showAfterShake={true} /> {/* Use EightBall component */}

      </div>
      {/* <p className={styles.message}>{message}</p> */}
      <button 
      className={styles.linkButton} 
      onClick={onNavigate}
      type="button"
    >MAGIC888.MANIFESTAPP.XYZ</button>
    </div>
  );
};

export default ShareScreen;
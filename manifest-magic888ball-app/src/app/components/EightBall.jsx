import React from 'react';
import Image from 'next/image';
import styles from './EightBall.module.css';

const EightBall = ({ message, isShaking, showAfterShake }) => {
  return (
    <div className={`${styles.ballContainer} ${isShaking ? styles.shakeAnimation : ''}`}>
      <div className={styles.ballImageContainer}>
        <Image 
          src="/8ball.png" 
          alt="8-Ball" 
          width={500} 
          height={500} 
          unoptimized
          priority 
          className={styles.ballImage}
        />
        
        <div className={styles.ballWindow}>
          {showAfterShake ? (
            <>
              <Image 
                src="/after-shake.png" 
                alt="Final shake response" 
                fill 
                priority 
                className={styles.afterShakeBackground} 
              />
              <div className={styles.responseOverlay}>
                <p className={styles.response}>{message}</p>
              </div>
            </>
          ) : (
            <p className={styles.response}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EightBall;
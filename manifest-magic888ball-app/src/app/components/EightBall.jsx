import React from 'react';
import Image from 'next/image';
import styles from './EightBall.module.css';

const EightBall = ({ message, isShaking, showAfterShake }) => {
  return (
    <div className={styles.container}>
      {/* Starry Sky Background */}
      <div className={styles.starryBackground}>
      <img src="/space-background.png" alt="Starry sky background" className={styles.fullBackgroundImage} />

      </div>
      <div className="flex flex-col items-center relative z-10">
        <div className={styles.pinkContainer}>
          <div className={styles.titleContainer}>
            <h1 className={styles.shakeText}>SHAKE</h1>
            <div className={styles.subtitle}>
              TO GET YOUR SIGN{'\n'}FROM THE UNIVERSE!
            </div>
          </div>

          <div className={styles.inputContainer}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here"
              className={styles.questionInput}
            />
          </div>

          <Button 
            onClick={handleShake}
            disabled={isShaking || !question.trim()}
          >
            SHAKE FOR YOUR SIGN
          </Button>

          <div className={`${styles.ballContainer} ${isShaking ? styles.shakeAnimation : ''}`}>
      <div className={styles.ballImageContainer}>
      <img src="/8ball.png" alt="8-Ball" className={styles.ballImage} />

        
        <div className={styles.ballWindow}>
          {showAfterShake ? (
            <>
              <img src="/after-shake.png" alt="Final shake response" className={styles.afterShakeBackground} />

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
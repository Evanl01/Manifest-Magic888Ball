'use client';
import { useState } from "react";
import Image from 'next/image';
import styles from "./EightBall.module.css";
import Button from "./Button";

const UNIVERSE_SIGNS = [
  'Seeing 11:11 on the clock',
  'Finding a single, perfectly white feather',
  'A crusty white dog named Jewel',
  'Your Oura ring stops working',
  'Hearing the same random song on three different stations',

];

export default function EightBall() {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState("The Universe is\nin your hands");
  const [isShaking, setIsShaking] = useState(false);
  const [showAfterShake, setShowAfterShake] = useState(false);

  const handleShake = () => {
    if (!question.trim()) return;
    
    setIsShaking(true);
    setShowAfterShake(false);

    setTimeout(() => {
      const randomSign = UNIVERSE_SIGNS[Math.floor(Math.random() * UNIVERSE_SIGNS.length)];
      setMessage(randomSign);
      setIsShaking(false);
      setShowAfterShake(true);
    }, 1500);
  };

  return (
    <div className={styles.container}>
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
          <div className={styles.ballOuter}>
            <div className={styles.ballWindow}>
              {showAfterShake ? (
                <>
                  <Image
                    src="/after-shake.png"
                    alt="Universe background"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                  <div className={styles.responseOverlay}>
                    <p className={styles.response}>{message}</p>
                  </div>
                </>
              ) : (
                <div className={styles.initialState}>
                  <div className={styles.initialGradient} />
                  <p className={styles.response}>{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showAfterShake && (
          <button onClick={() => {}} className={styles.shareButton}>
            SHARE YOUR SIGN!
          </button>
        )}

        <div className={styles.bottomTitle}>
          MANIFEST 888 BALL
        </div>
      </div>
    </div>
  );
}
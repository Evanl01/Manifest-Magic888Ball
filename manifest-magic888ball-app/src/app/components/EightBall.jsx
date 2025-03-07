'use client';
import { useState, useRef } from "react";
import Image from 'next/image';
import html2canvas from "html2canvas";
import styles from "./EightBall.module.css";
import Button from "./Button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase"; // Import Firebase
import { FaInstagram, FaTiktok, FaPinterest, FaDownload } from "react-icons/fa";

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
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const ballRef = useRef(null);

  const handleShake = async () => {
    if (!question.trim()) return;

    setIsShaking(true);
    setShowAfterShake(false);

    setTimeout(async () => {
      const randomSign = UNIVERSE_SIGNS[Math.floor(Math.random() * UNIVERSE_SIGNS.length)];
      setMessage(randomSign);
      setIsShaking(false);
      setShowAfterShake(true);

      // Send data to Firestore
      try {
        await addDoc(collection(db, "entries"), {
          question,
          response: randomSign,
          date: serverTimestamp() // Firebase timestamp
        });
        console.log("Entry saved to Firestore");
      } catch (error) {
        console.error("Error saving to Firestore:", error);
      }
    }, 1500);
  };

  const handleCapture = async () => {
    if (!ballRef.current) return;

    const canvas = await html2canvas(ballRef.current);
    const imgData = canvas.toDataURL("image/png");
    setCapturedImage(imgData);
    setShowPopup(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pinkContainer} ref={ballRef}>
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
          <button onClick={handleCapture} className={styles.shareButton}>
            SHARE YOUR SIGN!
          </button>
        )}

        {showPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <div className={styles.closeButtonWrapper}>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowPopup(false)}
                >
                  ✖
                </button>
              </div>
              <h3>Your Sign from the Universe:</h3>
              <img src={capturedImage} alt="Captured sign" className={styles.capturedImage} />
              <div className={styles.buttonRow}>
                <a href={capturedImage} download="universe-sign.png" className={styles.downloadButton}>
                  <FaDownload /> Download
                </a>
                <a href="https://www.instagram.com/manifestapphq/#" target="_blank" rel="noopener noreferrer" className={styles.instagramButton}>
                  <FaInstagram /> Instagram
                </a>
                <a href="https://www.tiktok.com/@manifestapphq" target="_blank" rel="noopener noreferrer" className={styles.tiktokButton}>
                  <FaTiktok /> TikTok
                </a>
                <a href="https://www.pinterest.com/manifestapphq/" target="_blank" rel="noopener noreferrer" className={styles.pinterestButton}>
                  <FaPinterest /> Pinterest
                </a>
              </div>
            </div>
          </div>
        )}



        <div className={styles.bottomTitle}>
          MANIFEST 888 BALL
        </div>
      </div>
    </div>
  );
}

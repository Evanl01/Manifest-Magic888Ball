'use client';
import { useState } from "react";
import Image from 'next/image';
import styles from "./EightBall.module.css";
import Button from "./Button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase"; // Import Firebase

const UNIVERSE_SIGNS = [
  'Seeing 11:11 on the clock',
  'Finding a single, perfectly white feather',
  'A crusty white dog named Jewel',
  'Your Oura ring stops working',
  'Hearing the same random song on three different stations',
  'Spotting a shooting star',
  'A butterfly landing on your shoulder',
  'Repeating number plates (e.g., 888, 777)',
  'A stranger calls you by the wrong name',
  'Seeing a rainbow',
  'Finding a heart-shaped rock',
  'A crow caws outside your window',
  'Your phone dies exactly at 77%',
  'A random podcast starts playing',
  'Spotting a dandelion puff',
  'Waking up at 3:33 a.m.',
  'A fortune cookie message',
  'Spotting a billboard',
  'Three different people mention the same book',
  'Hearing church bells',
  'Finding exact change',
  'Your pet staring at you intensely',
  'Your GPS taking you on a detour',
  'A street lamp flickers',
  'Bumping into an old friend',
  'Your watch stops',
  'A random person compliments a talent',
  'Finding a perfectly intact four-leaf clover',
  'Sudden warmth on your skin',
  'A dragonfly hovering near you',
  'Receiving a text from someone you were just thinking about',
  'A single balloon floats by',
  'Spilling your drink',
  'Seeing a random quote in graffiti',
  'Finding a hidden door or path',
  'A flicker of lights in your house',
  'Hearing your name whispered',
  'Noticing a repeating daydream',
  'Receiving a free gift or sample',
  'A child points at you and smiles',
  'A random movie quote',
  'Finding a message in a bottle',
  'A street performer singing lyrics',
  'Smelling a familiar scent',
  'Seeing the same animal (fox, hawk, owl, etc.) repeatedly',
  'A crystal or rock falls off your shelf',
  'Wind chimes',
  'Being handed a business card',
  'A random polite stranger calls you “angel”',
];

export default function EightBall() {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState("The Universe is\nin your hands");
  const [isShaking, setIsShaking] = useState(false);
  const [showAfterShake, setShowAfterShake] = useState(false);

  // Carousel state
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const totalPages = 4; // Total number of pages (12 boxes / 3 per page)

  // Array of 12 boxes
//   const boxes = Array.from({ length: 12 }, (_, index) => `"Lorem ipsum dolor sit amet, consectetur
// adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna"`);
  // const boxes = Array.from({ length: 12 }, (_, index) => `Box ${index + 1}`);

  const reviews = [
    "This ball knows things. - Anonymous",
    "A raven landed on my window right after I got my sign. - Anonymous",
    "Was feeling lost, the ball told me to look for butterflies. Saw three monarchs that afternoon in NYC winter. Wild. - Anonymous",
    "Yesterday, I spilled coffee on someone wearing exactly what the ball described. - Anonymous",
    "The sign said 'check your spam folder' - found a job offer from 2 days ago sitting there. - Anonymous",
    "I'm shook. - Anonymous"
  ];
  
  // Create an array with each review appearing twice
  const boxes = [...reviews, ...reviews];
  // Calculate visible boxes based on current page
  const visibleBoxes = boxes.slice(currentPage * 3, (currentPage + 1) * 3);

  // Handle navigation
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.pinkContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.shakeText}>SHAKE</h1>
          <div className={styles.subtitleContainer}>
            <div className={styles.subtitle}> TO GET YOUR SIGN  </div>
            <div className={styles.subtitle}> FROM THE UNIVERSE! </div>
          </div>
        </div>
        
        <div className={styles.inputContainer}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
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
            {/* Top-left Light Reflection */}
            <div className={styles.ballReflection}></div>

            {/* Magic Ball Window */}
            <div className={styles.ballWindow}>
              {showAfterShake ? (
                <div className={styles.responseOverlay}>
                  <p className={styles.response}>{message}</p>
                </div>
              ) : (
                <div className={styles.initialState}>
                  <p className={styles.response}>{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showAfterShake && (
        <div className={styles.buttonContainer}>
        <button
          onClick={() => {}}
          className={`${styles.shareButton} ${showAfterShake ? styles.show : ""}`}
        >
          <span>SHARE YOUR SIGN!</span>
        </button>
      </div>      
      )}

        <div className={styles.manifestTitle}>
          MANIFEST 888 BALL
        </div>
      </div>
      
      <div className={styles.middleContainer}>
        <div className={styles.middletext}>
          I SAW A LITTLE CRUSTY WHITE DOG NAMED JEWEL.
        </div>
      </div>


      {/* Carousel Container */}
      <div className={styles.carouselContainer}>
        {/* Visible Boxes */}
        <div className={styles.visibleBoxesContainer}>
          {visibleBoxes.map((box, index) => (
            <div key={index} className={styles.whiteBox}>
              {box}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className={styles.paginationContainer}>
        {/* Left Arrow */}
        <button className={`${styles.navArrow} ${styles.left}`} onClick={handlePrev}>
          &#10094; {/* Left arrow */}
        </button>

        {/* Pagination Dots */}
        <div className={styles.paginationDots}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`${styles.paginationDot} ${index === currentPage ? styles.active : ''}`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button className={`${styles.navArrow} ${styles.right}`} onClick={handleNext}>
          &#10095; {/* Right arrow */}
        </button>
      </div>
      
      <div className={`${styles.bottomTitle} text-white mt-4`} style={{ fontSize: '45px' }}>
        THE MOST RECENTLY GENERATED SIGNS
      </div>
      
      <div className={styles.additionalBoxesContainer}> 
        <div className={styles.horizontalWhiteBox}>
          A rainbow appears in your sky.
        </div>
        <div className={styles.horizontalWhiteBox}>
          You notice repeating numbers: 11:11 on the clock.
        </div>
        <div className={styles.horizontalWhiteBox}>
          A gentle rain starts after a long dry spell.
        </div>
      </div>
    </div>
  );
}
'use client';
import Head from 'next/head';
import { useState, useEffect } from "react";
import Image from 'next/image';
import styles from "./MainPage.module.css";
import Button from "./Button";
import SharePopup from "./SharePopup";
import EightBall from "./EightBall";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

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

export default function MainPage() {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState("The Universe is\nin your hands");
  const [isShaking, setIsShaking] = useState(false);
  const [showAfterShake, setShowAfterShake] = useState(false);
  const [recentSigns, setRecentSigns] = useState([]);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [carouselState, setCarouselState] = useState(0);
  const totalStates = 4;
  const reviews = [
    "This ball knows things. - Anonymous",
    "A raven landed on my window right after I got my sign. - Anonymous",
    "Was feeling lost, the ball told me to look for butterflies. Saw three monarchs that afternoon in NYC winter. Wild. - Anonymous",
    "Yesterday, I spilled coffee on someone wearing exactly what the ball described. - Anonymous",
    "The sign said 'check your spam folder' - found a job offer from 2 days ago sitting there. - Anonymous",
    "I'm shook. - Anonymous"
  ];
  
  const carouselConfigurations = [
    [0, 1, 2],
    [1, 2, 3],
    [3, 4, 5],
    [4, 5, 0]
  ];
  
  const getVisibleReviews = () => {
    const indices = carouselConfigurations[carouselState];
    return indices.map(index => ({
      content: reviews[index],
      index: index
    }));
  };

  const handleNext = () => {
    setCarouselState((prev) => (prev + 1) % totalStates);
  };

  const handlePrev = () => {
    setCarouselState((prev) => (prev - 1 + totalStates) % totalStates);
  };

  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const getInitialSigns = () => {
      const signsCopy = [...UNIVERSE_SIGNS];
      for (let i = signsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [signsCopy[i], signsCopy[j]] = [signsCopy[j], signsCopy[i]];
      }
      return signsCopy.slice(0, 3).map((sign, index) => ({
        id: `auto-${index}`,
        response: sign
      }));
    };
    
    setRecentSigns(getInitialSigns());
    
    const shuffleInterval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setRecentSigns(prevSigns => {
          const updatedSigns = [...prevSigns.slice(1)];
          let newSign;
          do {
            const randomSign = UNIVERSE_SIGNS[Math.floor(Math.random() * UNIVERSE_SIGNS.length)];
            if (!updatedSigns.some(sign => sign.response === randomSign)) {
              newSign = {
                id: `auto-${Date.now()}`,
                response: randomSign
              };
            }
          } while (!newSign);
          updatedSigns.push(newSign);
          return updatedSigns;
        });
        setIsUpdating(false);
      }, 500);
    }, 10000);
    
    return () => clearInterval(shuffleInterval);
  }, []);

  const getRandomLocation = () => {
    const locations = [
      "New York, NY",
      "Los Angeles, CA",
      "Chicago, IL",
      "Houston, TX",
      "Phoenix, AZ",
      "Philadelphia, PA",
      "San Antonio, TX",
      "San Diego, CA",
      "Dallas, TX",
      "Austin, TX"
    ];
    return locations[Math.floor(Math.random() * locations.length)];
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

      try {
        await addDoc(collection(db, "entries"), {
          question,
          response: randomSign,
          date: serverTimestamp()
        });
        console.log("Entry saved to Firestore");
      } catch (error) {
        console.error("Error saving to Firestore:", error);
      }
    }, 1500);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.container}>
        {/* Starry Sky Background */}
        <div className={styles.starryBackground}>
          <Image
            src="/space-background.png"
            alt="Starry sky background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col items-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-16">
          <div className={styles.pinkContainer}>
            <div className={styles.titleContainer}>
              <h1 className={styles.shakeText}>SHAKE</h1>
              <div className={styles.subtitle}>
                TO GET YOUR SIGN{"\n"}FROM THE UNIVERSE!
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
              className="mt-4 sm:mt-6"
            >
              SHAKE FOR YOUR SIGN
            </Button>
            <EightBall message={message} isShaking={isShaking} showAfterShake={showAfterShake} />
            {showAfterShake && (
              <button
                onClick={() => setShowSharePopup(true)}
                className={`${styles.shareButton} mt-4 sm:mt-6`}
              >
                SHARE YOUR SIGN!
              </button>
            )}
            {showSharePopup && (
              <SharePopup
                message={message}
                onClose={() => setShowSharePopup(false)}
              />
            )}
            <div className={styles.bottomTitle}>MANIFEST 888 BALL</div>
          </div>
          <div className={styles.dogBanner}>
            I SAW A LITTLE CRUSTY WHITE DOG NAMED JEWEL
          </div>
          <div className={styles.reviewsContainer}>
            {getVisibleReviews().map((review, i) => (
              <div key={i} className={styles.reviewBox}>
                <div className={styles.reviewText}>{review.content}</div>
                <div className={styles.reviewAuthor}>
                  <div className={styles.authorAvatar}>
                    <Image
                      src={`/avatars/avatar-${review.index + 1}.svg`}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className={styles.avatarImage}
                    />
                  </div>
                  <span className={styles.authorName}>Anonymous</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-5">
            <button
              className="bg-[#FFC3E7] w-8 h-8 flex items-center justify-center border border-black text-black text-sm mr-4 hover:bg-[#ff9fd5] transition-colors"
              onClick={handlePrev}
              aria-label="Previous reviews"
            >
              &#10094;
            </button>
            <div className="flex mx-2">
              {Array.from({ length: totalStates }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    carouselState === index ? "bg-[#FFC3E7]" : "bg-gray-300"
                  } cursor-pointer transition-colors hover:bg-[#ff9fd5]`}
                  onClick={() => setCarouselState(index)}
                  aria-label={`View reviews set ${index + 1}`}
                ></div>
              ))}
            </div>
            <button
              className="bg-[#FFC3E7] w-8 h-8 flex items-center justify-center border border-black text-black text-sm ml-4 hover:bg-[#ff9fd5] transition-colors"
              onClick={handleNext}
              aria-label="Next reviews"
            >
              &#10095;
            </button>
          </div>
          <div className={styles.recentSignsTitle}>
            THE MOST RECENTLY GENERATED SIGNS
          </div>
          <div
            className={`${styles.recentSignsAutoContainer} ${
              isUpdating ? styles.updating : ""
            }`}
          >
            {recentSigns.map((sign, index) => (
              <div
                key={sign.id}
                className={styles.recentSignBox}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className={styles.signUser}>
                  <div className={styles.avatarContainer}>
                    <Image
                      src={`/avatars/avatar-${(index % 3) + 1}.svg`}
                      alt="User avatar"
                      width={36}
                      height={36}
                      className={styles.avatarImage}
                    />
                  </div>
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>Anonymous</div>
                    <div className={styles.userLocation}>
                      {getRandomLocation()}
                    </div>
                  </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.recentSignContent}>{sign.response}</div>
              </div>
            ))}
          </div>
          <div className="w-full mt-10 relative">
            <svg
              className="w-full"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <path
                d="M1085.25 91.4195C1232.75 20.2642 1504.51 119.383 1539.32 145.851H-27.3204V91.4195C232.075 44.9011 261.678 167.678 448.201 59.3755C522.038 16.503 619.378 -6.48379 725.337 1.58314C886.592 13.8599 911.55 175.217 1085.25 91.4195Z"
                fill="white"
              ></path>
            </svg>
          </div>
          <div className="w-full bg-white pt-12 pb-8 flex flex-col items-center">
            <div className="text-black text-sm">powered by</div>
            <h1 className={styles.manifestCompanyText}>MANIFEST</h1>
            <div className="text-black text-sm mt-2 text-center">
              We're the #1 resource to help you manifest your dreams.
            </div>
            <a href="#" className="mt-4">
              <img
                src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                alt="Download on App Store"
                className="h-10"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;base64,...";
                }}
              />
            </a>
            <div className="mt-6 text-black text-sm">
              Follow the other delulu girlies below.
            </div>
            <div className="flex gap-4 mt-3">
            <a href="#" className="w-8 h-8 rounded-full bg-black flex items-center justify-center transition-transform hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-black flex items-center justify-center transition-transform hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525 21.975c6.741 0 10.225-5.585 10.225-10.425 0-.159 0-.318-.01-.475.718-.519 1.335-1.159 1.83-1.893-.673.297-1.386.492-2.113.577.767-.459 1.343-1.178 1.616-2.031-.722.429-1.513.729-2.333.889-1.394-1.482-3.724-1.553-5.207-.159-.959.899-1.365 2.228-1.067 3.496-2.965-.149-5.724-1.553-7.584-3.817-1.076 1.851-.509 4.216 1.25 5.36-.645-.019-1.273-.189-1.839-.483v.049c0 1.92 1.354 3.577 3.245 3.957-.596.162-1.220.185-1.826.068.529 1.647 2.044 2.773 3.764 2.803-1.426 1.117-3.196 1.717-5.013 1.717-.322 0-.644-.019-.964-.057 1.843 1.174 3.991 1.8 6.201 1.8" />
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-black flex items-center justify-center transition-transform hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.217-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
            <hr className="w-full max-w-4xl mt-8 border-t border-gray-300" />
            <div className="w-full max-w-4xl flex justify-between text-black text-xs mt-4 px-4">
              <div>Transcend Labs Inc. 2024</div>
              <div className="flex gap-6">
                {/* Footer Links */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { toPng, toBlob } from "html-to-image";
import { FaInstagram, FaTiktok, FaPinterest } from "react-icons/fa";
import styles from "./SharePopup.module.css";
import ShareScreen from "./ShareScreen";

const SharePopup = ({ message, onClose }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/8ball.png";
    img.onload = () => setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleNavigate = () => {
    window.location.href = "http://magic888.manifestapp.xyz/";
  };

  const captureImage = async () => {
    const targetElement = document.getElementById("shareScreen");
    if (!targetElement) {
      console.error("Target element not found");
      return null;
    }

    try {
      const dataUrl = await toPng(targetElement, {
        cacheBust: true,
        width: targetElement.offsetWidth * 2,
        height: targetElement.offsetHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
          width: `${targetElement.offsetWidth}px`,
          height: `${targetElement.offsetHeight}px`,
        },
      });
      return dataUrl;
    } catch (error) {
      console.error("Error capturing image:", error);
      return null;
    }
  };

  const handleShare = async () => {
    if (!isLoaded) {
      console.error("Image not loaded yet");
      return;
    }

    const dataUrl = await captureImage();
    if (!dataUrl) return;

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "screenshot.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Manifest Magic 888 Ball",
          text: "Shake to get your sign from the universe! https://magic888.manifestapp.xyz/",
        });
        console.log("Image shared successfully");
      } else {
        console.error("Web Share API is not supported in your browser.");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Share action was canceled by the user.");
      } else {
        console.error("Error sharing image:", error);
      }
    }
  };

  const handleDownload = async () => {
    if (!isLoaded) {
      console.error("Image not loaded yet");
      return;
    }

    const dataUrl = await captureImage();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "Magic888Ball.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup} ref={popupRef}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <ShareScreen message={message} onNavigate={handleNavigate} />

        <div className={styles.result}></div>
        <div className={styles.buttonRow}>
          <button className={styles.shareButton} onClick={handleShare} disabled={!isLoaded}>
            Share Image
          </button>
          <button className={styles.downloadButton} onClick={handleDownload} disabled={!isLoaded}>
            Download Image
          </button>
        </div>
        <div className={styles.iconRow}>
          <a href="https://www.instagram.com/manifestapphq/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className={styles.icon} />
          </a>
          <a href="https://www.tiktok.com/@manifestapphq" target="_blank" rel="noopener noreferrer">
            <FaTiktok className={styles.icon} />
          </a>
          <a href="https://in.pinterest.com/manifestapphq/" target="_blank" rel="noopener noreferrer">
            <FaPinterest className={styles.icon} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
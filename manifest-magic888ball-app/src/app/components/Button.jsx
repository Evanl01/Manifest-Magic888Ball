import styles from "./Button.module.css";

export default function Button({ children, onClick, disabled, className = "" }) {
  return (
    <button 
      className={`${styles.shakeButton} ${className}`} 
      onClick={onClick} 
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
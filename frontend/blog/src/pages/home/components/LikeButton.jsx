import React from "react";
import { Heart } from "lucide-react";
import styles from "../styles/LikeButton.module.css";

const LikeButton = ({ isLiked, likesCount, onLike, disabled }) => {
  const getLikesText = (count) => {
    if (count === 0) return "0";
    if (count === 1) return "1";
    return `${count}`;
  };

  return (
    <button
      onClick={onLike}
      className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
      disabled={disabled}
      title={isLiked ? "Undo like" : "Like post"}
    >
      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
      <span className={styles.likesCount}>{getLikesText(likesCount)}</span>
    </button>
  );
};

export default LikeButton;

import React, { useState } from "react";
import { Heart } from "lucide-react";
import styles from "../styles/PostEngagement.module.css";

const PostEngagement = ({ post, onLikeToggle }) => {
  const [likingPost, setLikingPost] = useState(false);

  const handleLikeToggle = async () => {
    setLikingPost(true);
    try {
      await onLikeToggle();
    } finally {
      setLikingPost(false);
    }
  };

  return (
    <div className={styles.engagement}>
      <div className={styles.likesSection}>
        <button
          onClick={handleLikeToggle}
          className={`${styles.btnLike} ${
            post.isLikedByCurrentUser ? styles.liked : ""
          }`}
          disabled={likingPost}
          title={post.isLikedByCurrentUser ? "undo like" : "like post"}
        >
          <Heart
            size={20}
            fill={post.isLikedByCurrentUser ? "currentColor" : "none"}
          />
          <span className={styles.likesCount}>{post.likesCount || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default PostEngagement;

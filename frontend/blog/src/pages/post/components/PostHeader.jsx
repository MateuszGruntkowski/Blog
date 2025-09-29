import React from "react";
import { User, Calendar, Clock } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import styles from "../styles/PostHeader.module.css";

const PostHeader = ({ post }) => {
  const getReadingTimeText = (minutes) => {
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <User size={16} />
          <span className={styles.author}>{post.author.name}</span>
        </div>
        <div className={styles.metaItem}>
          <Calendar size={16} />
          <span className={styles.date}>{formatDate(post.createdAt)}</span>
        </div>
        <div className={styles.metaItem}>
          <Clock size={16} />
          <span className={styles.readingTime}>
            {getReadingTimeText(post.readingTime)}
          </span>
        </div>
      </div>

      <div className={styles.headerSecondary}>
        {post.category && (
          <div className={styles.category}>{post.category.name}</div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {Array.from(post.tags).map((tag) => (
              <span key={tag.id} className={styles.tag}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default PostHeader;

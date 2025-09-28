import React from "react";
import { FileText } from "lucide-react";
import styles from "../styles/NoPostsMessage.module.css";

const NoPostsMessage = () => {
  return (
    <div className={styles.noPostsContainer}>
      <FileText size={48} color="#6c757d" />
      <p className={styles.noPostsText}>No posts match the selected criteria</p>
      <small className={styles.noPostsSubtext}>
        Try changing filters or check back later
      </small>
    </div>
  );
};

export default NoPostsMessage;

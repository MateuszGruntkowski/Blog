import React from "react";
import { FileText } from "lucide-react";
import DraftPostCard from "./DraftPostCard";
import styles from "../styles/DraftPostsList.module.css";

const DraftPostsList = ({ posts, onEdit, onDelete, deletingId }) => {
  if (posts.length === 0) {
    return (
      <div className={styles.list}>
        <div className={styles.emptyState}>
          <FileText size={48} color="#6c757d" />
          <p className={styles.emptyStateTitle}>No drafts</p>
          <small className={styles.emptyStateSubtitle}>
            When you save a post as a draft, it will appear here.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <DraftPostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingId === post.id}
        />
      ))}
    </div>
  );
};

export default DraftPostsList;

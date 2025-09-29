import React, { useState } from "react";
import { User, Calendar, Trash2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../utils/formatDate";
import apiService from "../../../services/apiService";
import styles from "../styles/CommentItem.module.css";

const CommentItem = ({ comment, onCommentDeleted }) => {
  const { user, isAdmin, getUserId } = useAuth();
  const [deletingComment, setDeletingComment] = useState(false);

  const canDeleteComment = () => {
    if (!user) return false;
    return isAdmin() || comment.author.id === getUserId();
  };

  const handleDeleteComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setDeletingComment(true);
      await apiService.deleteComment(comment.id);
      onCommentDeleted(comment.id);
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingComment(false);
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <User size={16} />
          <span className={styles.author}>{comment.author.name}</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.dateInfo}>
            <Calendar size={14} />
            <span className={styles.date}>{formatDate(comment.createdAt)}</span>
          </div>

          {canDeleteComment() && (
            <button
              onClick={handleDeleteComment}
              className="btn btn-danger btn-sm"
              disabled={deletingComment}
              title="Delete comment"
            >
              <Trash2 size={14} />
              {deletingComment && "..."}
            </button>
          )}
        </div>
      </div>
      <div className={styles.content}>{comment.content}</div>
    </div>
  );
};

export default CommentItem;

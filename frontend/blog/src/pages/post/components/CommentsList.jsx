import React from "react";
import { MessageCircle } from "lucide-react";
import CommentItem from "./CommentItem";
import styles from "../styles/CommentsList.module.css";

const CommentsList = ({ comments, loading, onCommentDeleted }) => {
  if (loading) {
    return <div className={styles.loading}>Loading comments...</div>;
  }

  if (comments.length === 0) {
    return (
      <div className={styles.noComments}>
        <MessageCircle size={48} color="#6c757d" />
        <p>No comments yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onCommentDeleted={onCommentDeleted}
        />
      ))}
    </div>
  );
};

export default CommentsList;

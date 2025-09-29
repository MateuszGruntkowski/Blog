import React, { useState } from "react";
import { Send } from "lucide-react";
import apiService from "../../../services/apiService";
import styles from "../styles/CommentForm.module.css";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError(null);

      const newComment = await apiService.createComment(postId, {
        content: commentContent.trim(),
      });

      onCommentAdded(newComment);
      setCommentContent("");
    } catch (err) {
      console.error("Error creating comment:", err);
      setCommentError(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.formTitle}>Add comment</h3>
      <form onSubmit={handleCommentSubmit} className={styles.form}>
        <div className={styles.editor}>
          <div className="form-group">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className={`form-textarea ${styles.textarea}`}
              placeholder="Enter your comment..."
              rows={4}
              disabled={submittingComment}
            />
          </div>

          {commentError && (
            <div className="alert alert-error">{commentError}</div>
          )}

          <div className={styles.formActions}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingComment || !commentContent.trim()}
            >
              <Send size={16} />
              {submittingComment ? "Adding..." : "Add Comment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;

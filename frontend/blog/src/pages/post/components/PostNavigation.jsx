import React from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import styles from "../styles/PostNavigation.module.css";

const PostNavigation = ({ onGoBack, canDelete, onDelete, isDeleting }) => {
  return (
    <div className={styles.navigation}>
      <button onClick={onGoBack} className="btn btn-secondary">
        <ArrowLeft size={16} />
        Back
      </button>

      {canDelete && (
        <div className={styles.actions}>
          <button
            onClick={onDelete}
            className="btn btn-danger"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete post"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostNavigation;

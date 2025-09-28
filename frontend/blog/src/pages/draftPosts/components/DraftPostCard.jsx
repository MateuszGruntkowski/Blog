import React, { useState, useEffect } from "react";
import { User, Calendar, Edit3, Trash2 } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import apiService from "../../../services/apiService";
import styles from "../styles/DraftPostCard.module.css";

const DraftPostCard = ({ post, onEdit, onDelete, isDeleting }) => {
  const [imageData, setImageData] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Load image data if post has an image
  useEffect(() => {
    const loadImage = async () => {
      if (!post.image?.id) return;

      try {
        setImageError(false);
        const imageBlob = await apiService.getPostImage(post.image.id);
        const imageUrl = URL.createObjectURL(
          new Blob([imageBlob], {
            type: post.image.contentType,
          })
        );
        setImageData(imageUrl);
      } catch (error) {
        console.error("Error loading image:", error);
        setImageError(true);
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [post.image?.id]);

  const handleEdit = () => {
    onEdit(post.id);
  };

  const handleDelete = () => {
    onDelete(post.id, post.title);
  };

  return (
    <article className={styles.card}>
      {/* Post Header */}
      <div className={styles.cardHeader}>
        <div className={styles.authorInfo}>
          <div className={styles.authorAvatar}>
            <User size={18} />
          </div>
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>
              {post.author?.name || "Author unknown"}
            </span>
            <div className={styles.postMeta}>
              <span className={styles.metaItem}>
                <Calendar size={14} />
                {formatDate(post.createdAt)}
              </span>
              <span className={styles.statusBadge}>Draft</span>
            </div>
          </div>
        </div>

        {post.category && (
          <div className={styles.category}>{post.category.name}</div>
        )}
      </div>

      {/* Post Title */}
      <h2 className={styles.title}>{post.title}</h2>

      {/* Post Image */}
      {post.image && (
        <div className={styles.imageContainer}>
          {imageError && (
            <div className={styles.imageError}>
              <span>Failed to load image.</span>
            </div>
          )}
          {imageData && !imageError && (
            <img
              src={imageData}
              alt={post.image.fileName || post.title}
              className={styles.postImage}
            />
          )}
        </div>
      )}

      {/* Post Content */}
      <div className={styles.content}>
        {post.content.substring(0, 200)}
        {post.content.length > 200 && "..."}
      </div>

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag.id} className={styles.tag}>
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={handleEdit}
          className={styles.editBtn}
          title="Edit draft"
        >
          <Edit3 size={16} />
          Edit
        </button>

        <button
          onClick={handleDelete}
          // className={styles.deleteBtn}
          className="btn btn-danger"
          disabled={isDeleting}
          title="Delete draft"
        >
          <Trash2 size={16} />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default DraftPostCard;

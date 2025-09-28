import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Calendar, Clock, MessageCircle } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import LikeButton from "./LikeButton";
import apiService from "../../../services/apiService";
import styles from "../styles/PostCard.module.css";

const PostCard = ({ post, index, onLikeToggle, likingPost, user }) => {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Load image data if post has an image
  useEffect(() => {
    const loadImage = async () => {
      if (!post.image?.id) return;

      try {
        setImageLoading(true);
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
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();

    // Cleanup function to revoke object URL
    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [post.image?.id]);

  const renderPostContent = (content) => {
    const truncatedContent =
      content.length > 200 ? content.substring(0, 200) + "..." : content;
    return { __html: truncatedContent };
  };

  const getReadingTimeText = (minutes) => {
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    onLikeToggle(post.id);
  };

  return (
    <Link to={`/posts/${post.id}`} className={styles.postCardLink}>
      <article
        className={styles.postCard}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Post Header */}
        <div className={styles.postHeader}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <User size={20} />
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
                <span className={styles.metaItem}>
                  <Clock size={14} />
                  {getReadingTimeText(post.readingTime)}
                </span>
              </div>
            </div>
          </div>

          {post.category && (
            <div className={styles.postCategory}>{post.category.name}</div>
          )}
        </div>

        {/* Post Title */}
        <h2 className={styles.postTitle}>{post.title}</h2>

        {/* Post Image */}
        {post.image && (
          <div className={styles.postImageContainer}>
            {imageLoading && (
              <div className={styles.imageLoading}>
                <div className={styles.loadingSpinner}></div>
              </div>
            )}
            {imageError && (
              <div className={styles.imageError}>
                <span>Błąd ładowania obrazka</span>
              </div>
            )}
            {imageData && !imageLoading && !imageError && (
              <img
                src={imageData}
                alt={post.image.fileName || post.title}
                className={styles.postImage}
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* Post Content */}
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={renderPostContent(post.content)}
        />

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className={styles.postTags}>
            {post.tags.map((tag) => (
              <span key={tag.id} className={styles.postTag}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Post Engagement */}
        <div className={styles.postEngagement}>
          <LikeButton
            isLiked={post.isLikedByCurrentUser}
            likesCount={post.likesCount || 0}
            onLike={handleLikeClick}
            disabled={likingPost === post.id}
          />

          {/* Comments count */}
          <div className={styles.commentsCount}>
            <MessageCircle size={16} />
            <span>{post.commentsCount || 0}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;

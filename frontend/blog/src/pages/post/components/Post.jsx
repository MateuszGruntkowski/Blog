import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import apiService from "../../../services/apiService";
import { ArrowLeft } from "lucide-react";

import PostNavigation from "./PostNavigation";
import PostArticle from "./PostArticle";
import PostComments from "./PostComments";
// import styles from "../styles/Post.module.css";
import styles from "../styles/Post.module.css";

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, getUserId } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const postData = await apiService.getPost(id);
      setPost(postData);
    } catch (err) {
      console.error("Error loading post:", err);
      setError("Failed to load post.");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const commentsData = await apiService.getComments(id);
      setComments(commentsData);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const updatedPost = await apiService.togglePostLike(id);
      setPost(updatedPost);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      setDeletingPost(true);
      await apiService.deletePost(id);
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post.");
    } finally {
      setDeletingPost(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const canDeletePost = () => {
    if (!user || !post) return false;
    return isAdmin() || post.author.id === getUserId();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="alert alert-error">Post not found</div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <PostNavigation
          onGoBack={() => navigate(-1)}
          canDelete={canDeletePost()}
          onDelete={handleDeletePost}
          isDeleting={deletingPost}
        />

        <PostArticle post={post} onLikeToggle={handleLikeToggle} />

        <PostComments
          comments={comments}
          commentsLoading={commentsLoading}
          postId={id}
          user={user}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>
    </div>
  );
};

export default Post;

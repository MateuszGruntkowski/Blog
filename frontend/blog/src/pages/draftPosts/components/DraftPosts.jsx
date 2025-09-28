import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../../services/apiService";
import DraftPostsList from "./DraftPostsList";
import { FileText } from "lucide-react";
import styles from "../styles/DraftPosts.module.css";

const DraftPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadDraftPosts();
  }, []);

  const loadDraftPosts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDraftPosts();
      setPosts(data);
      console.log(data);
    } catch (error) {
      setError("Failed to load draft posts");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = async (postId, postTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the draft "${postTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(postId);
      await apiService.deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = `alert alert-success ${styles.successMessage}`;
      successMessage.textContent = "Draft deleted successfully";
      document.querySelector(`.${styles.container}`).prepend(successMessage);

      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    } catch (error) {
      console.error("Error deleting draft", error);
      setError("Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading drafts...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <FileText size={32} />
            Draft Posts
          </h1>
          <p className={styles.subtitle}>Manage your unpublished posts</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <DraftPostsList
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </div>
    </div>
  );
};

export default DraftPosts;

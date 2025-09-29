import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../../services/apiService";
import EditPostForm from "./EditPostForm";
import styles from "../styles/EditPost.module.css";

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "DRAFT",
    categoryId: "",
    tagIds: new Set(),
    image: null,
    currentImageUrl: "",
  });

  // Data for dropdowns
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Function to load post image
  const loadPostImage = async (postId) => {
    try {
      setLoadingImage(true);
      const imageBlob = await apiService.getPostImage(postId);
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      console.error("Error loading image:", error);
      return null;
    } finally {
      setLoadingImage(false);
    }
  };

  // Fetch post data and dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, categoriesData, tagsData] = await Promise.all([
          apiService.getPost(id),
          apiService.getCategories(),
          apiService.getTags(),
        ]);

        // Set form data from existing post
        setFormData((prev) => ({
          ...prev,
          title: postData.title || "",
          content: postData.content || "",
          status: postData.status || "DRAFT",
          categoryId: postData.categoryId || "",
          tagIds: new Set(postData.tagIds || []),
        }));

        // Load post image if it exists
        if (postData.image && postData.image.id) {
          const imageUrl = await loadPostImage(postData.image.id);
          if (imageUrl) {
            setFormData((prev) => ({
              ...prev,
              currentImageUrl: imageUrl,
            }));
          }
        }

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Cleanup function for object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (
        formData.currentImageUrl &&
        formData.currentImageUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(formData.currentImageUrl);
      }
    };
  }, [formData.currentImageUrl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      const postData = {
        id: id,
        title: formData.title,
        content: formData.content,
        status: formData.status,
        categoryId: formData.categoryId || null,
        tagIds: Array.from(formData.tagIds),
      };

      submitData.append(
        "post",
        new Blob([JSON.stringify(postData)], {
          type: "application/json",
        })
      );

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Send info about current image removal
      if (!formData.currentImageUrl) {
        submitData.append("removeCurrentImage", "true");
      }

      await apiService.updatePost(id, submitData);
      setSuccess("The post has been successfully updated!");

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error updating post:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while updating the post."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/");
  const handleBackToPost = () => navigate(`/posts/drafts`);

  const handleFormDataChange = (newData) => {
    setFormData(newData);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.container}>
        <button
          onClick={handleBackToPost}
          className={`btn btn-secondary ${styles.backButton}`}
        >
          ← Back to drafts
        </button>

        <h1 className={styles.title}>Edit post</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <EditPostForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          categories={categories}
          tags={tags}
          submitting={submitting}
          loadingImage={loadingImage}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default EditPost;

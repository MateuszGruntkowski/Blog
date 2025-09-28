import React, { useState, useEffect } from "react";
import apiService from "../../../services/apiService";
import { useAuth } from "../../../context/AuthContext";
import PostFilters from "./PostFilters";
import PostList from "./PostList";
import NoPostsMessage from "./NoPostsMessage";
// import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [likingPost, setLikingPost] = useState(null);

  const { user } = useAuth();

  const handleLikeToggle = async (postId) => {
    if (!user) {
      return;
    }

    try {
      setLikingPost(postId);
      const updatedPost = await apiService.togglePostLike(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLikingPost(null);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedTag]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData, tagsData] = await Promise.all([
        apiService.getPosts({
          ...(selectedCategory && { categoryId: selectedCategory }),
          ...(selectedTag && { tagId: selectedTag }),
        }),
        apiService.getCategories(),
        apiService.getTags(),
      ]);

      setPosts(postsData.filter((post) => post.status === "PUBLISHED"));
      setCategories(categoriesData);
      setTags(tagsData);
      console.log(postsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleTagChange = (tagId) => {
    setSelectedTag(tagId);
  };

  if (loading) {
    return (
      <div className="container">
        <div className={styles.homeContainer}>{/* <LoadingSpinner /> */}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.homeContainer}>
        <aside className={styles.sidebar}>
          <PostFilters
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
          />
        </aside>

        <main className={styles.contentArea}>
          {posts.length === 0 ? (
            <NoPostsMessage />
          ) : (
            <PostList
              posts={posts}
              onLikeToggle={handleLikeToggle}
              likingPost={likingPost}
              user={user}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;

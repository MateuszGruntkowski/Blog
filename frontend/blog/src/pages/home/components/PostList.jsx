import React from "react";
import PostCard from "./PostCard";
import styles from "../styles/PostList.module.css";

const PostList = ({ posts, onLikeToggle, likingPost, user }) => {
  return (
    <div className={styles.postList}>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          onLikeToggle={onLikeToggle}
          likingPost={likingPost}
          user={user}
        />
      ))}
    </div>
  );
};

export default PostList;

import React from "react";
import { Search } from "lucide-react";
import styles from "../styles/PostFilters.module.css";

const PostFilters = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersHeader}>
        <h3>
          <Search size={20} />
          Post filters
        </h3>
      </div>

      <div className={styles.filterSection}>
        <label className="form-label">Category</label>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${
              !selectedCategory ? styles.active : ""
            }`}
            onClick={() => onCategoryChange("")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.filterBtn} ${
                selectedCategory === category.id ? styles.active : ""
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <label className="form-label">Tags</label>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${
              !selectedTag ? styles.active : ""
            }`}
            onClick={() => onTagChange("")}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`${styles.filterBtn} ${
                selectedTag === tag.id ? styles.active : ""
              }`}
              onClick={() => onTagChange(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostFilters;

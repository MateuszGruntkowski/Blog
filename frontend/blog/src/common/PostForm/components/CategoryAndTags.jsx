import React from "react";
import TagCheckbox from "./TagCheckbox";
import styles from "../styles/CategoryAndTags.module.css";

const CategoryAndTags = ({
  formData,
  categories,
  tags,
  onInputChange,
  onTagChange,
}) => {
  return (
    <div className={styles.row}>
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          name="categoryId"
          className="form-select"
          value={formData.categoryId}
          onChange={onInputChange}
        >
          <option value="">Choose category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <div className={styles.tagsContainer}>
          {tags.map((tag) => (
            <TagCheckbox
              key={tag.id}
              tag={tag}
              isChecked={formData.tagIds.has(tag.id)}
              onChange={() => onTagChange(tag.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryAndTags;

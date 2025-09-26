import React from "react";
import styles from "../styles/TagCheckbox.module.css";

const TagCheckbox = ({ tag, isChecked, onChange }) => {
  return (
    <label className={styles.tagCheckbox}>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <span>{tag.name}</span>
    </label>
  );
};

export default TagCheckbox;

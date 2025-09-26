import React from "react";
import styles from "../styles/BasicFields.module.css";

const BasicFields = ({ formData, onInputChange }) => {
  return (
    <div className={styles.row}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          type="text"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select"
          value={formData.status}
          onChange={onInputChange}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
    </div>
  );
};

export default BasicFields;

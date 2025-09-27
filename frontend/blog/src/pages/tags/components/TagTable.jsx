import React from "react";
import { Trash2 } from "lucide-react";
import styles from "../styles/TagTable.module.css";

const TagTable = ({ tags, onDeleteTag }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this tag?")) {
      return;
    }
    await onDeleteTag(id);
  };

  return (
    <div className={styles.table}>
      <table className={styles.element}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Post count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.length === 0 ? (
            <tr>
              <td colSpan="3" className={styles.emptyState}>
                No tags
              </td>
            </tr>
          ) : (
            tags.map((tag) => (
              <tr key={tag.id}>
                <td>{tag.name}</td>
                <td>{tag.postCount || 0}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(tag.id)}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TagTable;

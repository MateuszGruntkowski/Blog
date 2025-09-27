import React from "react";
import { Trash2 } from "lucide-react";
import styles from "../styles/CategoryTable.module.css";

const CategoryTable = ({ categories, onDeleteCategory }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    await onDeleteCategory(id);
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
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" className={styles.emptyState}>
                No categories
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.postCount}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;

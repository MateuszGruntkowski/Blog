import React from "react";
import styles from "../styles/EditorToolbar.module.css";

const EditorToolbar = ({ onFormatting }) => {
  return (
    <div className={styles.editorToolbar}>
      <button
        type="button"
        onClick={() => onFormatting("**", "**")}
        title="bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => onFormatting("*", "*")}
        title="italics"
      >
        I
      </button>
      <button type="button" onClick={() => onFormatting("# ")} title="header">
        H1
      </button>
      <button
        type="button"
        onClick={() => onFormatting("## ")}
        title="header 2"
      >
        H2
      </button>
    </div>
  );
};

export default EditorToolbar;

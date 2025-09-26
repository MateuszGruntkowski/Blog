import React, { useRef } from "react";
import EditorToolbar from "./EditorToolbar";
import styles from "../styles/ContentEditor.module.css";

const ContentEditor = ({ content, onContentChange }) => {
  const contentTextareaRef = useRef(null);

  const handleInputChange = (e) => {
    onContentChange(e.target.value);
  };

  // Insert formatting in textarea
  const insertFormatting = (before, after = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    onContentChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos =
        start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={`form-group ${styles.fullWidth}`}>
      <label className="form-label">Content</label>
      <div className={styles.editorContainer}>
        <EditorToolbar onFormatting={insertFormatting} />
        <textarea
          ref={contentTextareaRef}
          name="content"
          className={`form-textarea ${styles.contentTextarea}`}
          value={content}
          onChange={handleInputChange}
          placeholder="Write your post content here..."
          required
        />
      </div>
    </div>
  );
};

export default ContentEditor;

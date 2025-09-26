// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PostForm from "../postForm/PostForm";
// import apiService from "../../services/apiService";

// const NewPost = () => {
//   const navigate = useNavigate();
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (formData) => {
//     setSubmitting(true);
//     setError("");

//     try {
//       await apiService.createPost(formData);
//       navigate("/"); // lub gdzie chcesz przekierować po utworzeniu
//     } catch (err) {
//       console.error("Błąd przy tworzeniu posta:", err);
//       setError(err.response.data.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/");
//   };

//   return (
//     <div className="container">
//       <PostForm
//         title="Nowy post"
//         onSubmit={handleSubmit}
//         onCancel={handleCancel}
//         submitButtonText="Zapisz post"
//         loading={submitting}
//         error={error}
//         showCategoryAndTags={true}
//       />
//     </div>
//   );
// };

// export default NewPost;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import apiService from "../../services/apiService";
// import styles from "./NewPost.module.css";

// const NewPost = () => {
//   const navigate = useNavigate();
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // Form data
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     status: "DRAFT",
//     categoryId: "",
//     tagIds: new Set(),
//     image: null,
//   });

//   // Data for dropdowns
//   const [categories, setCategories] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [imagePreview, setImagePreview] = useState(null);

//   // Refs
//   const contentTextareaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   // Fetch categories and tags
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [categoriesData, tagsData] = await Promise.all([
//           apiService.getCategories(),
//           apiService.getTags(),
//         ]);
//         setCategories(categoriesData);
//         setTags(tagsData);
//       } catch (error) {
//         console.error("Błąd przy pobieraniu danych:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle tag selection
//   const handleTagChange = (tagId) => {
//     setFormData((prev) => {
//       const newTagIds = new Set(prev.tagIds);
//       if (newTagIds.has(tagId)) {
//         newTagIds.delete(tagId);
//       } else {
//         newTagIds.add(tagId);
//       }
//       return { ...prev, tagIds: newTagIds };
//     });
//   };

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         setError("Proszę wybrać plik graficzny");
//         return;
//       }

//       // Validate file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Plik jest za duży. Maksymalny rozmiar to 5MB");
//         return;
//       }

//       setFormData((prev) => ({ ...prev, image: file }));

//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(file);
//       setError(""); // Clear any previous errors
//     }
//   };

//   // Remove image
//   const handleImageRemove = () => {
//     setFormData((prev) => ({ ...prev, image: null }));
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // Insert formatting in textarea
//   const insertFormatting = (before, after = "") => {
//     const textarea = contentTextareaRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = formData.content.substring(start, end);

//     const newText =
//       formData.content.substring(0, start) +
//       before +
//       selectedText +
//       after +
//       formData.content.substring(end);

//     setFormData((prev) => ({ ...prev, content: newText }));

//     setTimeout(() => {
//       textarea.focus();
//       const newCursorPos =
//         start + before.length + selectedText.length + after.length;
//       textarea.setSelectionRange(newCursorPos, newCursorPos);
//     }, 0);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");

//     try {
//       const submitData = new FormData();

//       const postData = {
//         title: formData.title,
//         content: formData.content,
//         status: formData.status,
//         categoryId: formData.categoryId || null,
//         tagIds: Array.from(formData.tagIds),
//       };

//       submitData.append(
//         "post",
//         new Blob([JSON.stringify(postData)], {
//           type: "application/json",
//         })
//       );

//       if (formData.image) {
//         submitData.append("image", formData.image);
//       }

//       await apiService.createPost(submitData);
//       navigate("/");
//     } catch (err) {
//       console.error("Błąd przy tworzeniu posta:", err);
//       setError(
//         err.response?.data?.message || "Wystąpił błąd podczas zapisywania"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancel = () => navigate("/");

//   return (
//     <div className="container">
//       <div className={styles.container}>
//         <h1 className={styles.title}>Nowy post</h1>

//         {error && <div className="alert alert-error">{error}</div>}

//         <form onSubmit={handleSubmit} className={styles.form}>
//           {/* Basic fields */}
//           <div className={styles.row}>
//             <div className="form-group">
//               <label className="form-label">Tytuł</label>
//               <input
//                 type="text"
//                 name="title"
//                 className="form-input"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Status</label>
//               <select
//                 name="status"
//                 className="form-select"
//                 value={formData.status}
//                 onChange={handleInputChange}
//               >
//                 <option value="DRAFT">Szkic</option>
//                 <option value="PUBLISHED">Opublikowany</option>
//               </select>
//             </div>
//           </div>

//           {/* Category and tags */}
//           <div className={styles.row}>
//             <div className="form-group">
//               <label className="form-label">Kategoria</label>
//               <select
//                 name="categoryId"
//                 className="form-select"
//                 value={formData.categoryId}
//                 onChange={handleInputChange}
//               >
//                 <option value="">Wybierz kategorię</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Tagi</label>
//               <div className={styles.tagsContainer}>
//                 {tags.map((tag) => (
//                   <label key={tag.id} className={styles.tagCheckbox}>
//                     <input
//                       type="checkbox"
//                       checked={formData.tagIds.has(tag.id)}
//                       onChange={() => handleTagChange(tag.id)}
//                     />
//                     {tag.name}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Image upload */}
//           <div className="form-group">
//             <label className="form-label">Zdjęcie</label>
//             <div className={styles.imageUploadContainer}>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className={styles.imageInput}
//                 id="image-upload"
//               />
//               <label
//                 htmlFor="image-upload"
//                 className={styles.imageUploadButton}
//               >
//                 <span>Wybierz zdjęcie</span>
//               </label>

//               {imagePreview && (
//                 <div className={styles.imagePreview}>
//                   <img src={imagePreview} alt="Podgląd" />
//                   <button
//                     type="button"
//                     onClick={handleImageRemove}
//                     className={styles.imageRemoveButton}
//                   >
//                     ×
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Content editor */}
//           <div className={`form-group ${styles.fullWidth}`}>
//             <label className="form-label">Treść</label>
//             <div className={styles.editorContainer}>
//               <div className={styles.editorToolbar}>
//                 <button
//                   type="button"
//                   onClick={() => insertFormatting("**", "**")}
//                   title="Pogrubienie"
//                 >
//                   B
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => insertFormatting("*", "*")}
//                   title="Kursywa"
//                 >
//                   I
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => insertFormatting("# ")}
//                   title="Nagłówek"
//                 >
//                   H1
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => insertFormatting("## ")}
//                   title="Nagłówek 2"
//                 >
//                   H2
//                 </button>
//               </div>
//               <textarea
//                 ref={contentTextareaRef}
//                 name="content"
//                 className={`form-textarea ${styles.contentTextarea}`}
//                 value={formData.content}
//                 onChange={handleInputChange}
//                 placeholder="Wprowadź treść posta..."
//                 required
//               />
//             </div>
//           </div>

//           {/* Actions */}
//           <div className={styles.actions}>
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={handleCancel}
//             >
//               Anuluj
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={submitting}
//             >
//               {submitting ? "Zapisywanie..." : "Zapisz post"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewPost;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../../services/apiService";
import PostForm from "./PostForm";
import styles from "../styles/NewPost.module.css";

const NewPost = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "DRAFT",
    categoryId: "",
    tagIds: new Set(),
    image: null,
  });

  // Data for dropdowns
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const submitData = new FormData();

      const postData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        categoryId: formData.categoryId || null,
        tagIds: Array.from(formData.tagIds),
      };

      submitData.append(
        "post",
        new Blob([JSON.stringify(postData)], {
          type: "application/json",
        })
      );

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await apiService.createPost(submitData);
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Error saving the post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/");

  const handleFormDataChange = (newData) => {
    setFormData(newData);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="container">
      <div className={styles.container}>
        <h1 className={styles.title}>New post</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <PostForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          categories={categories}
          tags={tags}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default NewPost;

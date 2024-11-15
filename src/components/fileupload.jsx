import React, { useState } from 'react';
import '../styles/fileupload.css';
import { Link } from 'react-router-dom';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileType, setFileType] = useState('article'); // default to article
  const [title, setTitle] = useState(''); // title for the article
  const [content, setContent] = useState(''); // content/description for the article

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles) {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]); // Add file to FormData
      formData.append('title', title);
      formData.append('content', content);

      try {
        const response = await fetch('http://localhost:3000/coach/addArticle', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (response.ok) {
          console.log("Article uploaded successfully!");
        } else {
          console.error("Failed to upload article.");
        }
      } catch (error) {
        console.error("Error uploading article:", error);
      }
    } else {
      alert("Please select a file to upload");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload {fileType === 'article' ? 'Article' : 'Video'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <label className="file-label">
          Select File:
          <input
            type="file"
            accept={fileType === 'article' ? '.pdf,.docx' : 'video/*'}
            onChange={handleFileChange}
          />
        </label>
        <div className="type-selector">
          <label>
            <input
              type="radio"
              value="article"
              checked={fileType === 'article'}
              onChange={() => setFileType('article')}
            />
            Article
          </label>
          <label>
            <input
              type="radio"
              value="video"
              checked={fileType === 'video'}
              onChange={() => setFileType('video')}
            />
            Video
          </label>
        </div>
        <button type="submit" className="upload-btn">Upload</button>
      </form>
      <Link to="/CoachDashboard">
        <button className="back-btn">Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default FileUpload;

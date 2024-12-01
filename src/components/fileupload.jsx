import React, { useState } from 'react';
import '../styles/fileupload.css';
import { Link } from 'react-router-dom';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileType, setFileType] = useState('article'); // Default to article
  const [title, setTitle] = useState(''); // Title for the article/video
  const [content, setContent] = useState(''); // Content/description for the article/video
  const [uploadMessage, setUploadMessage] = useState(''); // Message to display upload status

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
        const endpoint =
          fileType === 'article'
            ? 'http://localhost:3000/coach/addArticle'
            : 'http://localhost:3000/coach/addVideo'; // Dynamic API endpoint

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          setUploadMessage(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully!`);
          setSelectedFiles(null);
          setTitle('');
          setContent('');
        } else {
          setUploadMessage(`Failed to upload ${fileType}.`);
        }
      } catch (error) {
        console.error(`Error uploading ${fileType}:`, error);
        setUploadMessage(`Error uploading ${fileType}.`);
      }
    } else {
      alert('Please select a file to upload');
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
          Content/Description:
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
            required
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
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      <Link to="/CoachDashboard">
        <button className="back-btn">Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default FileUpload;

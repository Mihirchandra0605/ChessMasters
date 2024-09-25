import React, { useState } from 'react';
import '../styles/fileupload.css';
import {Link} from 'react-router-dom'
const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileType, setFileType] = useState('article'); // default to article

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFiles) {
      // handle file upload logic here
      console.log(`Uploading ${fileType}:`, selectedFiles);
    } else {
      alert("Please select a file to upload");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload {fileType === 'article' ? 'Article' : 'Video'}</h2>
      <form onSubmit={handleSubmit}>
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
        <Link to="/CoachDashboard"><button type="submit" className="upload-btn">Upload</button></Link>
      </form>
    </div>
  );
};

export default FileUpload;

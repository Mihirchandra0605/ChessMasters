import React, { useState } from 'react';
// import '../styles/fileupload.css';
import { Link,useParams } from 'react-router-dom';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileType, setFileType] = useState('article'); // Default to article
  const [title, setTitle] = useState(''); // Title for the article/video
  const [content, setContent] = useState(''); // Content/description for the article/video
  const [uploadMessage, setUploadMessage] = useState(''); // Message to display upload status
  // const {coachId} = useParams();

  const coachId = localStorage.getItem('userId');

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
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg shadow-xl border border-indigo-200">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Upload {fileType === 'article' ? 'Article' : 'Video'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-indigo-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-indigo-700">Content/Description</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-2">Select File</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-300 border-dashed rounded-md bg-white">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-indigo-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-indigo-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-indigo-100 rounded-md font-medium text-indigo-700 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 p-2">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept={fileType === 'article' ? '.pdf,.docx' : 'video/*'}
                    onChange={handleFileChange}
                    required
                    className="sr-only"
                  />
                </label>
                <p className="pl-1 pt-2">or drag and drop</p>
              </div>
              <p className="text-xs text-indigo-500">
                {fileType === 'article' ? 'PDF or DOCX up to 10MB' : 'MP4, AVI, or MOV up to 100MB'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-indigo-50 p-4 rounded-md">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="article"
              checked={fileType === 'article'}
              onChange={() => setFileType('article')}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-indigo-700">Article</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="video"
              checked={fileType === 'video'}
              onChange={() => setFileType('video')}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2 text-indigo-700">Video</span>
          </label>
        </div>
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            Upload
          </button>
        </div>
      </form>
      {uploadMessage && <p className="mt-4 text-sm text-center text-green-600 bg-green-100 p-2 rounded-md">{uploadMessage}</p>}
      <Link to={`/coach/${coachId}/CoachDashboard?role=coach`} className="mt-6 block text-center">
        <button className="text-indigo-600 hover:text-indigo-500 bg-indigo-100 px-4 py-2 rounded-md transition duration-150 ease-in-out hover:bg-indigo-200">Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default FileUpload;

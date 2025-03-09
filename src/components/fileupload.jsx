import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileType, setFileType] = useState('article');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const coachId = localStorage.getItem('userId');

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles) {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('title', title);
      formData.append('content', content);

      try {
        const endpoint = fileType === 'article'
          ? 'http://localhost:3000/coach/addArticle'
          : 'http://localhost:3000/coach/addVideo';

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          credentials: 'include',
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
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto bg-white/90 backdrop-blur-sm 
                    rounded-xl sm:rounded-2xl shadow-xl border border-indigo-200 
                    p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-800 mb-4 sm:mb-6 text-center">
          Upload {fileType === 'article' ? 'Article' : 'Video'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm sm:text-base font-medium text-indigo-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border-indigo-300 shadow-sm 
                       focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                       focus:ring-opacity-50 bg-white p-2 sm:p-3 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm sm:text-base font-medium text-indigo-700 mb-1">
              Content/Description
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="4"
              className="mt-1 block w-full rounded-lg border-indigo-300 shadow-sm 
                       focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                       focus:ring-opacity-50 bg-white p-2 sm:p-3 text-sm sm:text-base"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-indigo-700 mb-2">
              Select File
            </label>
            <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 
                          border-2 border-indigo-300 border-dashed rounded-lg bg-white">
              <div className="space-y-2 text-center">
                <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-indigo-400" 
                     stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-indigo-600 gap-2">
                  <label htmlFor="file-upload" 
                         className="relative cursor-pointer bg-indigo-100 rounded-md font-medium 
                                  text-indigo-700 hover:text-indigo-500 focus-within:outline-none 
                                  focus-within:ring-2 focus-within:ring-offset-2 
                                  focus-within:ring-indigo-500 p-2">
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
                  <p className="text-sm sm:text-base">or drag and drop</p>
                </div>
                <p className="text-xs sm:text-sm text-indigo-500">
                  {fileType === 'article' ? 'PDF or DOCX up to 10MB' : 'MP4, AVI, or MOV up to 100MB'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-indigo-50 p-3 sm:p-4 rounded-lg">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="article"
                checked={fileType === 'article'}
                onChange={() => setFileType('article')}
                className="form-radio text-indigo-600 h-4 w-4 sm:h-5 sm:w-5"
              />
              <span className="ml-2 text-sm sm:text-base text-indigo-700">Article</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="video"
                checked={fileType === 'video'}
                onChange={() => setFileType('video')}
                className="form-radio text-indigo-600 h-4 w-4 sm:h-5 sm:w-5"
              />
              <span className="ml-2 text-sm sm:text-base text-indigo-700">Video</span>
            </label>
          </div>

          <button type="submit" 
                  className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent 
                           rounded-lg shadow-sm text-sm sm:text-base font-medium text-white 
                           bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 
                           ease-in-out">
            Upload
          </button>
        </form>

        {uploadMessage && (
          <p className="mt-4 text-sm sm:text-base text-center text-green-600 
                       bg-green-100 p-2 sm:p-3 rounded-lg">
            {uploadMessage}
          </p>
        )}

        <Link to={`/coach/${coachId}/CoachDashboard?role=coach`} 
              className="mt-4 sm:mt-6 block text-center">
          <button className="text-indigo-600 hover:text-indigo-500 bg-indigo-100 
                           px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition duration-150 
                           ease-in-out hover:bg-indigo-200 text-sm sm:text-base w-full">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FileUpload;

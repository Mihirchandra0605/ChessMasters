import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mihirBackend } from '../../config.js';

const VideoUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      const token = document.cookie.split("=")[1];
      try {
        const response = await axios.get(`${mihirBackend}/coach/Videodetail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        
        setVideo(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Failed to load video details. Please try again.');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check file type
      const fileType = selectedFile.type;
      const validTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
      
      // Check file size (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      
      if (!validTypes.includes(fileType)) {
        setError('Please select an MP4, AVI, or MOV file.');
        e.target.value = ''; // Reset file input
        return;
      }
      
      if (selectedFile.size > maxSize) {
        setError('File size exceeds 100MB limit.');
        e.target.value = ''; // Reset file input
        return;
      }
      
      setFile(selectedFile);
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const token = document.cookie.split("=")[1];
    
    // Create form data for file upload
    const updateData = new FormData();
    updateData.append('title', formData.title);
    updateData.append('content', formData.content);
    if (file) {
      updateData.append('file', file);
    }

    try {
      console.log('Sending video update request with data:', {
        title: formData.title,
        content: formData.content,
        hasFile: !!file
      });
      
      const response = await axios.put(
        `${mihirBackend}/coach/video/${id}`,
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      console.log('Update response:', response.data);
      setSuccessMessage('Video updated successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/coach/${video.coach}/CoachDashboard`);
      }, 10);
    } catch (error) {
      console.error('Error updating video:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to update video. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(`/coach/${video.coach}/CoachDashboard`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-teal-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Update Video</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {successMessage}
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Update Video File (Optional)
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="video/mp4,video/avi,video/quicktime"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Current file: {video.filePath.split('/').pop()}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Only MP4, AVI, or MOV files up to 100MB are accepted
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Update Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUpdate; 
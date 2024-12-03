import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // To access the article ID from the URL

const VideoDetail = () => {
  const { id } = useParams();  // Get the article ID from the URL
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // Fetch the article details based on the ID from the URL
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/coach/VideoDetail/${id}`, {
          method: 'GET',
          credentials: 'include',  // Ensure the cookies (for session) are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setVideo(data);
        } else {
          console.error('Failed to fetch article');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchVideo();
  }, [id]); // Re-run the effect when the ID changes

  if (!video) return <div>Loading...</div>;
  let path = video.filePath
  let newPath = "../../Backend/" + path;

  return (
    <div>
      <h1>{video.title}</h1>  
      <p>{video.content}</p>
      <a href={newPath} target="_blank" rel="noopener noreferrer">
        Download Video
      </a>
    </div>
  );
};

export default VideoDetail;

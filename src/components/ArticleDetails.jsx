import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // To access the article ID from the URL

const ArticleDetail = () => {
  const { id } = useParams();  // Get the article ID from the URL
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Fetch the article details based on the ID from the URL
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/coach/ArticleDetail/${id}`, {
          method: 'GET',
          credentials: 'include',  // Ensure the cookies (for session) are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          console.error('Failed to fetch article');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [id]); // Re-run the effect when the ID changes

  if (!article) return <div>Loading...</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <a href={article.filePath} target="_blank" rel="noopener noreferrer">
        Download Article
      </a>
    </div>
  );
};

export default ArticleDetail;

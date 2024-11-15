import React, { useState, useEffect } from "react";
import "../styles/AddDetails.css";

const AddCoachForm = () => {
  const [formData, setFormData] = useState({
    quote: "",
    location: "",
    languages: "",
    rating: "",
    hourlyRate: "",
    aboutMe: "",
    playingExperience: "",
    teachingExperience: "",
    teachingMethodology: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the coach profile data
  useEffect(() => {
    const fetchCoachProfile = async () => {
      const token = document.cookie.split("=")[1];
      console.log(token);
      try {
        const response = await fetch(`http://localhost:3000/coach/details`, {
          credentials: "include",
          method: "GET",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        // Safely handle array fields
        const languages = Array.isArray(data.languages)
          ? data.languages.join(", ")
          : data.languages || "";

        setFormData({
          quote: data.quote || "",
          location: data.location || "",
          languages: languages,
          rating: data.rating || "",
          hourlyRate: data.hourlyRate || "",
          aboutMe: data.aboutMe || "",
          playingExperience: data.playingExperience || "",
          teachingExperience: data.teachingExperience || "",
          teachingMethodology: data.teachingMethodology || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coach profile:", error);
        setError("Failed to load coach profile");
        setLoading(false);
      }
    };

    fetchCoachProfile();
    console.log("Fetched profile");
  }, []);

  // Handle change for input fields
  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert languages, playingExperience, and teachingExperience to arrays
      const formattedData = {
        ...formData,
        languages: formData.languages
          ? formData.languages.split(",").map((lang) => lang.trim())
          : [],
      };
      console.log("Formatted Data to Send:", formattedData); // Debugging line
      const token = document.cookie.split("=")[1];
      const response = await fetch(`http://localhost:3000/coach/completeProfile`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating profile");
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);
      // Optionally, provide user feedback or redirect
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Error updating profile");
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Quote:</label>
        <input
          type="text"
          name="quote"
          value={formData.quote}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Languages (comma separated):</label>
        <input
          type="text"
          name="languages"
          value={formData.languages}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Rating:</label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Hourly Rate ($):</label>
        <input
          type="number"
          name="hourlyRate"
          value={formData.hourlyRate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>About Me:</label>
        <textarea
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <div>
        <label>Playing Experience (one per line):</label>
        <textarea
          name="playingExperience"
          value={formData.playingExperience}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <div>
        <label>Teaching Experience (one per line):</label>
        <textarea
          name="teachingExperience"
          value={formData.teachingExperience}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <div>
        <label>Teaching Methodology:</label>
        <textarea
          name="teachingMethodology"
          value={formData.teachingMethodology}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddCoachForm;

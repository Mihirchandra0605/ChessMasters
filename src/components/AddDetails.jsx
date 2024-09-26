import React, { useState } from "react";
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

  // Handle change for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert languages, playingExperience, and teachingExperience to arrays
    const formattedData = {
      ...formData,
      languages: formData.languages.split(",").map((lang) => lang.trim()),
      playingExperience: formData.playingExperience
        .split("\n")
        .map((exp) => exp.trim()),
      teachingExperience: formData.teachingExperience
        .split("\n")
        .map((exp) => exp.trim()),
    };

    console.log("Form data:", formattedData);

    // Here, you can send the `formattedData` to the backend using fetch or axios
    // Example:
    // fetch("http://your-backend-api-url.com/coaches", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formattedData),
    // }).then(response => {
    //   if (response.ok) {
    //     alert("Coach added successfully!");
    //   }
    // });
  };

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

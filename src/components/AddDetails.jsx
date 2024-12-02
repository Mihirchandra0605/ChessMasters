import React, { useState, useEffect } from "react";
// import "../styles/AddDetails.css";

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
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Convert languages, playingExperience, and teachingExperience to arrays
  //     const formattedData = {
  //       ...formData,
  //       languages: formData.languages
  //         ? formData.languages.split(",").map((lang) => lang.trim())
  //         : [],
  //     };
  //     console.log("Formatted Data to Send:", formattedData); // Debugging line
  //     const token = document.cookie.split("=")[1];
  //     const response = await fetch(`http://localhost:3000/coach/completeProfile`, {
  //       credentials: "include",
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // Include token in the headers
  //       },
  //       body: JSON.stringify(formattedData),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Error updating profile");
  //     }

  //     const result = await response.json();
  //     console.log("Profile updated successfully:", result);
  //     // Optionally, provide user feedback or redirect
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     setError(error.message || "Error updating profile");
  //   }
  // };
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
  
      // Reset form fields
      setFormData({
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
  
      // Optionally, provide user feedback or redirect
      alert("Profile updated successfully!");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h2 className="text-3xl font-extrabold text-center text-purple-600 mb-8">
            Coach Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-purple-600">
                  Quote
                </label>
                <input
                  type="text"
                  name="quote"
                  id="quote"
                  value={formData.quote}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-purple-600">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-purple-600">
                  Languages (comma separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  id="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-purple-600">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-purple-600">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  id="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-purple-600">
                About Me
              </label>
              <textarea
                name="aboutMe"
                id="aboutMe"
                rows="4"
                value={formData.aboutMe}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="playingExperience" className="block text-sm font-medium text-purple-600">
                Playing Experience (one per line)
              </label>
              <textarea
                name="playingExperience"
                id="playingExperience"
                rows="4"
                value={formData.playingExperience}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="teachingExperience" className="block text-sm font-medium text-purple-600">
                Teaching Experience (one per line)
              </label>
              <textarea
                name="teachingExperience"
                id="teachingExperience"
                rows="4"
                value={formData.teachingExperience}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="teachingMethodology" className="block text-sm font-medium text-purple-600">
                Teaching Methodology
              </label>
              <textarea
                name="teachingMethodology"
                id="teachingMethodology"
                rows="4"
                value={formData.teachingMethodology}
                onChange={handleChange}
                required
                className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCoachForm;

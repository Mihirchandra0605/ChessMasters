// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link ,useParams} from "react-router-dom";
// // import "../styles/AddDetails.css";

// const AddCoachForm = () => {
//   const [formData, setFormData] = useState({
//     quote: "",
//     location: "",
//     languages: "",
//     rating: "",
//     hourlyRate: "",
//     aboutMe: "",
//     playingExperience: "",
//     teachingExperience: "",
//     teachingMethodology: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const coachId = localStorage.getItem('userId');

//   // Fetch the coach profile data
//   useEffect(() => {
//     const fetchCoachProfile = async () => {
//       const token = document.cookie.split("=")[1];
//       console.log(token);
//       try {
//         const response = await fetch(`http://localhost:3000/coach/details`, {
//           credentials: "include",
//           method: "GET",
//           headers: {
//             // "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch profile data");
//         }

//         const data = await response.json();
//         console.log('Fetched data:', data);

//         // Safely handle array fields
//         const languages = Array.isArray(data.languages)
//           ? data.languages.join(", ")
//           : data.languages || "";

//         setFormData({
//           quote: data.quote || "",
//           location: data.location || "",
//           languages: languages,
//           rating: data.rating || "",
//           hourlyRate: data.hourlyRate || "",
//           aboutMe: data.aboutMe || "",
//           playingExperience: data.playingExperience || "",
//           teachingExperience: data.teachingExperience || "",
//           teachingMethodology: data.teachingMethodology || "",
//         });
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching coach profile:", error);
//         setError("Failed to load coach profile");
//         setLoading(false);
//       }
//     };

//     fetchCoachProfile();
//     console.log("Fetched profile");
//   }, []);

//   // Handle change for input fields
//   const handleChange = (e) => {
//     console.log(e.target);
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     // Convert languages, playingExperience, and teachingExperience to arrays
//   //     const formattedData = {
//   //       ...formData,
//   //       languages: formData.languages
//   //         ? formData.languages.split(",").map((lang) => lang.trim())
//   //         : [],
//   //     };
//   //     console.log("Formatted Data to Send:", formattedData); // Debugging line
//   //     const token = document.cookie.split("=")[1];
//   //     const response = await fetch(`http://localhost:3000/coach/completeProfile`, {
//   //       credentials: "include",
//   //       method: "PUT",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${token}`, // Include token in the headers
//   //       },
//   //       body: JSON.stringify(formattedData),
//   //     });

//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       throw new Error(errorData.message || "Error updating profile");
//   //     }

//   //     const result = await response.json();
//   //     console.log("Profile updated successfully:", result);
//   //     // Optionally, provide user feedback or redirect
//   //   } catch (error) {
//   //     console.error("Error updating profile:", error);
//   //     setError(error.message || "Error updating profile");
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Convert languages, playingExperience, and teachingExperience to arrays
//       const formattedData = {
//         ...formData,
//         languages: formData.languages
//           ? formData.languages.split(",").map((lang) => lang.trim())
//           : [],
//       };
//       console.log("Formatted Data to Send:", formattedData); // Debugging line
//       const token = document.cookie.split("=")[1];
//       const response = await fetch(`http://localhost:3000/coach/completeProfile`, {
//         credentials: "include",
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Include token in the headers
//         },
//         body: JSON.stringify(formattedData),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Error updating profile");
//       }
  
//       const result = await response.json();
//       console.log("Profile updated successfully:", result);
  
//       // Reset form fields
//       setFormData({
//         quote: "",
//         location: "",
//         languages: "",
//         rating: "",
//         hourlyRate: "",
//         aboutMe: "",
//         playingExperience: "",
//         teachingExperience: "",
//         teachingMethodology: "",
//       });
  
//       // Optionally, provide user feedback or redirect
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setError(error.message || "Error updating profile");
//     }
//   };
  

//   if (loading) {
//     return <div>Loading profile...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
//         <div className="px-6 py-8 sm:p-10">
//           <h2 className="text-3xl font-extrabold text-center text-purple-600 mb-8">
//             Coach Profile
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
//               <div>
//                 <label htmlFor="quote" className="block text-sm font-medium text-purple-600">
//                   Quote
//                 </label>
//                 <input
//                   type="text"
//                   name="quote"
//                   id="quote"
//                   value={formData.quote}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-purple-600">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   name="location"
//                   id="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="languages" className="block text-sm font-medium text-purple-600">
//                   Languages (comma separated)
//                 </label>
//                 <input
//                   type="text"
//                   name="languages"
//                   id="languages"
//                   value={formData.languages}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="rating" className="block text-sm font-medium text-purple-600">
//                   Rating
//                 </label>
//                 <input
//                   type="number"
//                   name="rating"
//                   id="rating"
//                   value={formData.rating}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="hourlyRate" className="block text-sm font-medium text-purple-600">
//                   Hourly Rate ($)
//                 </label>
//                 <input
//                   type="number"
//                   name="hourlyRate"
//                   id="hourlyRate"
//                   value={formData.hourlyRate}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="aboutMe" className="block text-sm font-medium text-purple-600">
//                 About Me
//               </label>
//               <textarea
//                 name="aboutMe"
//                 id="aboutMe"
//                 rows="4"
//                 value={formData.aboutMe}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               ></textarea>
//             </div>
//             <div>
//               <label htmlFor="playingExperience" className="block text-sm font-medium text-purple-600">
//                 Playing Experience (one per line)
//               </label>
//               <textarea
//                 name="playingExperience"
//                 id="playingExperience"
//                 rows="4"
//                 value={formData.playingExperience}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               ></textarea>
//             </div>
//             <div>
//               <label htmlFor="teachingExperience" className="block text-sm font-medium text-purple-600">
//                 Teaching Experience (one per line)
//               </label>
//               <textarea
//                 name="teachingExperience"
//                 id="teachingExperience"
//                 rows="4"
//                 value={formData.teachingExperience}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               ></textarea>
//             </div>
//             <div>
//               <label htmlFor="teachingMethodology" className="block text-sm font-medium text-purple-600">
//                 Teaching Methodology
//               </label>
//               <textarea
//                 name="teachingMethodology"
//                 id="teachingMethodology"
//                 rows="4"
//                 value={formData.teachingMethodology}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               ></textarea>
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
//               >
//                 Submit
//               </button>
//               <Link to={`/coach/${coachId}/CoachDashboard`} className="mt-6 block text-center">
//                   <button className="text-indigo-600 hover:text-indigo-500 bg-indigo-100 px-4 py-2 rounded-md transition duration-150 ease-in-out hover:bg-indigo-200">Back to Dashboard</button>
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCoachForm;







import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const coachId = localStorage.getItem("userId");

    const validateField = (name, value) => {
        let errorMessage = "";
        if (name === "quote" && (!value || value.length < 5)) {
            errorMessage = "Quote must be at least 5 characters long.";
        } else if (name === "location" && !value) {
            errorMessage = "Location is required.";
        } else if (name === "languages" && (!value || value.split(",").length < 1)) {
            errorMessage = "Please specify at least one language.";
        } else if (name === "rating" && (isNaN(value) || value < 1 || value > 5)) {
            errorMessage = "Rating must be a number between 1 and 5.";
        } else if (name === "hourlyRate" && (isNaN(value) || value <= 0)) {
            errorMessage = "Hourly Rate must be a positive number.";
        } else if (name === "aboutMe" && (!value || value.length < 10)) {
            errorMessage = "About Me must be at least 10 characters long.";
        } else if (
            ["playingExperience", "teachingExperience"].includes(name) &&
            (isNaN(value) || value < 0)
        ) {
            errorMessage = `${name.replace(/([A-Z])/g, " $1")} must be a positive number.`;
        } else if (name === "teachingMethodology" && (!value || value.length < 10)) {
            errorMessage = "Teaching Methodology must be at least 10 characters long.";
        }
        return errorMessage;
    };

    const validateForm = () => {
        const validationErrors = {};
        Object.keys(formData).forEach((key) => {
            const errorMessage = validateField(key, formData[key]);
            if (errorMessage) {
                validationErrors[key] = errorMessage;
            }
        });
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    useEffect(() => {
        const fetchCoachProfile = async () => {
            const wasSubmitted = localStorage.getItem("formSubmitted");
            if (wasSubmitted) {
                setLoading(false);
                return;
            }

            const token = document.cookie.split("=")[1];
            try {
                const response = await fetch(`http://localhost:3000/coach/details`, {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }
                const data = await response.json();
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
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        const errorMessage = validateField(name, value);
        setErrors({
            ...errors,
            [name]: errorMessage,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const formattedData = {
                ...formData,
                languages: formData.languages
                    ? formData.languages.split(",").map((lang) => lang.trim())
                    : [],
            };
            const token = document.cookie.split("=")[1];
            const response = await fetch(`http://localhost:3000/coach/completeProfile`, {
                credentials: "include",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formattedData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error updating profile");
            }

            // Clear server-side data
            await fetch(`http://localhost:3000/coach/clearProfile`, {
                credentials: "include",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.setItem("formSubmitted", "true");
            alert("Profile updated successfully!");
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
            setErrors({});
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error.message || "Error updating profile");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg sm:text-xl text-purple-600">
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg sm:text-xl text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center text-purple-600 mb-6">
                        Coach Profile
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {Object.keys(formData).map((field) => (
                            <div key={field} className="flex flex-col space-y-1">
                                <label
                                    htmlFor={field}
                                    className="block text-xs sm:text-sm font-medium text-purple-600"
                                >
                                    {field.replace(/([A-Z])/g, " $1")}
                                </label>
                                {["playingExperience", "teachingExperience"].includes(field) ? (
                                    <input
                                        type="number"
                                        name={field}
                                        id={field}
                                        min="0"
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-1.5 sm:py-2 px-2 sm:px-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                    />
                                ) : field === "aboutMe" || field === "teachingMethodology" ? (
                                    <textarea
                                        name={field}
                                        id={field}
                                        rows="3"
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-1.5 sm:py-2 px-2 sm:px-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-y"
                                    />
                                ) : (
                                    <input
                                        type={["rating", "hourlyRate"].includes(field) ? "number" : "text"}
                                        name={field}
                                        id={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full bg-blue-50 border border-purple-300 rounded-md shadow-sm py-1.5 sm:py-2 px-2 sm:px-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                    />
                                )}
                                {errors[field] && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field]}</p>
                                )}
                            </div>
                        ))}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                className="w-full sm:w-2/3 flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                            >
                                Submit
                            </button>
                            <Link to={`/coach/${coachId}/CoachDashboard`} className="w-full sm:w-1/3">
                                <button className="w-full text-indigo-600 hover:text-indigo-500 bg-indigo-100 px-4 py-2 sm:py-3 rounded-md transition-all duration-200 hover:bg-indigo-200 text-sm sm:text-base">
                                    Back to Dashboard
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCoachForm;



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { mihirBackend } from "../../config.js";

const UpdateProfile = () => {
    const navigate = useNavigate();
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
    const [success, setSuccess] = useState("");
    const coachId = useSelector((state) => state.user.userId);

    const validateField = (name, value) => {
        let errorMessage = "";
        if (name === "quote" && value && value.length < 5) {
            errorMessage = "Quote must be at least 5 characters long.";
        } else if (name === "languages" && value && value.split(",").length < 1) {
            errorMessage = "Please specify at least one language.";
        } else if (name === "rating" && value && 
                  ((isNaN(value) || (value !== "0" && (value < 1400 || value > 3000))))) {
            errorMessage = "Rating must be a number between 1400 and 3000, or exactly 0.";
        } else if (name === "hourlyRate" && value && (isNaN(value) || value <= 0)) {
            errorMessage = "Hourly Rate must be a positive number.";
        } else if (name === "aboutMe" && value && value.length < 10) {
            errorMessage = "About Me must be at least 10 characters long.";
        } else if (
            ["playingExperience", "teachingExperience"].includes(name) &&
            value && (isNaN(value) || value < 0)
        ) {
            errorMessage = `${name.replace(/([A-Z])/g, " $1")} must be a positive number.`;
        } else if (name === "teachingMethodology" && value && value.length < 10) {
            errorMessage = "Teaching Methodology must be at least 10 characters long.";
        }
        return errorMessage;
    };

    const validateForm = () => {
        const validationErrors = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key]) { // Only validate fields that have been filled
                const errorMessage = validateField(key, formData[key]);
                if (errorMessage) {
                    validationErrors[key] = errorMessage;
                }
            }
        });
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    useEffect(() => {
        const fetchCoachProfile = async () => {
            try {
                // Get token more reliably
                let token;
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name === 'authorization') {
                        token = value;
                        break;
                    }
                }
                
                if (!token) {
                    console.error("No token found in cookies");
                    setError("Authentication error: No token found");
                    setLoading(false);
                    return;
                }
                
                console.log("Using token:", token);
                
                const response = await fetch(`${mihirBackend}/coach/details`, {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                });
                
                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                    throw new Error(`Failed to fetch profile data: ${response.status} ${errorText}`);
                }
                
                const data = await response.json();
                console.log("Fetched data:", data);
                
                // Check if profile is completed, redirect if not
                if (!data.quote || !data.location || !data.languages || !data.rating || 
                    !data.hourlyRate || !data.aboutMe || !data.playingExperience || 
                    !data.teachingExperience || !data.teachingMethodology) {
                    setError("Please complete your profile first before updating it.");
                    setTimeout(() => {
                        navigate('/AddData');
                    }, 2000);
                    return;
                }
                
                // Format languages for the form
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
    }, [navigate]);

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
        
        setSuccess("");
        setError("");
        
        try {
            // Only include fields that have been changed
            const updatedFields = {};
            for (const key in formData) {
                if (formData[key]) {
                    updatedFields[key] = formData[key];
                }
            }

            // Format languages if it exists
            if (updatedFields.languages) {
                updatedFields.languages = updatedFields.languages
                    .split(",")
                    .map((lang) => lang.trim())
                    .filter(lang => lang);
            }
            
            // Get token more reliably
            let token;
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'authorization') {
                    token = value;
                    break;
                }
            }
            
            if (!token) {
                console.error("No token found in cookies");
                setError("Authentication error: No token found");
                return;
            }
            
            console.log("Using token for profile update:", token);
            console.log("Updating profile with data:", updatedFields);
            
            // Use the completeProfile endpoint instead of updateProfile
            const response = await fetch(`${mihirBackend}/coach/completeProfile`, {
                credentials: "include",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updatedFields),
            });
            
            console.log("Profile update response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || "Error updating profile");
                } catch (jsonError) {
                    throw new Error(`Error updating profile: ${response.status} ${errorText}`);
                }
            }

            setSuccess("Profile updated successfully!");
            setTimeout(() => {
                navigate(`/coach/${coachId}/CoachDashboard`);
            }, 10);
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error.message || "Error updating profile");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
            </div>
        );
    }

    if (error && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col space-y-4 p-4">
                <div className="text-red-500 text-lg text-center">{error}</div>
                <Link to={`/coach/${coachId}/CoachDashboard`} className="text-indigo-600 hover:text-indigo-500 bg-indigo-100 px-4 py-2 rounded-lg transition duration-150 ease-in-out hover:bg-indigo-200">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-blue-500 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center text-indigo-600 mb-6">
                        Update Coach Profile
                    </h2>
                    
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            {success}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {Object.keys(formData).map((field) => (
                            <div key={field} className="flex flex-col space-y-1">
                                <label
                                    htmlFor={field}
                                    className="block text-xs sm:text-sm font-medium text-indigo-600"
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
                                        className="mt-1 block w-full bg-blue-50 border border-indigo-300 rounded-md shadow-sm py-1.5 sm:py-2 px-2 sm:px-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                    />
                                ) : field === "aboutMe" || field === "teachingMethodology" ? (
                                    <textarea
                                        name={field}
                                        id={field}
                                        rows="3"
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="mt-1 block w-full bg-blue-50 border border-indigo-300 rounded-md shadow-sm py-1.5 sm:py-2 px-2 sm:px-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-y"
                                    />
                                ) : (
                                    <input
                                        type={["rating", "hourlyRate"].includes(field) ? "number" : "text"}
                                        name={field}
                                        id={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="mt-1 block w-full bg-blue-50 border border-indigo-300 rounded-md shadow-sm py-1.5 sm:py-2 px-2 sm:px-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
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
                                className="w-full sm:w-2/3 flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                Update Profile
                            </button>
                            <Link to={`/coach/${coachId}/CoachDashboard`} className="w-full sm:w-1/3">
                                <button type="button" className="w-full text-indigo-600 hover:text-indigo-500 bg-indigo-100 px-4 py-2 sm:py-3 rounded-md transition-all duration-200 hover:bg-indigo-200 text-sm sm:text-base">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile; 
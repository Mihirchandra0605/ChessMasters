import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setError, clearError } from "../redux/errorSlice";
import { mihirBackend } from "../../config.js"

const AddCoachForm = () => {
    const dispatch = useDispatch();
    const coachId = useSelector((state) => state.user.userId);
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

    const validateField = (name, value) => {
        let errorMessage = "";
        if (name === "quote" && (!value || value.length < 5)) {
            errorMessage = "Quote must be at least 5 characters long.";
        } else if (name === "location" && !value) {
            errorMessage = "Location is required.";
        } else if (name === "languages" && (!value || value.split(",").length < 1)) {
            errorMessage = "Please specify at least one language.";
        } else if (name === "rating" && 
                  ((isNaN(value) || (value !== "0" && (value < 1400 || value > 3000))))) {
            errorMessage = "Rating must be a number between 1400 and 3000, or exactly 0.";
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
            try {
                const response = await fetch(`http://${mihirBackend}/coach/details`, {
                    credentials: "include",
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                const languages = Array.isArray(data.languages) ? data.languages.join(", ") : data.languages || "";

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
                dispatch(clearError());
            } catch (error) {
                dispatch(setError(error.message));
                setLoading(false);
            }
        };

        fetchCoachProfile();
    }, [dispatch]);

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
        try {
            const formattedData = {
                ...formData,
                languages: formData.languages.split(",").map((lang) => lang.trim()),
            };

            const response = await fetch(`http://${mihirBackend}/coach/completeProfile`, {
                credentials: "include",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error("Error updating profile");
            }

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
            dispatch(setError(error.message));
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



import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavbarPlay from "./navbarplay";
// import styles from "../styles/Coachdash.module.css";
import axios from "axios";

const Coachdash = () => {
  const { id } = useParams(); // Extract coach ID from the route
  const [profileData, setProfileData] = useState(null); // State to store coach profile data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for fetch failures

  useEffect(() => {
    const fetchCoachDetails = async () => {
      try {
        // Fetch coach details from API
        const response = await axios.get(`http://localhost:3000/coach/${id}`);
        setProfileData(response.data); // Update state with API response
      } catch (err) {
        setError("Error fetching coach details"); // Handle errors
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchCoachDetails(); // Trigger the API call
  }, [id]);

  if (loading) return <p>Loading...</p>; // Display loading state
  if (error) return <p>{error}</p>; // Display error state

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavbarPlay />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8 space-y-8">
            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
              <p className="text-gray-600">{profileData?.aboutMe|| "Information not available."}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Playing Experience</h2>
              <p className="text-gray-600">{profileData?.playingExperience|| "Information not available."}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Teaching Experience</h2>
              <p className="text-gray-600">{profileData?.teachingExperience|| "Information not available."}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Teaching Methodology</h2>
              <p className="text-gray-600">{profileData?.teachingMethodology || "Information not available."}</p>
            </section>
           
            <Link to={"/pricingplans?coachId=${id}"} 
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
              Subscribe
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coachdash;




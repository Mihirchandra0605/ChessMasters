import { useState, useEffect, useRef } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { mihirBackend } from '../../config.js';

const Profile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '********'
  });
  const [eloData, setEloData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribedCoaches, setSubscribedCoaches] = useState([]);
  const [updateMessage, setUpdateMessage] = useState('');
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    coachId: null,
    coachName: '',
    daysRemaining: 0
  });
  const [deleteAccountDialog, setDeleteAccountDialog] = useState({
    isOpen: false
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPlayerDetails = async () => {
      const token = document.cookie.split("=")[1];
      try {
        const response = await axios.get(`http://${mihirBackend}/auth/details`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        if (isMounted) {
          const player = response.data;
          setFormData({
            name: player.UserName,
            email: player.Email,
            password: '********'
          });
          setEloData(player.eloHistory || []);
          setLoading(false);

          const coachesResponse = await axios.get(
            `http://${mihirBackend}/player/${id}/subscribedCoaches`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          console.log('coach',coachesResponse.data)
          if (isMounted) setSubscribedCoaches(coachesResponse.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching player details:', error);
          setLoading(false);
        }
      }
    };

    fetchPlayerDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleEdit = async (field) => {
    // If currently editing and trying to save
    if (isEditing[field]) {
      const token = document.cookie.split("=")[1];
      
      try {
        // Map frontend field names to backend field names
        const fieldMapping = {
          name: 'UserName',
          email: 'Email',
          password: 'Password'
        };
        
        // Only send the field being updated
        const updateData = {
          [fieldMapping[field]]: formData[field]
        };
        
        // Send update request to backend
        const response = await axios.put(
          `http://${mihirBackend}/player/update-profile`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        
        // If password was updated, reset it to asterisks in the UI
        if (field === 'password') {
          setFormData({
            ...formData,
            password: '********'
          });
        }
        
        // Show success message
        setUpdateMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setUpdateMessage('');
        }, 3000);
        
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        setUpdateMessage(`Failed to update ${field}. Please try again.`);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setUpdateMessage('');
        }, 3000);
      }
    }
    
    // Toggle editing state
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const coachScrollContainerRef = useRef(null);

  const handleUnsubscribe = async (coachUserId) => {
    const token = document.cookie.split("=")[1];

    // Debugging Log
    console.log("Attempting to unsubscribe from coach userId:", coachUserId);

    try {
      const response = await axios.post(
        `http://${mihirBackend}/player/unsubscribe`,
        { coachId: coachUserId },  // Send the user ID of the coach
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      console.log("Unsubscribe response:", response.data);
      
      // Update the UI by removing the unsubscribed coach
      setSubscribedCoaches(subscribedCoaches.filter(coach => coach.user._id !== coachUserId));

    } catch (error) {
      console.error('Error unsubscribing from coach:', error);
    }
  };

  const handleUnsubscribeClick = (coachUserId, coachName, subscribedAt) => {
    // Calculate days remaining in subscription
    let daysRemaining = 0;
    
    if (subscribedAt) {
      const subscriptionDate = new Date(subscribedAt);
      const today = new Date();
      
      // Assume subscription is for 30 days from the subscription date
      const subscriptionEndDate = new Date(subscriptionDate);
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
      
      // Calculate days remaining (round down to nearest whole day)
      daysRemaining = Math.max(0, Math.floor((subscriptionEndDate - today) / (1000 * 60 * 60 * 24)));
    } else {
      // Default to -1 days if subscribedAt is null
      daysRemaining = -1;
    }
    
    // Show custom confirmation dialog
    setConfirmationDialog({
      isOpen: true,
      coachId: coachUserId,
      coachName: coachName,
      daysRemaining: daysRemaining
    });
  };

  const confirmUnsubscribe = () => {
    // Call the existing unsubscribe handler with the coach ID from state
    handleUnsubscribe(confirmationDialog.coachId);
    // Close the dialog
    setConfirmationDialog({ isOpen: false, coachId: null, coachName: '', daysRemaining: 0 });
  };

  const cancelUnsubscribe = () => {
    // Just close the dialog
    setConfirmationDialog({ isOpen: false, coachId: null, coachName: '', daysRemaining: 0 });
  };

  const handleDeleteAccount = () => {
    setDeleteAccountDialog({ isOpen: true });
  };

  const confirmDeleteAccount = async () => {
    const token = document.cookie.split("=")[1];
    
    try {
      // First unsubscribe from all coaches
      for (const coach of subscribedCoaches) {
        await handleUnsubscribe(coach.user._id);
      }
      
      // Then delete the account
      const response = await axios.delete(
        `http://${mihirBackend}/player/delete-account`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      // Redirect to login page after successful deletion
      if (response.status === 200) {
        window.location.href = '/'; // Redirect to login page
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setUpdateMessage('Failed to delete account. Please try again.');
      setTimeout(() => {
        setUpdateMessage('');
      }, 3000);
    }
    
    // Close the dialog
    setDeleteAccountDialog({ isOpen: false });
  };

  const cancelDeleteAccount = () => {
    // Just close the dialog
    setDeleteAccountDialog({ isOpen: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"> Loading... </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-blue-900 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      {/* Delete Account Confirmation Dialog */}
      {deleteAccountDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-700 animate-fadeIn">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Delete Account</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <p className="text-slate-300 mb-6">
              By confirming, you understand that:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
              <li>You will need to register again to use our services</li>
              <li>All active subscriptions will be automatically terminated</li>
              <li>Subscription fees are non-refundable</li>
              <li>Your account data and history will be permanently removed</li>
            </ul>
            <div className="flex space-x-4 justify-end">
              <button 
                onClick={cancelDeleteAccount}
                className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition duration-300 shadow-md"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {confirmationDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-700 animate-fadeIn">
            <h3 className="text-xl font-semibold text-slate-100 mb-1">Confirm Unsubscription</h3>
            <h4 className="text-emerald-400 font-medium mb-4">{confirmationDialog.coachName}</h4>
            <p className="text-slate-300 mb-3">
              You have <span className="text-amber-400 font-bold">{confirmationDialog.daysRemaining} days</span> remaining in your subscription.
            </p>
            <p className="text-slate-300 mb-6">
              Are you sure you want to unsubscribe from coach <span className="text-yellow-500 font-semibold">{confirmationDialog.coachName}</span>? You will lose access to all premium articles and videos. 
              Please note that your subscription payment for the current period will not be refunded.
            </p>
            <div className="flex space-x-4 justify-end">
              <button 
                onClick={cancelUnsubscribe}
                className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition duration-300 shadow-md"
              >
                Cancel
              </button>
              <button 
                onClick={confirmUnsubscribe}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
              >
                Unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Header Section with Home and Delete Account buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-4 sm:mb-0">Player Profile</h1>
            <div className="flex space-x-3 sm:space-x-4">
              <button 
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Delete Account
              </button>
              <Link to="/Index?role=player" className="bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-emerald-700 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
                Home
              </Link>
            </div>
          </div>

          {/* Update Message */}
          {updateMessage && (
            <div className={`mb-4 p-3 rounded-lg text-center ${updateMessage.includes('Failed') ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'}`}>
              {updateMessage}
            </div>
          )}

          {/* Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img 
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg" 
                  alt={formData.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-4 border-emerald-500/30 shadow-lg"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-200">{formData.name}</h2>
                  <p className="text-base sm:text-lg text-emerald-400">Player</p>
                </div>
              </div>

              {/* Form Fields */}
              {['name', 'email', 'password'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300 capitalize">
                    {field}
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {isEditing[field] ? (
                      <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full sm:w-auto flex-grow mt-1 rounded-md border-slate-600 bg-slate-800/50 text-slate-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 px-3 py-2"
                      />
                    ) : (
                      <span className="text-base sm:text-lg text-slate-300">{formData[field]}</span>
                    )}
                    <button
                      onClick={() => handleEdit(field)}
                      className="px-4 py-2 bg-slate-700 text-emerald-400 rounded-lg hover:bg-slate-600 transition duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      {isEditing[field] ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ELO Chart Section */}
            <div className="h-64 sm:h-80 md:h-auto bg-slate-800/50 rounded-xl shadow-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eloData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="gameNumber" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#475569', 
                      color: '#f8fafc' 
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="linear" // Ensures a straight line between points
                    dataKey="elo" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ fill: '#34d399', strokeWidth: 2 }} 
                    connectNulls={true} // Ensures null or missing values are connected
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Coaches Section */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-200 mb-6">
              Subscribed Coaches
            </h2>
            <div className="relative">
              <div 
                ref={coachScrollContainerRef} 
                className="flex overflow-x-auto space-x-4 sm:space-x-6 py-4 px-2 
                  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/40
                  hover:scrollbar-thumb-slate-500"
              >
                {subscribedCoaches.length > 0 ? (
                  subscribedCoaches.map((coach) => {
                    return (
                      <div key={coach._id} className="flex-none w-48 sm:w-56">
                        <div className="bg-slate-800/50 rounded-lg p-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-700/50">
                          <img
                            src={coach.imageUrl || "/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"}
                            alt={coach.UserName}
                            className="w-full h-32 sm:h-40 object-cover rounded-lg sm:rounded-xl border-2 border-emerald-500/30"
                          />
                          <h3 className="text-base sm:text-xl text-center font-semibold text-slate-200 mt-2">{coach.UserName}</h3>
                          <p className="text-blue-400 text-center mb-1">{coach.Email}</p>
                          <p className="text-emerald-400 text-center mb-4">Rating: {coach.rating || 'N/A'}</p>
                          <button 
                            onClick={() => handleUnsubscribeClick(coach.user._id, coach.UserName, coach.subscribedAt)}
                            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 
                              transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          >
                            Unsubscribe
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-300">No subscribed coaches found.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
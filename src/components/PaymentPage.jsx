import React, { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux"; 
import { useLocation, useNavigate } from "react-router-dom"; 
import { updatePaymentDetails, submitPayment } from "../redux/paymentSlice"; 
import axios from "axios"; 
import { mihirBackend } from "../../config.js";

const PaymentPage = () => { 
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    const { state } = useLocation(); 
    const [coachName, setCoachName] = useState("");
    const [loading, setLoading] = useState(true);

    const { coachId, plan } = state || {}; 

    const { cardNumber, expiryDate, cvv, cardHolderName, errors, isSubmitted } = useSelector((state) => state.payment); 
    const [paymentError, setPaymentError] = useState(""); 

    // Fetch coach name when component mounts
    useEffect(() => {
        const fetchCoachDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://${mihirBackend}/coach/${coachId}`);
                // Get the coach's name from the user field that's populated
                const coach = response.data;
                setCoachName(coach.user.UserName || "Coach");
            } catch (error) {
                console.error("Error fetching coach details:", error);
                setCoachName("Coach"); // Fallback to generic name
            } finally {
                setLoading(false);
            }
        };

        if (coachId) {
            fetchCoachDetails();
        }
    }, [coachId]);

    // Reset form values when component mounts or when navigating back
    useEffect(() => {
        dispatch(updatePaymentDetails({ name: "cardHolderName", value: "" }));
        dispatch(updatePaymentDetails({ name: "cardNumber", value: "" }));
        dispatch(updatePaymentDetails({ name: "expiryDate", value: "" }));
        dispatch(updatePaymentDetails({ name: "cvv", value: "" }));
        dispatch(updatePaymentDetails({ name: "errors", value: {} }));
    }, [dispatch]);

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        dispatch(updatePaymentDetails({ name, value })); 
        validateField(name, value); 
    }; 

    const validateField = (name, value) => { 
        let fieldError = ""; 
        switch (name) { 
            case "cardHolderName": 
                if (!value.trim()) { 
                    fieldError = "Cardholder name is required."; 
                } else if (!/^[a-zA-Z\s]+$/.test(value)) { 
                    fieldError = "Cardholder name must only contain letters."; 
                } 
                break; 
            case "cardNumber": 
                if (!/^\d{16}$/.test(value)) { 
                    fieldError = "Card number must be 16 digits."; 
                } 
                break; 
            case "expiryDate": 
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) { 
                    fieldError = "Invalid expiry date (MM/YY)."; 
                } 
                break; 
            case "cvv": 
                if (!/^\d{3,4}$/.test(value)) { 
                    fieldError = "CVV must be 3 or 4 digits."; 
                } 
                break; 
            default: break; 
        } 

        dispatch(updatePaymentDetails({ name: "errors", value: { ...errors, [name]: fieldError }, })); 
    }; 

    const validateForm = () => { 
        const validationErrors = {}; 
        
        if (!cardHolderName.trim()) { validationErrors.cardHolderName = "Cardholder name is required."; }
        
        if (!/^\d{16}$/.test(cardNumber)) { validationErrors.cardNumber = "Card number must be 16 digits."; }
        
        if (!/^\d{3,4}$/.test(cvv)) { validationErrors.cvv = "CVV must be 3 or 4 digits."; }
        
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) { validationErrors.expiryDate = "Invalid expiry date (MM/YY)."; }

        dispatch(updatePaymentDetails({ name: "errors", value: validationErrors }));

        return Object.keys(validationErrors).length === 0; 
    }; 

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        
        if (validateForm()) { 
            console.log("Submitting payment with:", { coachId, plan }); 

            try {
                const token = document.cookie.split("=")[1]; 

                // First, process the subscription
                const response = await axios.post( 
                    `http://${mihirBackend}/player/subscribe`, {
                        coachId,
                        plan
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true,
                    }
                ); 

                console.log("Subscription successful:", response.data); 

                // Now update admin revenue - add a fixed amount of $4.95 per successful payment
                await axios.post(
                    `http://${mihirBackend}/admin/update-revenue`,
                    { amount: 4.95 }, // Admin gets $4.95 per subscription
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true,
                    }
                );

                alert("Payment and subscription successful!"); 

                // Reset form values after successful submission
                dispatch(updatePaymentDetails({ name: "cardHolderName", value: "" }));
                dispatch(updatePaymentDetails({ name: "cardNumber", value: "" }));
                dispatch(updatePaymentDetails({ name: "expiryDate", value: "" }));
                dispatch(updatePaymentDetails({ name: "cvv", value: "" }));
                
                navigate(`/CoachesAvailable`, { state: { subscribed: true } }); 

            } catch (error) {
                console.error("Error during subscription:", error.response?.data || error.message); 
                setPaymentError("Payment failed. Please try again."); 
            } 
        } 
    }; 

    return ( 
        <div className="min-h-screen bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center p-4 sm:p-6 md:p-8"> 
        
            <div className="bg-black bg-opacity-80 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md text-green-400"> 
        
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6"> Payment Details </h2> 
        
                <p className="text-center text-green-300 mb-6 sm:mb-8 text-sm sm:text-base"> 
                    You are subscribing to the <span className="font-semibold text-green-400 mx-1">{plan}</span> plan for 
                    <span className="font-semibold text-green-400 mx-1">
                        {loading ? "Loading..." : coachName}
                    </span> 
                </p> 
        
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6"> 
        
                    {/* Cardholder Name */} 
        
                    <div> 
        
                        <label className="block text-sm sm:text-base font-medium mb-1"> Cardholder Name </label> 
        
                        <input type="text" name="cardHolderName" value={cardHolderName} onChange={handleInputChange} className={`w-full px-3 py-2 bg-black border ${errors.cardHolderName ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 text-green-400 text-sm sm:text-base`} placeholder="Enter cardholder name" /> 
        
                        {errors.cardHolderName && ( <p className="mt-1 text-xs sm:text-sm text-red-400"> {errors.cardHolderName} </p> )} 
        
                    </div> 
        
                    {/* Card Number */} 
        
                    <div> 
        
                        <label className="block text-sm sm:text-base font-medium mb-1"> Card Number </label> 
        
                        <input type="text" name="cardNumber" value={cardNumber} onChange={handleInputChange} maxLength="16" className={`w-full px-3 py-2 bg-black border ${errors.cardNumber ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 text-green-400 text-sm sm:text-base`} placeholder="Enter 16-digit card number" /> 
        
                        {errors.cardNumber && ( <p className="mt-1 text-xs sm:text-sm text-red-400"> {errors.cardNumber} </p> )} 
        
                    </div> 
        
                    <div className="grid grid-cols-2 gap-4"> 
        
                        {/* Expiry Date */} 
        
                        <div> 
        
                            <label className="block text-sm sm:text-base font-medium mb-1"> Expiry Date </label> 
        
                            <input type="text" name="expiryDate" value={expiryDate} onChange={handleInputChange} placeholder="MM/YY" className={`w-full px-3 py-2 bg-black border ${errors.expiryDate ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 text-green-400 text-sm sm:text-base`} /> 
        
                            {errors.expiryDate && ( <p className="mt-1 text-xs sm:text-sm text-red-400"> {errors.expiryDate} </p> )} 
        
                        </div> 
        
                        {/* CVV */} 
        
                        <div> 
        
                            <label className="block text-sm sm:text-base font-medium mb-1"> CVV </label> 
        
                            <input type="text" name="cvv" value={cvv} onChange={handleInputChange} maxLength="4" className={`w-full px-3 py-2 bg-black border ${errors.cvv ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-2 focus:ring-green-500 text-green-400 text-sm sm:text-base`} placeholder="CVV" /> 
        
                            {errors.cvv && ( <p className="mt-1 text-xs sm:text-sm text-red-400"> {errors.cvv} </p> )} 
        
                        </div> 
        
                    </div> 
        
                    <button type="submit" disabled={isSubmitted} className={`w-full py-2 sm:py-3 px-4 bg-green-600 text-black rounded-md font-medium text-sm sm:text-base hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-${isSubmitted ? '200 opacity-[0.5] cursor-notAllowed' : '200'}`} > 

                        {isSubmitted ? 'Processing...' : 'Pay Now'} 

                    </button> 

                </form> 

                {paymentError && ( <p className="mt-4 text-center text-red-400 text-sm sm:text-base"> {paymentError} </p> )} 

            </div> 

        </div>
    ); 
}; 

export default PaymentPage;



// import React from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const PricingPlans = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const coachId = searchParams.get('coachId');

//   const handleSubscribe = (plan) => {
//     navigate('/payment', { state: { coachId, plan } });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 
//                     py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-8 sm:mb-12 md:mb-16">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold 
//                        text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
//             Choose Your Plan
//           </h1>
//           <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
//             Select the perfect subscription plan that matches your chess learning goals
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
//           {/* Basic Plan */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform 
//                         hover:scale-105 transition-transform duration-300">
//             <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-500 to-indigo-600">
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Basic Plan</h2>
//               <p className="mt-2 text-purple-100 text-sm sm:text-base">Perfect for beginners</p>
//               <p className="mt-4 text-2xl sm:text-3xl font-bold text-white">$9.99/month</p>
//             </div>
//             <div className="p-6 sm:p-8 space-y-4">
//               <ul className="space-y-3 text-sm sm:text-base">
//                 <li className="flex items-center">
//                   <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
//                   </svg>
//                   Basic video lessons
//                 </li>
//                 {/* Add other list items similarly */}
//               </ul>
//               <button
//                 onClick={() => handleSubscribe('basic')}
//                 className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-purple-600 text-white 
//                          rounded-lg font-semibold hover:bg-purple-700 
//                          transition-colors duration-300 text-sm sm:text-base"
//               >
//                 Subscribe Now
//               </button>
//             </div>
//           </div>

//           {/* Premium Plan */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform 
//                         hover:scale-105 transition-transform duration-300 
//                         border-4 border-yellow-400">
//             <div className="p-6 sm:p-8 bg-gradient-to-br from-yellow-400 to-orange-500">
//               <div className="absolute top-0 right-0 mt-4 mr-4">
//                 <span className="bg-yellow-200 text-yellow-800 text-xs sm:text-sm px-2 py-1 
//                                rounded-full font-semibold">
//                   Popular
//                 </span>
//               </div>
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Premium Plan</h2>
//               <p className="mt-2 text-yellow-100 text-sm sm:text-base">For serious players</p>
//               <p className="mt-4 text-2xl sm:text-3xl font-bold text-white">$19.99/month</p>
//             </div>
//             {/* Add Premium plan content similarly */}
//           </div>

//           {/* Pro Plan */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform 
//                         hover:scale-105 transition-transform duration-300">
//             <div className="p-6 sm:p-8 bg-gradient-to-br from-pink-500 to-rose-600">
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Pro Plan</h2>
//               <p className="mt-2 text-pink-100 text-sm sm:text-base">For elite players</p>
//               <p className="mt-4 text-2xl sm:text-3xl font-bold text-white">$29.99/month</p>
//             </div>
//             {/* Add Pro plan content similarly */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPlans;

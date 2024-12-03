// import React, { useState } from "react";
//  import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { updatePaymentDetails, submitPayment } from "../redux/paymentSlice";
// import axios from "axios";
// import "../styles/payment_page.css";

// const PaymentPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { state } = useLocation(); // Retrieve state passed from PricingPlans
//   const { coachId, plan } = state || {}; // Extract coachId and selected plan
//   console.log("Retrieved coachId from location state:", coachId);
//   const {
//     cardNumber,
//     expiryDate,
//     cvv,
//     cardHolderName,
//     errors,
//     isSubmitted,
//   } = useSelector((state) => state.payment);

//   const [paymentError, setPaymentError] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(updatePaymentDetails({ name, value }));

//     // Real-time validation
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     let fieldError = "";

//     switch (name) {
//       case "cardHolderName":
//         if (!value.trim()) {
//           fieldError = "Cardholder name is required.";
//         } else if (!/^[a-zA-Z\s]+$/.test(value)) {
//           fieldError = "Cardholder name must only contain letters.";
//         }
//         break;

//       case "cardNumber":
//         if (!/^\d{16}$/.test(value)) {
//           fieldError = "Card number must be 16 digits.";
//         }
//         break;

//       case "expiryDate":
//         if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
//           fieldError = "Invalid expiry date (MM/YY).";
//         }
//         break;

//       case "cvv":
//         if (!/^\d{3,4}$/.test(value)) {
//           fieldError = "CVV must be 3 or 4 digits.";
//         }
//         break;

//       default:
//         break;
//     }

//     dispatch(
//       updatePaymentDetails({
//         name: "errors",
//         value: { ...errors, [name]: fieldError },
//       })
//     );
//   };

//   const validateForm = () => {
//     const validationErrors = {};

//     if (!cardHolderName.trim()) {
//       validationErrors.cardHolderName = "Cardholder name is required.";
//     }
//     if (!/^\d{16}$/.test(cardNumber)) {
//       validationErrors.cardNumber = "Card number must be 16 digits.";
//     }
//     if (!/^\d{3,4}$/.test(cvv)) {
//       validationErrors.cvv = "CVV must be 3 or 4 digits.";
//     }
//     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
//       validationErrors.expiryDate = "Invalid expiry date (MM/YY).";
//     }

//     dispatch(
//       updatePaymentDetails({ name: "errors", value: validationErrors })
//     );
//     return Object.keys(validationErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (validateForm()) {
//       console.log("Submitting payment with:", { coachId, plan });
//       try {
//         const token = document.cookie.split("=")[1];
//         const response = await axios.post(
//           "http://localhost:3000/player/subscribe",
//           { coachId, plan },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );
//         console.log("Subscription successful:", response.data);
//         alert("Payment and subscription successful!");
//         navigate(`/coach/${coachId}`, { state: { subscribed: true } });
//       } catch (error) {
//         console.error("Error during subscription:", error.response?.data || error.message);
//       }
//     }
//   };
  

//   return (
//     <div className="payment-page">
//       <h2>Payment Page</h2>
//       <p>You are subscribing to the <strong>{plan}</strong> plan for Coach <strong>{coachId}</strong>.</p>
//       <form onSubmit={handleSubmit} className="payment-form">
//         {/* Cardholder Name */}
//         <div className="form-group">
//           <label>Cardholder Name</label>
//           <input
//             type="text"
//             name="cardHolderName"
//             value={cardHolderName}
//             onChange={handleInputChange}
//             className={errors.cardHolderName ? "error" : ""}
//             placeholder="Enter cardholder name"
//           />
//           {errors.cardHolderName && (
//             <small className="error-text">{errors.cardHolderName}</small>
//           )}
//         </div>

//         {/* Card Number */}
//         <div className="form-group">
//           <label>Card Number</label>
//           <input
//             type="text"
//             name="cardNumber"
//             value={cardNumber}
//             onChange={handleInputChange}
//             maxLength="16"
//             className={errors.cardNumber ? "error" : ""}
//             placeholder="Enter 16-digit card number"
//           />
//           {errors.cardNumber && (
//             <small className="error-text">{errors.cardNumber}</small>
//           )}
//         </div>

//         {/* Expiry Date */}
//         <div className="form-group">
//           <label>Expiry Date (MM/YY)</label>
//           <input
//             type="text"
//             name="expiryDate"
//             value={expiryDate}
//             onChange={handleInputChange}
//             placeholder="MM/YY"
//             className={errors.expiryDate ? "error" : ""}
//           />
//           {errors.expiryDate && (
//             <small className="error-text">{errors.expiryDate}</small>
//           )}
//         </div>

//         {/* CVV */}
//         <div className="form-group">
//           <label>CVV</label>
//           <input
//             type="text"
//             name="cvv"
//             value={cvv}
//             onChange={handleInputChange}
//             maxLength="4"
//             className={errors.cvv ? "error" : ""}
//             placeholder="Enter 3 or 4-digit CVV"
//           />
//           {errors.cvv && <small className="error-text">{errors.cvv}</small>}
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="submit-btn" disabled={isSubmitted}>
//           {isSubmitted ? "Processing..." : "Pay Now"}
//         </button>

//         {paymentError && <p className="error-text">{paymentError}</p>}
//       </form>
//     </div>
//   );
// };

// export default PaymentPage;


import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePaymentDetails, submitPayment } from "../redux/paymentSlice";
import axios from "axios";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { coachId, plan } = state || {};
  console.log("Retrieved coachId from location state:", coachId);
  const {
    cardNumber,
    expiryDate,
    cvv,
    cardHolderName,
    errors,
    isSubmitted,
  } = useSelector((state) => state.payment);

  const [paymentError, setPaymentError] = useState("");

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

      default:
        break;
    }

    dispatch(
      updatePaymentDetails({
        name: "errors",
        value: { ...errors, [name]: fieldError },
      })
    );
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!cardHolderName.trim()) {
      validationErrors.cardHolderName = "Cardholder name is required.";
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      validationErrors.cardNumber = "Card number must be 16 digits.";
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      validationErrors.cvv = "CVV must be 3 or 4 digits.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      validationErrors.expiryDate = "Invalid expiry date (MM/YY).";
    }

    dispatch(
      updatePaymentDetails({ name: "errors", value: validationErrors })
    );
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      console.log("Submitting payment with:", { coachId, plan });
      try {
        const token = document.cookie.split("=")[1];
        const response = await axios.post(
          "http://localhost:3000/player/subscribe",
          { coachId, plan },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Subscription successful:", response.data);
        alert("Payment and subscription successful!");
        navigate(`/coach/${coachId}`, { state: { subscribed: true } });
      } catch (error) {
        console.error("Error during subscription:", error.response?.data || error.message);
        setPaymentError("An error occurred during payment. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/coaches");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-80 rounded-lg shadow-xl p-8 w-full max-w-md text-green-400">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">Payment Details</h2>
        <p className="text-center text-green-300 mb-8">
          You are subscribing to the <span className="font-semibold text-green-400">{plan}</span> plan for Coach <span className="font-semibold text-green-400">{coachId}</span>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-1" htmlFor="cardHolderName">Cardholder Name</label>
            <input
              type="text"
              id="cardHolderName"
              name="cardHolderName"
              value={cardHolderName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 bg-black border ${errors.cardHolderName ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-green-400 transition duration-150 ease-in-out`}
              placeholder="Enter cardholder name"
            />
            {errors.cardHolderName && <p className="mt-1 text-sm text-red-400">{errors.cardHolderName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-1" htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardNumber}
              onChange={handleInputChange}
              maxLength="16"
              className={`w-full px-3 py-2 bg-black border ${errors.cardNumber ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-green-400 transition duration-150 ease-in-out`}
              placeholder="Enter 16-digit card number"
            />
            {errors.cardNumber && <p className="mt-1 text-sm text-red-400">{errors.cardNumber}</p>}
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-green-400 mb-1" htmlFor="expiryDate">Expiry Date (MM/YY)</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={`w-full px-3 py-2 bg-black border ${errors.expiryDate ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-green-400 transition duration-150 ease-in-out`}
              />
              {errors.expiryDate && <p className="mt-1 text-sm text-red-400">{errors.expiryDate}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-green-400 mb-1" htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cvv}
                onChange={handleInputChange}
                maxLength="4"
                className={`w-full px-3 py-2 bg-black border ${errors.cvv ? 'border-red-500' : 'border-green-500'} rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-green-400 transition duration-150 ease-in-out`}
                placeholder="CVV"
              />
              {errors.cvv && <p className="mt-1 text-sm text-red-400">{errors.cvv}</p>}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className={`flex-1 bg-green-600 text-black py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Pay Now'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-600 text-green-400 py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>

        {paymentError && <p className="mt-4 text-center text-red-400">{paymentError}</p>}
      </div>
    </div>
  );
};

export default PaymentPage;
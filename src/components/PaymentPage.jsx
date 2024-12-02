import React, { useState } from "react";
 import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePaymentDetails, submitPayment } from "../redux/paymentSlice";
import axios from "axios";
import "../styles/payment_page.css";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve state passed from PricingPlans
  const { coachId, plan } = state || {}; // Extract coachId and selected plan
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

    // Real-time validation
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
      }
    }
  };
  

  return (
    <div className="payment-page">
      <h2>Payment Page</h2>
      <p>You are subscribing to the <strong>{plan}</strong> plan for Coach <strong>{coachId}</strong>.</p>
      <form onSubmit={handleSubmit} className="payment-form">
        {/* Cardholder Name */}
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            name="cardHolderName"
            value={cardHolderName}
            onChange={handleInputChange}
            className={errors.cardHolderName ? "error" : ""}
            placeholder="Enter cardholder name"
          />
          {errors.cardHolderName && (
            <small className="error-text">{errors.cardHolderName}</small>
          )}
        </div>

        {/* Card Number */}
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardNumber}
            onChange={handleInputChange}
            maxLength="16"
            className={errors.cardNumber ? "error" : ""}
            placeholder="Enter 16-digit card number"
          />
          {errors.cardNumber && (
            <small className="error-text">{errors.cardNumber}</small>
          )}
        </div>

        {/* Expiry Date */}
        <div className="form-group">
          <label>Expiry Date (MM/YY)</label>
          <input
            type="text"
            name="expiryDate"
            value={expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            className={errors.expiryDate ? "error" : ""}
          />
          {errors.expiryDate && (
            <small className="error-text">{errors.expiryDate}</small>
          )}
        </div>

        {/* CVV */}
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={cvv}
            onChange={handleInputChange}
            maxLength="4"
            className={errors.cvv ? "error" : ""}
            placeholder="Enter 3 or 4-digit CVV"
          />
          {errors.cvv && <small className="error-text">{errors.cvv}</small>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={isSubmitted}>
          {isSubmitted ? "Processing..." : "Pay Now"}
        </button>

        {paymentError && <p className="error-text">{paymentError}</p>}
      </form>
    </div>
  );
};

export default PaymentPage;

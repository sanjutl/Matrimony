import React, { useState } from "react";
import axios from "axios";
import "./otp.css";
import {  useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setVerified } from "../../features/slice";
import baseUrl from "../../baseUrl";
import { ToastContainer,toast } from "react-toastify";
import toastNotification from '../../assets/ToastAudio.mp3';


const OtpPage = () => {
  const navigate = useNavigate();
 // Get userEmail from the previous page
  const [form, setForm] = useState({ otp: "" });
  const [message, setMessage] = useState("")
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
      const notificationSound=new Audio(toastNotification);
  
  const dispatch = useDispatch();
  const { id, userEmail } = useSelector((state) => state.user);
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!form.otp) {
      setError("Please enter the OTP.");
      toast.error("Please enter the OTP.");
      return;
    }

    setIsLoading(true); // Start spinner
    try {
      
      const response = await axios.post(
        `${baseUrl}/api/v1/user/verifyOtp/${userEmail}`,
        form
      );
      setMessage(response.data.message);
      setError("");
      if (response.status === 200) {
        toast.success("OTP Verified!");
        dispatch(setVerified({ isVerified: true }));
        setIsLoading(true);
        // Show loader for 2 seconds before navigating
        setTimeout(() => {

          navigate("/formpage1", { state: { id } });
        }, 2000);
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      notificationSound.play().catch((err) =>
        console.warn("Audio play error:", err)
      );
      toast.error(err.response?.data?.message || "Failed to verify OTP.");
      setMessage("");
      setError(err.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };
  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/resendOtp/${userEmail}`
      );
      setMessage("OTP resent successfully!");
      setError("");
      toast.success("OTP Sent To You Registered Mail");
      
    } catch (err) {
      toast.success("Failed to resend OTP. Please try again.");
      notificationSound.play().catch((err) =>
        console.warn("Audio play error:", err)
      );
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    
    // <div className="verify-otp-container">
    //   <h2>Verify OTP</h2>
    //   <form onSubmit={handleVerifyOtp}>
    //     <div className="form-group">
    //       <label htmlFor="otp">OTP:</label>
    //       <input
    //         type="text"
            // id="otp"
            // name="otp" // Add this to bind to form state
            // value={form.otp}
            // onChange={handleChange}
            // placeholder="Enter the OTP"
        //   />
        // </div>

    //     {error && <p className="error-message">{error}</p>}
    //     {message && <p className="success-message">{message}</p>}

    //     <button type="submit" className="verify-btn" disabled={isLoading}>
    //       {isLoading ? "Verifying..." : "Verify OTP"}
    //     </button>
    //     <button type="button" className="resend-btn" onClick={handleResendOtp}>
    //       Resend OTP
    //     </button>
    //   </form>
    // </div>
    <div className="otp-container-main">
      <ToastContainer/>
      <div class="container">
        <h2>OTP Verification</h2>
        <p>Enter the 6-digit code sent to your email</p>
        
        <form onSubmit={handleVerifyOtp}>
        <div class="otp-container">
            <input  class="otp-input" maxlength="6" type="text"
            id="otp"
            name="otp" 
            value={form.otp}
            onChange={handleChange}autofocus/>
            
        </div>

        <button class="verify-btn">Verify OTP</button>

        
        </form>
        <div class="resend" onClick={handleResendOtp}>
            Resend Otp? 
            
        </div>
    </div>
    </div>
  );
};
export default OtpPage;

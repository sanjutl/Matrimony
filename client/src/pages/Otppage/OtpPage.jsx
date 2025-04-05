import React, { useState, useEffect } from "react";
import axios from "axios";
import "./otp.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setVerified } from "../../features/slice";
import baseUrl from "../../baseUrl";
import { ToastContainer, toast } from "react-toastify";
import toastNotification from "../../assets/ToastAudio.mp3";
import Loader from "../../component/Loader/Loadertext.jsx";

const OtpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ otp: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const notificationSound = new Audio(toastNotification);

  const dispatch = useDispatch();
  const { id, userEmail } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!form.otp) {
      setError("Please enter the OTP.");
      toast.error("Please enter the OTP.");
      return;
    }

    setIsLoading(true);
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
        setTimeout(() => {
          navigate("/formpage1", { state: { id } });
        }, 2000);
      }
    } catch (err) {
      notificationSound.play().catch((err) => console.warn("Audio play error:", err));
      toast.error(err.response?.data?.message || "Failed to verify OTP.");
      setError(err.response?.data?.message || "Failed to verify OTP.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (emailResendTimer > 0) return;

    setIsLoading(true);
    setEmailResendTimer(10);
    try {
      await axios.post(`${baseUrl}/api/v1/user/resendOtp/${userEmail}`);
      toast.success("OTP Sent to your registered email!");
      setMessage("OTP resent successfully!");
      setError("");
    } catch (err) {
      notificationSound.play().catch((err) => console.warn("Audio play error:", err));
      toast.error("Failed to resend OTP. Please try again.");
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown logic
  useEffect(() => {
    if (emailResendTimer > 0) {
      const timer = setInterval(() => {
        setEmailResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [emailResendTimer]);

  return (
    <div className="otp-container-main">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <div className="container">
        {isLoading && (
          <div className="loader-div">
            <Loader />
          </div>
        )}

        <h2>OTP Verification</h2>
        <p>Enter the 6-digit code sent to your email</p>

        <form onSubmit={handleVerifyOtp}>
          <div className="otp-container">
            <input
              className="otp-input"
              maxLength={6}
              type="text"
              id="otp"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <button className="verify-btn" disabled={isLoading}>
            Verify OTP
          </button>
        </form>

        <button
          className="resend"
          onClick={handleResendOtp}
          disabled={isLoading || emailResendTimer > 0}
        >
          {emailResendTimer > 0
            ? `Resend available in ${emailResendTimer}s`
            : "Resend OTP"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default OtpPage;

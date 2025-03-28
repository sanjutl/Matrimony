import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./passwordrename.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";  // Ensure ToastContainer is imported
import "react-toastify/dist/ReactToastify.css";  // Import the CSS for Toast
import { useNavigate, useParams } from "react-router-dom";
import baseUrl from "../../../baseUrl";

function PasswordReset() {
  const [showPassword, setShowPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    setShowPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/resetpasswordadmin/${token}`,
        { password: showPassword }
      );
      console.log(response.status);

      if (response.status === 200) {
        toast.success("Password reset successfully", {
          onClose: () => navigate('/adminlanding'),  // Navigate after the toast is closed
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="main-reset-container">
      <div className="reset-container">
        <h1>Reset Your Password</h1>

        <form id="resetForm" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="form-group">
            <label htmlFor="confirm-password">New Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                name="confirmPassword"
                required
                minLength="8"
                placeholder="Enter new password"
                value={showPassword}
                onChange={handleChange}
              />
              <div className="eye-container">
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          <button>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;

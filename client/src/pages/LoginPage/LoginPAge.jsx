import React, { useState } from "react";
import "../LoginPage/loginpage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/slice";
import baseUrl from "../../baseUrl";
import Loader from "../../component/Loader/Loadertext"
import toastNotification from '../../assets/ToastAudio.mp3';
import FooterFront from "../../component/FooterFront/FooterFront";

function LoginPage() {
  const [form, setForm] = useState({
    relation: "",
    userEmail: "",
    firstName: "",
  });
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const notifyError = (message) => toast.error(message);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
    const notificationSound=new Audio(toastNotification);
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignin = async (e) => {
    e.preventDefault();
     setIsLoading(true); 
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/register`,
        form
      );
      if (response.status === 201) {
        // Show success toast
        const { id, userEmail,role } = response.data.user; 
        const token=response.data.token
        
        
        
        dispatch(setUser({ id, userEmail,token,role:Number(role)}));
        toast.success("OTP sent to registered mail ID", {
          onClose: () => navigate(`/OtpPage`,{ state: { userEmail: form.userEmail } }),
        });
      }
    } catch (error) {
      notificationSound.play().catch((err) =>
        console.warn("Audio play error:", err)
      );
      //  toast.error(error.response?.data?.message);
      setErrorMessage(
        error.response?.data?.message || "Please try again."
      );
      notifyError(errorMessage || "Something went wrong. Please try again.");
    }finally {
      setIsLoading(false); // Stop spinner
    }
  };

  return (
    <div className="mainlanding">
      <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
      <div className="main-container">
      
        
        {/* Left section text */}
      
      
        <div className="text-container">
          <h1>Biggest matrimony services for Ezhava</h1>
          <h2>Your Journey To Forever Starts Here</h2>
          <p>Find perfect soulmates for your life from 1000+ of profiles</p>
        </div>

        {/* Right section form */}
        {isLoading && <div className="loader-div"><Loader  /> </div>}
        <div className="form-container">
          <div className="form-header">
            <h3>Create a Matrimony Profile</h3>
          </div>
          <div className="form-subheader">
            <h4>Find Your Perfect Soulmate</h4>
          </div>
          <form onSubmit={handleSignin}>
            <label>
              Matrimony Profile for
              <select name="relation" onChange={handleChange} value={form.relation}>
                <option>Select</option>
                <option value="Myself">Myself</option>
                <option value="Friend">Friend</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
              </select>
            </label>
            <label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter Your Name"
                required
                onChange={handleChange}
                value={form.firstName}
              />
            </label>
            <label>
              <input
                type="email"
                name="userEmail"
                placeholder="Enter Your Email"
                required
                onChange={handleChange}
                value={form.userEmail}
              />
            </label>
            <button type="submit">Register Now</button>
          </form>
        </div>
      </div>
      <FooterFront/>
    </div>
  );
}

export default LoginPage;

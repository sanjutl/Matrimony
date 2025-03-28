import React, { useState } from "react";
import "./adminlogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../../features/slice";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import BounceLoader from "react-spinners/BounceLoader";
import baseUrl from "../../../baseUrl";

function AdminLogin() {
  let field = {
    userEmail: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(field);
  const [errorMessage, setErrorMessage] = useState("");
  const notifyError = (message) => toast.error(message);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const navigate = useNavigate();
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const submitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/forgotpasswordadmin`,{ userEmail: email }
      );
      if (response.status === 200) {
    setIsLoading(false); 

        toast.success("Password reset link sent to registered mail ID", {
          onClose: () => setIsModalOpen(false),
        });
      }
    } catch (error) {
      
      notifyError(error.response?.data?.message);
    }
  };
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/login`,
        form
      );
      if (response) {
        navigate(`/Admindashboard`);
        console.log(response.data);
        dispatch(setUser({ id: response.data.userId ,token:response.data.token,role:Number(response.data.role)})); // Dispatch Redux action
      }
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
      notifyError(error.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="landing-main-container">
      {isLoading && <div className="loader"><BounceLoader color="#f8cb58" /> </div>}

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
        {/* Left section text */}
        <div className="landing-text-container">
          <h1>Ezhava Matrimony</h1>
          <p>Find Your Perfect Match in the Ezhava Community</p>
        </div>

        {/* Right section form */}
        <div className="landing-form-container">
          <div className="landing-form-header">
            <h3>Login to your Profile</h3>
          </div>
          <div className="landing-form-subheader">
            <h4>Admin Login</h4>
          </div>
          <form onSubmit={handleSignin}>
            <label>
              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                value={form.userEmail}
                onChange={handleChange}
                required
              />
            </label>
            <label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                required
                value={form.Password}
                onChange={handleChange}
              />
               <span
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <span className="material-icons">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </span>
              </div>
            </label>
            <button type="submit">Sign In</button>
            <div className="fp">
              <p
                className="forgot-password-link"
                onClick={() => setIsModalOpen(true)}
              >
                Forgot Password?
              </p>
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              className="modal-content"
              overlayClassName="modal-overlay"
            >
              <h2>Forgot Password</h2>
              <p>Enter your email to receive a reset link.</p>

              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={handleEmail}
              />

              <button onClick={submitEmail}>Submit</button>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </Modal>
          </form>
        </div>
      </div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </div>
  );
}

export default AdminLogin;

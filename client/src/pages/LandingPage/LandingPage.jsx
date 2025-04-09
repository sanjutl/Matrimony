import React, { useEffect, useState } from "react";
import "../LandingPage/landingpage.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/slice";
import Modal from "react-modal";
import baseUrl from "../../baseUrl";
import toastNotification from '../../assets/ToastAudio.mp3'
import Loader from "../../component/Loader/Loadertext.jsx";
import FooterFront from "../../component/FooterFront/FooterFront";


function LandingPage() {
  let field = {
    userEmail: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(field);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const notificationSound=new Audio(toastNotification);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const notifyError = (message) => toast.error(message);
  const [isLoading, setIsLoading] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const submitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailResendTimer(10);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/forgotpassworduser`,
        { userEmail: email }
      );
      if (response.status === 200) {
        toast.success("Password reset link sent to registered mail ID",{
          onClose:()=>setIsModalOpen(false)
        });
        
      }
    } catch (error) {
      notificationSound.play().catch((err) =>
        console.warn("Audio play error:", err)
      );
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let interval = null;
    if (emailResendTimer > 0) {
      interval = setInterval(() => {
        setEmailResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer]);
  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/v1/user/login`, form);
      if (response) {
        dispatch(
          setUser({
            id: response.data.userId,
            token: response.data.token,
            role: response.data.role,
          })
        ); // Dispatch Redux action
        localStorage.setItem("userId", response.data.userId);
        const userId = response.data.userId;
        navigate(`/dashboard/${userId}`);
      }
    } 
    catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password. Please try again.";
      setErrorMessage(message);
      notificationSound.play().catch((err) =>
        console.warn("Audio play error:", err)
      );
      toast.error(message); // Show toast
    }
    
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mainLanding"> 
      <div className="landing-main-container">
        {isLoading && (
          <div className="loader">
            <Loader />{" "}
          </div>
        )}
        <div className="landing-text-container">
          <h1>Ezhava Matrimony</h1>
          <p>Find Your Perfect Match in the Ezhava Community</p>
        </div>
        <div className="landing-form-container">
          <div className="landing-form-header">
            <h3>Login to your Profile</h3>
          </div>
          <div className="landing-form-subheader">
            <h4>Find Your Perfect Soulmate</h4>
          </div>
          <form onSubmit={handleSignin}>
            <label>
              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                required
                onChange={handleChange}
                value={form.userEmail}
              />
            </label>
            <label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  required
                  onChange={handleChange}
                  value={form.password}
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
              <p className="signup-link" onClick={() => setIsModalOpen(true)}>
                Forgot Password
              </p>
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              className="modal-content"
              overlayClassName="modal-overlay"
            >
              <div style={{ position: "relative" }}>
                {isLoading && (
                  <div className="modal-loader-overlay">
                    <div className="loader-div">
                      <Loader />{" "}
                    </div>
                  </div>
                )}

                <h2>Forgot Password</h2>
                <p>Enter your email to receive a reset link.</p>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={handleEmail}
                  disabled={isLoading}
                />

                <button
                  onClick={submitEmail}
                  disabled={isLoading || emailResendTimer > 0}
                >
                  {emailResendTimer > 0
                    ? `Resend available in ${emailResendTimer}s`
                    : "Submit"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Close
                </button>
              </div>
            </Modal>
            <div className="adminLogin">
              <Link className="signup-link" to="/adminLanding">
                Login as Admin
              </Link>
            </div>
            <div className="signin">
              <p> Create your account</p>
              <Link className="signup-link" to="/register">
                Sign up
              </Link>
            </div>
          </form>
</div>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
          />
      </div>
      {/* <ToastContainer
  position="bottom-right"
  autoClose={3000}
  style={{ zIndex: 9999 }}
  /> */}

  <FooterFront/>
    </div>
  );
}

export default LandingPage;

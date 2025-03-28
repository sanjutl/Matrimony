import React, { useEffect, useState } from "react";
import styles from "./formpage1.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Eye, EyeSlash } from "phosphor-react";
import baseUrl from "../../baseUrl";

function FormPage1() {
  const [form, setForm] = useState({
    dateOfBirth: "",
    gender: "",
    motherTongue: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [userProfie, setUserProfile] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);
  const navigate = useNavigate();
  const { id, userEmail,token } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a copy of the form data
    const updatedForm = { ...form };

    // If password is "********" (placeholder), remove it from the update request
    if (form.password === "********" || !form.password) {
      delete updatedForm.password;
    }

    try {
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/edit/${id}`,
        updatedForm
      );

      if (response.status === 200) {
        notifySuccess(response.data.data.message || "Successfully Submitted.");
        navigate(`/formpage2`);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Please try again.");
      notifyError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const dataBinding = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/usercarddetails/${id}`
      );
      setUserProfile(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    dataBinding();
  }, [id]);
  useEffect(() => {
    if (userProfie) {
      setForm((prevForm) => ({
        ...prevForm,
        dateOfBirth: userProfie.dateOfBirth || "",
        gender: userProfie.gender || "",
        motherTongue: userProfie.motherTongue || "",
        email: userProfie.email || "",
        // Don't set password in the form
      }));
    }
  }, [userProfie]);

  const passwordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <div className={styles.mainContainer}>
      <ToastContainer position="bottom-right" />
      <div className={styles.progressDiv}>
        <div className={styles.progressHeading}>You have completed</div>
        <div className={styles.progressHeading2}>20%</div>
      </div>
      <div className={styles.container}>
        {/* Progress Bar */}

        {/* Main Content */}
        <div className={styles.contentDiv}>
          {/* Image Section */}

          {/* <div className={styles.imageDisplayDiv}>
            <img
              src={image} // Replace with actual image URL
              alt="Couple"
              className={styles.image}
            />
          </div> */}

          {/* Form Section */}
          <div className={styles.formContainer}>
            <h3 className={styles.formHeading}>
              {userProfie.relation === "Myself"
                ? "Tell us about yourself"
                : `Tell us about your ${userProfie.relation} basic details`}
            </h3>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Date Of Birth</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="date"
                      className={styles.input}
                      placeholder="DD / MM / YY"
                      style={{ color: "#666" }}
                      required
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      name="dateOfBirth"
                    />
                  </div>
                  <div className={styles.helperTextDiv}>
                    <p className={styles.helperText}>
                      {userProfie.relation === "Myself"
                        ? "Your date of birth to find a perfect match"
                        : `Your ${userProfie.relation}'s date of birth to find a perfect match`}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Gender</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <select
                      className={styles.input}
                      required
                      value={form.gender}
                      onChange={handleChange}
                      name="gender"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>

                      {/* <option>Other</option> */}
                    </select>
                  </div>
                  <div className={styles.helperTextDiv}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Mother Tongue</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <select
                      className={styles.input}
                      required
                      value={form.motherTongue}
                      onChange={handleChange}
                      name="motherTongue"
                    >
                      <option value="">Select Language</option>
                      <option value="Malayalam">Malayalam</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className={styles.helperTextDiv}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Email ID</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="email"
                      className={styles.input}
                      placeholder="Enter email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </div>
                  <div className={styles.helperTextDiv}>
                    <p className={styles.helperText}>
                      Check your email for a perfect match
                    </p>
                  </div>
                </div>
              </div>
              {!userProfie.password && (
                <div className={styles.formGroup}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelGroup}>
                      <label>Password</label>
                      <p className={styles.starHead}>*</p>
                    </div>
                    <div className={styles.inputGroup}>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={styles.input}
                        placeholder="Enter password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        name="password"
                      />
                      {showPassword ? (
                        <EyeSlash
                          className={styles.PasswordEyeIcon}
                          weight="duotone"
                          onClick={passwordVisibility}
                        />
                      ) : (
                        <Eye
                          className={styles.PasswordEyeIcon}
                          weight="duotone"
                          onClick={passwordVisibility}
                        />
                      )}
                    </div>
                    <div className={styles.helperTextDiv}>
                      <p className={styles.helperText}>
                        Password must have between 6–20 characters
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.btnDiv}>
                <button type="submit" className={styles.submitButton}>
                  Continue
                </button>
              </div>
              <div className={styles.mandatoryField}>* Mandatory fields</div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>Copyright © 2025. All rights reserved</p>
      </div>
    </div>
  );
}

export default FormPage1;

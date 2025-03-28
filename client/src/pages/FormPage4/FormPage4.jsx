import React, { useState,useEffect } from "react";
import styles from "../FormPage1/formpage1.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import baseUrl from "../../baseUrl";

function FormPage4() {
  const [form, setForm] = useState({});

  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userProfie, setUserProfile] = useState([]);

  const { id } = useSelector((state) => state.user);
 const notifyError = (message) =>
    toast.error(message, {
      autoClose: 3000,
      closeOnClick: true,
    });

  const notifySuccess = (message) =>
    toast.success(message, {
      autoClose: 3000,
      closeOnClick: true,
    });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setShowModal(true);
    }
  };
  const handleUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("profilePicture", imageFile);

    try {
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/edit/${id}`,
        formData
      );
      if (response.status === 200) {
        notifySuccess(response.data.data.message || "Successfully Submitted.");
        setShowModal(false); // Close modal after successful upload
      }
    } catch (error) {
      console.log("Upload error:", error);
    }
    // Close modal after upload
    setShowModal(false);
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // if (imageFile) {
    //   formData.append("profilePicture", imageFile);
    // }
    formData.append("about", form.about || "");
    formData.append("age", form.age || "");
    formData.append("hobbies", form.hobbies || "");
    formData.append("phoneNumber", form.phoneNumber || "");

    try {
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
          notifySuccess(response.data.data.message || "Successfully Submitted.");
          setShowModal(false); // Close modal after successful upload
        
        navigate(`/formpage5`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting the form.");
    }
    // setShowModal(false);
    // setImageFile(null);
    // setPreview(null);
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
            
            about: userProfie.about || "",
            age:userProfie.age||"",
            phoneNumber:userProfie.phoneNumber||"",
            hobbies:userProfie.hobbies||""
          }));
        }},[userProfie])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.progressDiv}>
        <div className={styles.progressHeading}>You have completed</div>
        <div className={styles.progressHeading2}>80%</div>
      </div>

      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.contentDiv}>
          {/* Image Section */}
          {/* <div className={styles.imageDisplayDiv}>
            <img src={image} alt="Couple" className={styles.image} />
          </div> */}

          <div className={styles.formContainer}>
            <h3 className={styles.formHeading}>  {userProfie.relation === "Myself" 
  ? "About yourself" 
  : `About your ${userProfie.relation} `}

            </h3>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.textAreaDiv}>
                <label className={styles.leftLabel}>About your friend</label>
                <textarea
                  className={styles.textArea}
                  placeholder="Type here..."
                  value={form.about || ""}
                  onChange={handleChange}
                  name="about"
                  // required
                ></textarea>
              </div>

              

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Age</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder=""
                      value={form.age || ""}
                      onChange={handleChange}
                      name="age"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Hobbies</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder=""
                      value={form.hobbies || ""}
                      onChange={handleChange}
                      name="hobbies"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Phone Number</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder=""
                      value={form.phoneNumber || ""}
                      onChange={handleChange}
                      name="phoneNumber"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={styles.imageUploadDiv}>
                <label className={styles.imageUploadLabel}>
                  <span className="material-icons">
                    Upload Your Profile Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.imageUploadInput}
                    onChange={handleImageChange}
                    // required
                    
                  />
                  <p className={styles.starHead}>*</p>

                </label>
              </div>
              {showModal && (
                <div className={styles.modal}>
                  <div className={styles.modalContent}>
                    <h3>Preview</h3>
                    <img
                      src={preview}
                      alt="Selected Preview"
                      style={{
                        objectFit: "cover",
                        borderRadius: "10px",
                        width: "236px",
                        height: "398px",
                        backgroundColor: " #f0c040",
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    />
                    <div className={styles.modalButtons}>
                      <button onClick={handleUpload}>Yes</button>
                      <button onClick={() => setShowModal(false)}>No</button>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.btnDiv}>
                <button type="submit" className={styles.submitButton}>
                  Continue
                </button>
              </div>
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

export default FormPage4;

import React, { useState, useEffect } from "react";
import styles from "../FormPage1/formpage1.module.css";
import image from "../../assets/free-photo-of-couple-in-green-grass-field.jpeg";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseUrl from "../../baseUrl";
// import image2 from "../../assets/heartshape.png";

function FormPage2() {
  const [errorMessage, setErrorMessage] = useState("");
  const notifyError = (message) => toast.error(message);
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [selectedJathakam, setSelectedJathakam] = useState("");
  const [userProfie, setUserProfile] = useState([]);
  const btnSelected = (button) => {
    setSelected(button);
  };
  const { id } = useSelector((state) => state.user);

  const btnSelectedJathakam = (button) => {
    setSelectedJathakam(button);
  };

  const [form, setForm] = useState({});
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedForm = {
      ...form,
      suddhaJathakam: selected,
      dosham: selectedJathakam,
    };
    try {
      const response = await axios.patch(
        `${baseUrl}/api/v1/user/edit/${id}`,
        updatedForm
      );
      if (response.status === 200) {
        navigate(`/formpage3`);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Please try again.");
      notifyError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const renderOptionButtons = (options, selectedOption, setSelectedOption) =>
    options.map((option) => (
      <button
        key={option}
        type="button"
        className={`${styles.optionSingleButton} ${
          selectedOption === option ? styles.selected : ""
        }`}
        onClick={() => setSelectedOption(option)}
      >
        {option}
      </button>
    ));
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
        religion: userProfie.religion || "",
        caste: userProfie.caste || "",
        subCaste: userProfie.subCaste || "",
        gothram: userProfie.gothram || "",
        suddhaJathakam: userProfie.suddhaJathakam ||"",
        
        
      }));
      setSelected(userProfie.suddhaJathakam || ""); 
      setSelectedJathakam(userProfie.dosham || "");
    }
  }, [userProfie]);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.progressDiv}>
        <div className={styles.progressHeading}>You have completed</div>
        <div className={styles.progressHeading2}>40%</div>
      </div>
      <div className={styles.container}>
        {/* Progress Bar */}

        {/* Main Content */}
        <div className={styles.contentDiv}>
          {/* Image Section */}
{/* 
          <div className={styles.imageDisplayDiv}>
            <img
              src={image} 
              alt="Couple"
              className={styles.image}
            />
          </div> */}

          {/* Form Section */}
          <div className={styles.formContainer}>
            <h3 className={styles.formHeading}>
              Fill up your religious details for Finding Right Match
            </h3>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Date Of Birth</label>
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="date"
                      className={styles.input}
                      placeholder="DD / MM / YY"
                      style={{ color: "#666" }}
                    />
                  </div>
                  <div className={styles.helperTextDiv}>
                    <p className={styles.helperText}>
                      Your friend's date of birth to find a perfect match
                    </p>
                  </div>
                </div>
              </div> */}

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Religion</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <select
                      className={styles.input}
                      required
                      value={form.religion}
                      onChange={handleChange}
                      name="religion"
                    >
                      <option>Select Religion</option>
                      <option value="Hindu">Hindu</option>

                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className={styles.helperTextDiv}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Caste</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <select
                      className={styles.input}
                      required
                      value={form.caste}
                      onChange={handleChange}
                      name="caste"
                    >
                      <option >Select your caste</option>
                      <option value="Ezhava">Ezhava</option>
                    </select>
                  </div>
                  <div className={styles.helperTextDiv}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>SubCaste</label>
                    <p className={styles.starHead}>*</p>
                  </div>
                  <div className={styles.inputGroup}>
                    <select
                      className={styles.input}
                      required
                      value={form.subCaste}
                      onChange={handleChange}
                      name="subCaste"
                    >
                      <option value="">Select SubCaste</option>
                      <option value="Thiyya">Thiyya</option>
                      <option value="Chekavars">Chekavars</option>
                      <option value="Vilaakkithala Nairs">
                        Vilaakkithala Nairs
                      </option>
                      <option value="Velar">Velar</option>
                      <option value="Kalari Panickers">Kalari Panickers</option>
                    </select>
                  </div>
                  <div className={styles.helperTextDiv}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Gothram</label>
                    <p className={styles.starHead}></p>
                  </div>
                  <div className={styles.inputGroup}>
                    <select
                      className={styles.input}
                      value={form.gothram}
                      onChange={handleChange}
                      name="gothram"
                    >
                      <option value="">Gothram</option>
                      <option value="Kashyapa">Kashyapa</option>
                      <option value="Vishwamitra">Vishwamitra</option>
                      <option value="Agastya">Agastya</option>
                    </select>
                  </div>
                  <div className={styles.helperTextDiv}>
                    <div className={styles.optionalDiv}>
                      <p className={styles.optionalDivText}>Optional</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Suddha Jathakam</label>
                  </div>
                  <div className={styles.inputGroup}>
                    {/* <input
                      type="email"
                      className={styles.input}
                      placeholder="Enter email"
                    /> */}
                    <div className={styles.optionButtonOuterDiv}>
                      {renderOptionButtons(
                        ["Yes", "No", "Don't Know"],
                        selected,
                        setSelected
                      )}
                    </div>
                  </div>
                  <div className={styles.helperTextDiv}>
                    <div className={styles.optionalDiv}>
                      <p className={styles.optionalDivText}>Optional</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.fieldGroup}>
                  <div className={styles.labelGroup}>
                    <label>Dosham</label>
                  </div>
                  <div className={styles.inputGroup}>
                    <div className={styles.optionButtonOuterDiv}>
                      {renderOptionButtons(
                        ["Yes", "No", "Don't Know"],
                        selectedJathakam,
                        setSelectedJathakam
                      )}
                    </div>
                  </div>
                  <div className={styles.helperTextDiv}>
                    <div className={styles.optionalDiv}>
                      <p className={styles.optionalDivText}>Optional</p>
                    </div>
                  </div>
                </div>
              </div>
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

export default FormPage2;

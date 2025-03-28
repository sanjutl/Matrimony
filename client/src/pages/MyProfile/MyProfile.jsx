import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../../component/Navbar/Nav";
import Footer from "../../component/Footer/Footer";
import image from "../../assets/free-photo-of-couple-in-green-grass-field.jpeg";
import "../MyProfile/myprofile.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import baseUrl from "../../baseUrl";

function MyProfile() {
  const [userData, setUserData] = useState({});
  const [file, setFile] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/usercarddetails/${userId}`
      );
      setUserData(response.data.data);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFile((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  useEffect(() => {
    const handleUpload = async () => {
      if (file.length === 0) return;

      const formData = new FormData();
      file.forEach((file) => formData.append("image", file));

      try {
        const response = await axios.patch(
          `${baseUrl}/api/v1/user/edit/${userId}`,
          formData
        );
        console.log("Upload successful:", response);
        setFile([]); // Clear file after upload
        fetchUserData(); // Refresh user data to reflect new images
      } catch (error) {
        console.log("Upload error:", error);
      }
    };

    handleUpload();
  }, [file]);

  return (
    <div>
      <Nav userId={userId}/>
      <h2 className="all-match">My Profile</h2>
      <div className="profile-view-main-container">
        <div className="profile-cards">
          <div className="image-container">
            <img
              src={
                userData.profilePicture
                  ? `${baseUrl}${userData.profilePicture}`
                  : ""
              }
              alt="Profile"
              className="profile-image"
            />
          </div>

          <div className="details-sections">
            <div className="profile-name-container">
              <div className="heading-text">
                <h2 className="profile-name-container">
                  {userData.firstName ? userData.firstName : ""}
                </h2>
              </div>
              <div className="option-container">
                <div className="option">
                  <i
                    class="material-icons text-gray-600 cursor-pointer w-6 h-6"
                    style={{ marginLeft: "-50px", fontSize: "40px" }}
                
                  >
                    add_a_photo
                  
                </i>

                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onClick={() => fileInputRef.current.click()}
                      style={{ cursor: "pointer" }}
                    >
                      Upload Images
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-age-container">
              <p className="">
                {userData
                  ? `${userData.age} Yrs, ${userData.height} cms`
                  : "25 Yrs, 5'7\""}
                {/* 25 Yrs,5'7 */}
              </p>
            </div>

            <div className="profile-info-container">
              <span className="profile-degree-container">
              {userData.education
                      ? userData.education
                          .split("_")
                          .map(
                            (education) =>
                              education.trim().charAt(0).toUpperCase() +
                              education.trim().slice(1)
                          )
                          .join(" ")
                      : ""}
              </span>
            </div>

            <div className="profile-location-container">
              <span>
                {userData.location || userData.state
                  ? `${userData.location}  ${userData.state}`
                  : "No data Found"}
              </span>
            </div>
            <div className="premium-container">
              <h3>Premium</h3>
            </div>
          </div>
          {/* <div className="verify-container">
            <h3>Verify Profile</h3>
          </div> */}
        </div>

        <div className="about-similar">
          <div className="about-card">
            <div className="about-card-container">
              <div className="user-description">
                <div className="about-user-container">
                  <h3>
                    {`About ${
                      userData.firstName
                        ? userData.firstName
                        : "No details found"
                    }`}{" "}
                  </h3>
                </div>
                <div className="description-container">
                  <p>{userData.about ? userData.about : "No Deatils Found"}</p>
                </div>
              </div>
              <div className="basic-details-container">
                <div className="basic-details">
                  <div className="heading">
                    <h4>
                      {userData.gender === "male"
                        ? `His Details`
                        : "Her Details"}
                    </h4>
                  </div>
                  <div className="age-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        person
                      </span>
                      <p>Age</p>
                    </div>
                    <div className="prof-detail same1">
                      {userData.age ? `${userData.age} Yrs` : ""}
                    </div>
                  </div>
                  <div className="degree-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        school
                      </span>
                      <p>Degree</p>
                    </div>
                    <div className="prof-detail same1">
                    {userData.education
                      ? userData.education
                          .split("_")
                          .map(
                            (education) =>
                              education.trim().charAt(0).toUpperCase() +
                              education.trim().slice(1)
                          )
                          .join(" ")
                      : ""}
                    </div>
                  </div>
                  <div className="location-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        location_on
                      </span>
                      <p>Location</p>
                    </div>
                    <div className="prof-detail same1">
                      {userData.location || userData.state
                        ? `${userData.location}  ${userData.state}`
                        : "No data Found"}
                    </div>
                  </div>
                  <div className="spoken-language-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        language
                      </span>
                      <p>Spoken Language</p>
                    </div>
                    <div className="prof-detail same1">
                      {userData.motherTongue ? `${userData.motherTongue} ` : ""}
                    </div>
                  </div>
                  <div className="profile-created-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        account_circle
                      </span>
                      <p>Profile Created By</p>
                    </div>
                    <div className="prof-detail same1">
                      {userData.relation ? userData.relation : ""}
                    </div>
                  </div>
                  <div className="maritial-status-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        favorite
                      </span>
                      <p>Maritial Status</p>
                    </div>
                    <div className="prof-detail same1">
                      {userData.maritalStatus ? userData.maritalStatus : ""}
                    </div>
                  </div>
                  {/* <div className="citizenship-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">flag</span>
                      <p>Citizenship</p>
                    </div>
                    <div className="prof-detail same1">"India"</div>
                  </div> */}
                  <div className="location-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">work</span>
                      <p>hobbies</p>
                    </div>
                    <div className="prof-detail same1">
                      {userData.hobbies
                        ? userData.hobbies
                            .split(",")
                            .map(
                              (hobby) =>
                                hobby.trim().charAt(0).toUpperCase() +
                                hobby.trim().slice(1)
                            )
                            .join(", ")
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="basic-details-container">
                <div className="about-user-container">
                  <h3>About Religion</h3>
                </div>
                <div className="degree-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#5f6368"
                      >
                        <path d="M80-80v-440h80v80h80l119-395v-85h80v80h81v-80h80v80l120 400h80v-80h80v440H520v-200h-80v200H80Zm268-440h264l-24-80H372l-24 80Zm48-160h168l-24-80H420l-24 80ZM160-160h200v-200h240v200h200v-200H660l-24-80H324l-24 80H160v200Zm320-300Z" />
                      </svg>
                    </span>
                    <p>Subcaste</p>
                  </div>
                  <div className="prof-detail same1">
                    {userData.subCaste ? userData.subCaste : "Optional"}
                  </div>
                </div>
                <div className="location-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">school</span>
                    <p>Gothram</p>
                  </div>
                  <div className="prof-detail same1">
                    {userData.gothram ? userData.gothram : "Optional"}
                  </div>
                </div>
                <div className="spoken-language-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#5f6368"
                      >
                        <path d="M620-320v-109l-45-81q-7 5-11 13t-4 17v229L663-80h-93l-90-148v-252q0-31 15-57t41-43l-56-99q-20-38-17.5-80.5T495-832l68-68 276 324 41 496h-80l-39-464-203-238-6 6q-10 10-11.5 23t4.5 25l155 278v130h-80Zm-360 0v-130l155-278q6-12 4.5-25T408-776l-6-6-203 238-39 464H80l41-496 276-324 68 68q30 30 32.5 72.5T480-679l-56 99q26 17 41 43t15 57v252L390-80h-93l103-171v-229q0-9-4-17t-11-13l-45 81v109h-80Z" />
                      </svg>
                    </span>
                    <p>Dosham</p>
                  </div>
                  <div className="prof-detail same1">
                    {userData.dosham ? userData.dosham : "Optional"}
                  </div>
                </div>
              </div>
              <div className="basic-details-container">
                <div className="about-user-container">
                  <h3>Profession Details</h3>
                </div>
                <div className="degree-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">school</span>
                    <p>Education</p>
                  </div>
                  <div className="prof-detail same1">
                  {userData.education
                      ? userData.education
                          .split("_")
                          .map(
                            (education) =>
                              education.trim().charAt(0).toUpperCase() +
                              education.trim().slice(1)
                          )
                          .join(" ")
                      : ""}
                  </div>
                </div>
                <div className="location-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">school</span>
                    <p>Occupation</p>
                  </div>
                  <div className="prof-detail same1">
                    {userData.occupation
                      ? userData.occupation
                          .split("_")
                          .map(
                            (occupation) =>
                              occupation.trim().charAt(0).toUpperCase() +
                              occupation.trim().slice(1)
                          )
                          .join(" ")
                      : ""}
                  </div>
                </div>
              </div>
              <div className="basic-details-container">
                <div className="about-user-container">
                  <h3>About Family</h3>
                </div>
                <div className="degree-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">home</span>
                    <p>Family Type</p>
                  </div>
                  <div className="prof-detail same1">
                    {userData.familyType
                      ? userData.familyType
                      : "No Data Found"}
                  </div>
                </div>
                <div className="degree-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">home</span>
                    <p>Family Values</p>
                  </div>
                  <div className="prof-detail same1">
                    {userData.familyValues
                      ? userData.familyValues
                      : "No Data Found"}
                  </div>
                </div>
              </div>
              {/* 
            <div className="profile-like-container">
              <div className="profile-like-main">
                <div className="heading">
                  <h3>Profiles You May Like</h3>
                </div>
                <div className="like-card-container">
               
                      <div className="like-card">
                        <div className="image-container">
                          <img src={image} alt="Profile" />
                        </div>
                        <div className="description-container">
                          <div className="name">
                            <h5>Gopika</h5>
                          </div>
                          <div className="age">
                            <p>25 Yrs</p>
                          </div>
                          <div className="location">
                            <p>TVM</p>
                          </div>
                          <div className="view-button">
                            <button>View Profile</button>
                          </div>
                        </div>
                      </div>
                
                </div>
              </div>
            </div> */}
            </div>
          </div>
          <div className="similar-profile-container">
            {/* <div className="main-similar-profile"> */}
              <div className="container-similar">
                <h3>Uploaded Images</h3>
              </div>
              <div className="like-card-container">
                <div className="my-profile-image23">
                  {userData.image?.map((imgSrc, index) => (
                    <img
                      key={index}
                      className="my-profile-image23-single"
                      src={`${baseUrl}${imgSrc}`}
                      alt={`User Image ${index}`}
                    />
                  ))}
                </div>
              {/* </div> */}
            </div>
          </div>
        </div>
        <hr className="separator"></hr>
      </div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <Footer />
    </div>
  );
}

export default MyProfile;

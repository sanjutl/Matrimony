import React, { useEffect, useState } from "react";
import Nav from "../../../component/AdminNav/Adminnav";
import padam from "../../../assets/bridde.jpg";
import "./adminuserprofile.css";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router";
import Footer from "../../../component/Footer/Footer";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Carousel } from 'antd';
import { Trash } from "phosphor-react";
import baseUrl from "../../../baseUrl";
function Adminprofile() {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);
  const [uploadimage, setUploadimage] = useState([])
  const Navigate = useNavigate()
  const userData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/usercarddetails/${id}`
      );
      setData(response.data.data);
      setUploadimage([response.data.data.profilePicture, ...response.data.data.image]);
      console.log("in admin userdata:", response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);

    }
  };
  useEffect(() => {
    userData();
  }, [id]);
  if (!data) {
    return <div>Loading</div>;
  }
  const handleDelete = async (req, res) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/user/deleteUser/${id}`
      );
      toast.success("User Deleted Successfully")
      setIsModalOpen(false)
      Navigate("/getFullUser")
    } catch (error) {
      notifyError(error.response?.data?.message || "Something went wrong. Please try again.");

    }
  };
  console.log("image", uploadimage)

  return (
    <div>
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
      <Nav />
      <div className="profile-view-main-container">
        <div className="profile-cardsAd">
          <div className="image-containerAd"> 

            <Carousel arrows infinite={false}>
              {uploadimage.length > 0 && uploadimage.map((image, index) => (
                <div key={index} className="cardimage">
                  <img src={`${baseUrl}${image}`} alt={`Image ${index + 1}`} />
                </div>
              ))}
            </Carousel>

          </div>

          <div className="details-sections">
            <div className="profile-name-container">
              <div className="heading-text">
                <h2 className="profile-name-container">{data.firstName}</h2>
              </div>
              <div className="option">
                <i>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox=""
                    fill="currentColor"
                    className="w-6 h-6 text-gray-600 cursor-pointer"
                  >
                    <path d="M12 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                  </svg>
                </i>
              </div>
            </div>
            <div className="profile-age-container">
              <p className="">{data?.age || "Nil"}</p>
              <div className="media-admin">
                <div className="delete" onClick={() => setIsModalOpen(true)}>
                  <Trash size={32} color="red" />
                </div>
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  className="modal-content"
                  overlayClassName="modal-overlay"
                  style={{
                    overlay: { zIndex: 1000 },
                    content: { zIndex: 1001 },
                  }}
                >
                  <h2 style={{ padding: "20px" }}>Delete User </h2>
                  <p style={{ padding: "20px" }}>
                    Are you sure want to delete this User.
                  </p>

                  <button
                    style={{ backgroundColor: "red", border: "none" }}
                    onClick={handleDelete}
                  >
                    Yes
                  </button>
                  <button
                    style={{ backgroundColor: "#13f534", border: "none" }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    No
                  </button>
                </Modal>
              </div>
            </div>

            <div className="profile-info-container">
              <span className="profile-degree-container">
                {data?.education || "Nil"}
              </span>
            </div>

            <div className="profile-location-container">
              <span>{data?.city || "Nil"}</span>
            </div>
            {/* <div className="premium-container">
              <h3>Premium</h3>
            </div> */}
          </div>
        </div>
        <div className="about-similar">
          <div className="about-card">
            <div className="about-card-container">
              <div className="user-description">
                <div className="about-user-container">
                  <h3>About {data?.firstName || "user"}</h3>
                </div>
                <div className="description-container">
                  <p>{data?.about || "Nil"}</p>
                </div>
              </div>
              <div className="basic-details-container">
                <div className="basic-details">
                  <div className="heading">
                    <h4>Her basic details</h4>
                  </div>
                  <div className="age-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        person
                      </span>
                      <p>Age</p>
                    </div>
                    <div className="prof-detail same1">
                      {data?.age || "Nil"}{" "}
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
                      <p>{data?.educationDetails || "Nil"}</p>
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
                      <p>{data.state || "Nil"}</p>
                    </div>
                  </div>
                  <div className="spoken-language-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        language
                      </span>
                      <p>Mother Toungue</p>
                    </div>
                    <div className="prof-detail same1">
                      {data?.motherTongue || "Nil"}
                    </div>
                  </div>
                  <div className="profile-created-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">
                        account_circle
                      </span>
                      <p>Profile Created For</p>
                    </div>
                    <div className="prof-detail same1">
                      {data?.relation || "Nil"}
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
                      {data?.maritalStatus || "Nil"}
                    </div>
                  </div>
                  <div className="citizenship-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">flag</span>
                      <p>Citizenship</p>
                    </div>
                    <div className="prof-detail same1">
                      {data?.citizenship || "Nil"}
                    </div>
                  </div>
                  <div className="citizenship-container details-main">
                    <div className="prof-detail same">
                      <span className="material-icons profiles-icon">phone</span>
                      <p>Phone</p>
                    </div>
                    <div className="prof-detail same1">
                      {data?.phoneNumber || "Nil"}
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
                      </svg>{" "}
                    </span>
                    <p>subcaste</p>
                  </div>
                  <div className="prof-detail same1">
                    {data?.subCaste || "Nil"}
                  </div>
                </div>
                <div className="location-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">school</span>
                    <p>Gothram</p>
                  </div>
                  <div className="prof-detail same1">
                    {data?.gothram || "Nil"}
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
                    {data?.dosham || "Nil"}
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
                    {data?.educationDetails || "Nil"}
                  </div>
                </div>
                <div className="location-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">school</span>
                    <p>Occupation</p>
                  </div>
                  <div className="prof-detail same1">
                    {data.occupation || "Nil"}
                  </div>
                </div>
              </div>
              <div className="basic-details-container">
                <div className="about-user-container">
                  <h3>About Family</h3>
                </div>
                <div className="degree-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">home </span>
                    <p>Family Type</p>
                  </div>
                  <div className="prof-detail same1">
                    {data.familyType || "Nil"}
                  </div>
                </div>
                <div className="location-container details-main">
                  <div className="prof-detail same">
                    <span className="material-icons profiles-icon">group</span>
                    <p>Family Values</p>
                  </div>
                  <div className="prof-detail same1">
                    {data?.familyValues || "NIL"}
                  </div>
                </div>
              </div>
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

export default Adminprofile;

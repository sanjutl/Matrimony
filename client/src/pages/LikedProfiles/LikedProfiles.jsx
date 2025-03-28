import React, { useEffect, useState } from "react";
import DashStyles from "./likedprofiles.module.css";
import { HeartStraight } from "phosphor-react";
import { Link, useParams,useNavigate } from "react-router-dom";
import Nav from "../../component/Navbar/Nav";
import Footer from "../../component/Footer/Footer";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import PaginationAdmin from "../Admin/components/PaginationAdmin";
import baseUrl from "../../baseUrl";

function LikedProfiles() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const [getLike, setGetLike] = useState([]);
  const [liked, setLiked] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("top");
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const lastIndex = currentPage * itemsPerPage;
  const indexOfFirstItem = lastIndex - itemsPerPage;
  const currentLikedProfiles = likedProfiles.slice(indexOfFirstItem, lastIndex);
const navigate=useNavigate();
  // const[showHamburger,setShowHamburger]=useState(true);
  const { id } = useParams();
  const getLikedProfiles = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/likedProfiles/${userId}`
      );

      // Convert the array into an object for easy lookups
      const likedProfilesMap = response.data.likedUsers.reduce((acc, user) => {
        acc[user._id] = true;
        return acc;
      }, {});

      setGetLike(response.data.likedUsers); // Keep original array
      setLiked(likedProfilesMap); // Update liked state
    } catch (error) {
      console.log("Error fetching liked profiles", error);
    }
  };
  useEffect(() => {
    if (userId) {
      getLikedProfiles();
    }
  }, [userId]);
  const likedProfile = async (id) => {
    if (!userId || !id) {
      console.error("User ID or Profile ID is undefined");
      return;
    }

    // Optimistically update UI
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/likeProfile/${userId}`,
        { likedId: id }
      );


      // If successfully liked, refresh liked profiles
      getLikedProfiles();
    } catch (error) {
      console.error("Error liking profile:", error);

      // Revert state if API fails
      setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  //   const toggleMenu = () => {
  //     setIsOpen((prev)=>!prev);
  //   };

  //   useEffect(() => {
  //     const handleScrollHam = () => {
  //       document
  //         .querySelectorAll(
  //           `.${DashStyles.FilterIcon}`
  //         )
  //         .forEach((el) => {
  //           if (
  //             window.scrollY > 10 &&
  //             !el.classList.contains(DashStyles.open1) &&
  //             !el.classList.contains(DashStyles.open2) &&
  //             !el.classList.contains(DashStyles.open3)
  //           ) {
  //             el.style.display = "none";
  //           } else {
  //             el.style.display = "block";
  //           }
  //         });
  //     };

  //     window.addEventListener("scroll", handleScrollHam);
  //     return () => {
  //       window.removeEventListener("scroll", handleScrollHam);
  //     };
  //   }, []);
  const fetchLikedUsers = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/likedProfiles/${id}`
      );
      setLikedProfiles(response.data.likedUsers);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchLikedUsers();
  }, [id]);
  const profileView = async (id) => {
    if (!id) {
      console.log("Error fetching id");
      return;
    }
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/usercarddetails/${id}`
      );
      navigate(`/mainuser/${id}`);
    } catch (error) {
      console.log("Error fetching the data", error);
    }
  };
  return (
    <div className={DashStyles.mainContainer}>
      <Nav userId={userId} />
      <div className={DashStyles.PageSelection}>
        <Link
          to={`/likedprofiles/${id}`}
          className={`${DashStyles.heading} ${
            activeTab === "top" ? DashStyles.tabSelected : ""
          }`}
          onClick={() => setActiveTab("top")}
        >
          Liked Profiles
        </Link>

        {/* <Link
          to="/allmatches"
          className={`${DashStyles.heading} ${
            activeTab === "top" ? DashStyles.tabSelected : ""
          }`}
          onClick={() => setActiveTab("top")}
        >
          All Matches
        </Link> */}
      </div>

      <div className={DashStyles.SubContainer}>
        <div
          className={`${DashStyles.Container} ${
            isOpen ? DashStyles.contentDimmed : ""
          }`}
        >
          <div className={DashStyles.OuterBox}>
            <div className={DashStyles.BigBox}></div>
          </div>

          {/* Top recommendation start */}
          <div className={DashStyles.TopRecommendation}>
            <div className={DashStyles.trHeading}>
              <h2 className={DashStyles.TrHead}>Liked Profiles</h2>
              {/* <h4 className={DashStyles.TrContent}>
                    Members who match your partner preference
                  </h4> */}
            </div>
            <div className={DashStyles.trContentDisplay}>
              {currentLikedProfiles.map((item, index) => (
                <div className={DashStyles.trCard} key={index}>
                  <div className={DashStyles.trCardImg}
                    onClick={() => profileView(item._id)}
                  >
                    <img
                          src={
                            item.profilePicture
                              ? `${baseUrl}${item.profilePicture}`
                              : " "
                          }
                          alt=""
                          className={DashStyles.cardImage}
                        />
                  </div>
                  <div className={DashStyles.trCardDetails}>
                    <div className={DashStyles.trCardDetailSub}
                      onClick={() => profileView(item._id)}
                    >
                      <h5 className={DashStyles.trUserName}>
                        {item.firstName}
                      </h5>
                      <h6
                        className={DashStyles.trUserDetails}
                      >{`${item.age} Yrs,${item.height}`}</h6>
                    </div>
                    <div
                      className={DashStyles.LikeButton}
                      onClick={() => likedProfile(item._id)}
                    >
                      <HeartStraight
                        size={20}
                        weight={liked[item._id] ? "fill" : "light"}
                        className={`${DashStyles.likedHeartBefore} ${
                          liked[item._id] ? DashStyles.likedHeart : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PaginationAdmin
      itemsPerPage={itemsPerPage}
      userData={likedProfiles} // Use the full array for pagination logic
      setCurrentPage={setCurrentPage}
    />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LikedProfiles;

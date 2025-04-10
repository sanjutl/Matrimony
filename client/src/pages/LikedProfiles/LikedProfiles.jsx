import React, { useEffect, useState ,useRef} from "react";
import DashStyles from "./likedprofiles.module.css";
import { HeartStraight } from "phosphor-react";
import { Link, useParams,useNavigate } from "react-router-dom";
import Nav from "../../component/Navbar/Nav";
import Footer from "../../component/Footer/Footer";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import PaginationAdmin from "../Admin/components/PaginationAdmin";
import baseUrl from "../../baseUrl";
import avatarImg from "../../assets/avatar.jpg"

function LikedProfiles() {
  const userId = useSelector((state) => state.user.id);
  const [getLike, setGetLike] = useState([]);
  const [liked, setLiked] = useState({});
  const [isOpen, setIsOpen] = useState(false);
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
      if (!userId) return; // Prevent unnecessary API call
      const response = await axios.get(`${baseUrl}/api/v1/user/likedProfiles/${userId}`);
      const likedProfilesMap = response.data.likedUsers.reduce((acc, user) => {
        acc[user._id] = true;
        return acc;
      }, {});
      setGetLike(response.data.likedUsers);
      setLiked(likedProfilesMap);
    } catch (error) {
      console.error("Error fetching liked profiles", error);
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
    // Optimistically update UI before API call
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    if (liked[id]) {
      // Remove the unliked profile from state immediately
      setLikedProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile._id !== id)
      );
    }
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/likeProfile/${userId}`,
        { likedId: id }
      );
      if (!liked[id]) {
        // If liked, re-fetch liked profiles (optional)
        getLikedProfiles();
      }
    } catch (error) {
      console.error("Error liking/unliking profile:", error);
      // Revert state if API call fails
      setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };
 
  const fetchLikedUsers = async () => {
    try {
      if (!userId) return;
      const response = await axios.get(`${baseUrl}/api/v1/user/likedProfiles/${userId}`);
      setLikedProfiles(response.data.likedUsers);
    } catch (error) {
      console.log("Error fetching liked profiles", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchLikedUsers();
    }
  }, [userId]);
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
    const myRef = useRef([]);
    const observerRef = useRef(null); 
      useEffect(() => {
        if (!observerRef.current) {
          observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add(DashStyles.animateIn);
              }
            });
          });
        }
    
        // ✅ Ensure only unique elements are observed
      
    
        myRef.current.forEach((el) => {
          if (el && observerRef.current) observerRef.current.observe(el);
        });
    
        return () => {
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        };
      }, []);
    
      const setElementRef = (index) => (el) => {
        if (el) {
          myRef.current[index] = el;
          if (observerRef.current) observerRef.current.observe(el);
        }
      };
  return (
    <div className={DashStyles.mainContainer}>
      <Nav userId={userId} />
      <div className={DashStyles.SubContainer}>
        <div
          className={`${DashStyles.Container} ${
            isOpen ? DashStyles.contentDimmed : ""
          }`}
        >
          <div className={DashStyles.TopRecommendation}>
            <div className={DashStyles.trHeading}>
              <h2 className={DashStyles.TrHead}>Liked Profiles</h2>
            </div>
            <div className={DashStyles.trContentDisplay}>
              {currentLikedProfiles.map((item, index) => (
                <div className={DashStyles.trCard} key={index}
                ref={(el) => setElementRef(-1)(el)}
                >
                  <div className={DashStyles.trCardImg}
                    onClick={() => profileView(item._id)}
                  >
                    <img
                          src={
                            item.profilePicture
                              ? `${baseUrl}${item.profilePicture}`
                              : `${avatarImg}`
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

import React from "react";
import { motion } from "framer-motion";
import DashStyles from "../../pages/Dashboard/dashboard.module.css";
import { HeartStraight } from "phosphor-react";
import baseUrl from "../../baseUrl";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CardComponent = ({ profiles,profileView,likedProfile,liked, toggleLike}) => {
  
    
    
  return (
    <div >
      
        
        <motion.div
          className="bg-white p-4 rounded-2xl shadow-lg"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div  className={DashStyles.trCard}>
            <div
              className={DashStyles.trCardImg}
              onClick={() => profileView(profiles.id)}
            >
              <img
                src={
                  profiles.profilePicture
                    ? `${baseUrl}${profiles.profilePicture}`
                    : " "
                }
                alt=""
                className={DashStyles.cardImage}
              />
            </div>
            <div className={DashStyles.trCardDetails}>
              <div
                className={DashStyles.trCardDetailSub}
                  onClick={() => profileView(profiles.id)}
              >
                <h5 className={DashStyles.trUserName}>{profiles.name}</h5>
                <h6 className={DashStyles.trUserDetails}>
                  {profiles.age} Yrs ,{profiles.height}
                </h6>
              </div>
              <div
                className={DashStyles.LikeButton}
                  onClick={() => likedProfile(profiles.id)}
              >
                <HeartStraight
                  size={20}
                  weight={liked[profiles.id] ? "fill" : "light"}
                  className={`${DashStyles.likedHeartBefore} ${
                    liked[profiles.id] ? DashStyles.likedHeart : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      
    </div>
  );
};

export default CardComponent;

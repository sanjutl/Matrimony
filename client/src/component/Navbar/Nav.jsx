import React, { useState, useEffect, useRef } from "react";
import "./nav.css";
import axios from "axios";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import baseUrl from "../../baseUrl";
import likeNotification from '../../assets/LikeSound.mp3';

const socket = io(`${baseUrl}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function Nav({ userId }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const audioRef  = useRef(null);
  const [audioAllowed, setAudioAllowed] = useState(false);
  
  useEffect(() => {
    audioRef.current = new Audio(likeNotification);
  }, []);
  
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!audioAllowed) {
        setAudioAllowed(true);
        document.removeEventListener('click', handleUserInteraction);
      }
    };

    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [audioAllowed]);
  useEffect(() => {
    const audio = new Audio(likeNotification);
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;
  }, []);
  useEffect(() => {
    if (!userId) return;
  
    socket.emit("registerUser", userId);
  
    let timeoutId;
  
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/v1/user/unread/${userId}`
        );
        setNotifications(Array.isArray(data?.response) ? data.response : []);
      } catch (error) {
        setNotifications([]);
      } finally {
        timeoutId = setTimeout(fetchNotifications, 10000);
      }
    };
  
    fetchNotifications();
  
    const handleNotification = (newNotification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === newNotification._id);
        return exists ? prev : [newNotification, ...prev];
      });
  
      if (audioRef.current && audioAllowed) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((err) =>
            console.warn("Retrying audio due to error:", err)
          );
      }
    };
  
    socket.on("receiveNotification", handleNotification);
  
    return () => {
      socket.off("receiveNotification", handleNotification);
      clearTimeout(timeoutId);
    };
  }, [userId, audioAllowed]);
  

  const hasUnreadMessages = notifications.some((item) => !item.notified);

  const hideAlert = async (id, senderId) => {
    try {
      await axios.patch(`${baseUrl}/api/v1/user/notificationPreview/${id}`);
      setSelectedSenderId(senderId);
      navigate(`/mainuser/${senderId}`);
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  useEffect(() => {
    if (selectedSenderId) {
      window.location.reload();
    }
  }, [selectedSenderId]);

  return (
    <div>
      <header className="Prof-header7">
        <div className="Prof-header-left7">
          <button
            className="icon-button7"
            onClick={() => navigate(`/dashboard/${userId}`)}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="matches-text">
              <h4 className="NavText">Home</h4>
            </span>
          </button>

          <button
            className="icon-button7"
            onClick={() => navigate(`/toprecommendations/${userId}`)}
          >
            <span className="material-symbols-outlined">group</span>
            <span className="matches-text">
              <h4 className="NavText">Matches</h4>
            </span>
          </button>

          <button
            className="icon-button7"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <span className="material-symbols-outlined">notifications</span>
            <h6 className="NavText">Notification</h6>
            {hasUnreadMessages && <div className="notification-alert"></div>}
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="notification-item"
                      onClick={() =>
                        hideAlert(notification._id, notification.senderId)
                      }
                    >
                      <p>{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
              </div>
            )}
          </button>
        </div>
      </header>
      <hr className="divider7" />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
    </div>
  );
}

export default Nav;
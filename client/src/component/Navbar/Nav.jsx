import React, { useState, useEffect, useCallback } from "react";
import "./nav.css";
import axios from "axios";
import { io } from "socket.io-client";
import { Link, Navigate, useNavigate } from "react-router-dom";
import baseUrl from "../../baseUrl";
const socket = io(`${baseUrl}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function Nav({ userId }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSenderId, setSelectedSenderId] = useState(null);
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

    // Initial fetch
    fetchNotifications();

    const handleNotification = (newNotification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === newNotification._id);
        return exists ? prev : [newNotification, ...prev];
      });
    };

    socket.on("receiveNotification", handleNotification);

    return () => {
      socket.off("receiveNotification", handleNotification);
      clearTimeout(timeoutId); // Clear interval on unmount
    };
  }, [userId]);

  const hasUnreadMessages = notifications.some((item) => !item.notified);

  const hideAlert = async (id, senderId) => {
    try {
      await axios.patch(
        `${baseUrl}/api/v1/user/notificationPreview/${id}`
      );
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
            <span className="material-symbols-outlined ">notifications</span>
            <h6 className="NavText"> Notification</h6>
            {hasUnreadMessages && <div className="notification-alert"></div>}
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="notification-item"
                      // onClick={() => {
                      //   navigate(`/mainuser/${notification.senderId}`);
                      // }}
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
      {/* <div className="content">
        <div className="match-buttons">
          <button className="btn outlined">Regular</button>
          <button className="btn outlined">Premium</button>
        </div>
      </div> */}

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
    </div>
  );
}

export default Nav;

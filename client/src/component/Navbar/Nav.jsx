import React, { useState, useEffect, useRef } from "react";
import "./nav.css";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../baseUrl";
import likeNotification from "../../assets/LikeSound.mp3";

const socket = io(`${baseUrl}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function Nav({ userId }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSenderId, setSelectedSenderId] = useState(null);
<<<<<<< HEAD
  const audioRef = useRef(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio once
  useEffect(() => {
    const audio = new Audio(likeNotification);
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;
    setAudioInitialized(true);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle notification sound playback
  const playNotificationSound = () => {
    if (!audioRef.current) return;
    
    try {
      // Create a new audio context if needed (helps with some browser restrictions)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio played successfully");
          })
          .catch(error => {
            console.warn("Audio play failed, attempting user gesture workaround:", error);
            // Create a hidden button that user can click to enable sounds
            const enableSoundButton = document.createElement('button');
            enableSoundButton.style.display = 'none';
            enableSoundButton.textContent = 'Enable Notification Sounds';
            enableSoundButton.onclick = () => {
              audioRef.current.play()
                .then(() => {
                  document.body.removeChild(enableSoundButton);
                  console.log("Audio played after user gesture");
                })
                .catch(e => console.warn("Fallback play failed:", e));
            };
            document.body.appendChild(enableSoundButton);
            enableSoundButton.click();
          });
      }
    } catch (err) {
      console.warn("Audio playback error:", err);
    }
  };

=======
  const notificationAudio = useRef(new Audio(likeNotification));

  useEffect(() => {
    notificationAudio.current.volume = 1.0;
    notificationAudio.current.muted = false;
  
    const unlockAudio = () => {
      notificationAudio.current.play().catch(() => {});
      notificationAudio.current.pause();
      document.removeEventListener("click", unlockAudio);
    };
  
    document.addEventListener("click", unlockAudio);
  
    return () => {
      document.removeEventListener("click", unlockAudio);
    };
  }, []);
  
>>>>>>> ddfabad07d6c1e216d918df62e177877039f49a6
  useEffect(() => {
    if (!userId || !audioInitialized) return;

    socket.emit("registerUser", userId);
<<<<<<< HEAD

=======
>>>>>>> ddfabad07d6c1e216d918df62e177877039f49a6
    let timeoutId;

    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/v1/user/unread/${userId}`
        );
    
        const newNotifications = Array.isArray(data?.response) ? data.response : [];
        setNotifications((prev) => {
          const prevIds = new Set(prev.map((n) => n._id));
          const unseen = newNotifications.filter(
            (n) => !prevIds.has(n._id) && !n.notified
          );
    
          if (unseen.length > 0) {
            notificationAudio.current
              .play()
              .catch((err) => console.error("🔇 Audio play error:", err));
          }
    
          return newNotifications;
        });
      } catch (error) {
        setNotifications([]);
      } finally {
        timeoutId = setTimeout(fetchNotifications, 10000); // Poll every 10s
      }
    };
<<<<<<< HEAD

=======
    
  
>>>>>>> ddfabad07d6c1e216d918df62e177877039f49a6
    fetchNotifications();

    const handleNotification = (newNotification) => {
      console.log("🔔 Notification received:", newNotification);
    
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === newNotification._id);
        if (!exists) {
<<<<<<< HEAD
          // Play sound when new notification arrives
          playNotificationSound();
=======
          if (!newNotification.notified) {
            notificationAudio.current.play().catch((err) =>
              console.error("🔇 Audio play error:", err)
            );
          }
>>>>>>> ddfabad07d6c1e216d918df62e177877039f49a6
          return [newNotification, ...prev];
        }
        return prev;
      });
    };

<<<<<<< HEAD
=======
    
  
>>>>>>> ddfabad07d6c1e216d918df62e177877039f49a6
    socket.on("receiveNotification", handleNotification);

    return () => {
      socket.off("receiveNotification", handleNotification);
      clearTimeout(timeoutId);
    };
<<<<<<< HEAD
  }, [userId, audioInitialized]);

=======
  }, [userId]);
  
>>>>>>> ddfabad07d6c1e216d918df62e177877039f49a6
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

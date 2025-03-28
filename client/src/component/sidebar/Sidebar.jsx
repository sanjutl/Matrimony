import { React, useState, useEffect, useMemo } from "react";
import "./sidebar.css";
import { Menu, Button } from "antd";
import { clearUser } from "../../features/slice";
import { useSelector } from "react-redux";

import {
  HomeOutlined,
  UserOutlined,
  ContainerOutlined,
  SettingOutlined,
  LogoutOutlined,
  PushpinOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import { NavLink, useLocation,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Sidebar() {
  const dispatch = useDispatch();
const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(window.innerWidth > 768);
  const location = useLocation();
  const { token } = useSelector((state) => state.user);
  const handleLogout=()=>{
    dispatch(clearUser())
    navigate("/");
  }

  const menuItems = useMemo(
    () => [
      { key: "admin", label: "Dashboard", icon: <HomeOutlined />, path: "/Admindashboard" },
      { key: "profile", label: "Profile Verification", icon: <UserOutlined />, path: "/profileVerification" },
      { key: "Report", label: "Reports & Complaints", icon: <ContainerOutlined />, path: "/Adminreport" },
      { key: "settings", label: "Settings", icon: <SettingOutlined />, path: `/Adminsettings/${token}` },
      { key: "signout", label: "Signout", icon: <LogoutOutlined /> ,onClick:handleLogout},
    ],
    [token,handleLogout]
  );

  const pathKey = useMemo(() => {
    const currentPath = location.pathname;
    const matchingItem = menuItems.find(item => item.path === currentPath);
    return matchingItem ? matchingItem.key : ''; // Default to 'admin' if no match
  }, [location, menuItems]);

  // Effect to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsPinned(true);
      } else {
        const savedState = JSON.parse(localStorage.getItem("isPinned"));
        if (savedState !== null) {
          setIsPinned(savedState);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePin = () => {
    if (window.innerWidth <= 768) {
      setIsPinned((prev) => {
        const newState = !prev;
        localStorage.setItem("isPinned", JSON.stringify(newState));
        return newState;
      });
    }
  };

  return (
    <div className="sidebar-container">
      <div className={`sidebar ${isPinned ? "pinned" : "collapsed"}`}>
        <div className="sidebar-content">
          <div className="logo"></div>
          <div className="pin-pin">
            <Button
              aria-label={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
              className="pin-button"
              type="text"
              icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
              onClick={togglePin}
              disabled={window.innerWidth > 768}
            />
          </div>
          <Menu
            className="menu"
            mode="vertical"
            selectedKeys={[pathKey]}
          >
            {menuItems.map(({ key, label, icon, path,onClick }) => (
              <Menu.Item key={key} icon={icon} onClick={onClick}>
                <NavLink to={path}>{isPinned && label}</NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
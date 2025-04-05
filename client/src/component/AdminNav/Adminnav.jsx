import React from "react";
import "./adminnav.css";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate=useNavigate()
  return (
    <div>
      <header className="Prof-header">
        <div className="Prof-header-left">
          <button className="icon-button" onClick={() => navigate(`/Admindashboard`)}>
            <span className="material-symbols-outlined">home</span>
            <span className="matches-text">
              <h6>Home</h6>
            </span>
          </button>

          
        </div>

        {/* <div className="image-upload-icon">
          <Badge count={1}>
            <Avatar shape="round" icon={<UserOutlined />} />
          </Badge>
        </div> */}
      </header>
      <hr className="divider" />

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

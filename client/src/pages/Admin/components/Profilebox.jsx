import React from "react";
import { Link } from "react-router-dom";
import "./profilebox.css"

function Profilebox({ data }) {

  if (!data) return <p>No user data available</p>;

  return (
    <div className="main-container-profiles">
      <div className="profiles">
        <div className="profile-content">
          <div className="profile-names">
            <p>Name: {data.firstName || "N/A"}</p>
          </div>
          <div className="profiles-id">
            <p>ID: {data.userId || "Unknown"}</p>
          </div>
          <div className="profile-view">
            <Link to={`/Adminusersview/${data._id}`} className="custom-link">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilebox;

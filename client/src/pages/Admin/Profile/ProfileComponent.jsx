import React from 'react'
import { Link } from "react-router-dom";
import "./ProfileComponent"

function ReportComponent({data} ) {
    
  if (!data) return <p>No user data available</p>;
  

  return (
    
    <div className="main-container-profiles">
      <div className="profiles">
        <div className="profile-content">
          <div className="profile-names">
            <p>Name: {data.firstName || "N/A"}</p>
          </div>
          <div className="profiles-id">
            <p>ID: {data._id || "Unknown"}</p>
          </div>
          <div className="profile-view">
            <Link to={`/userProfileVerify/${data._id}`} className="custom-link">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportComponent

import React, { useState } from "react";
import "./AdminReportPage.css";
import Sidebar from "../../../component/sidebar/Sidebar";
import verification from "../../../assets/circle-check-regular.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Profilebox from "../components/ReportComponent.jsx";
import baseUrl from "../../../baseUrl.js";


function AdminReportPage() {
  const[UserData,setUserData]=useState([]);
  console.log("this",UserData)
  
   const fetchReportData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/getComplaint`
      );
      if(response.status===200){
          setUserData(response.data.reportedUser || [])
        
      }else{
        console.log("no users found");
        
      }
    } catch (error) {
      console.log(error);
      
    }
  };
  useEffect(()=>{
    fetchReportData()
  },[])
  return (
    <div>
      <div className="admin-dashboard">
        <div className="container-main">
          <div className="nav">
            <Sidebar />
          </div>
          <div className="contents">
            
            <div className="second-part">
              <div className="heading-container">
                <div className="heading">
                  <h1>Reports And Complaints</h1>
                </div>
              </div>
              <div className="profiles-container">
                <div className="main-container-profiles">
                  <div className="profile-container">
                  {UserData.length > 0 ? (
                      UserData.map((user) => {
                        return <Profilebox key={user._id} data={user} />;
                       
                        
                      })
                    ) : (
                      <p>No profiles available</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="see-all-link">
                <Link className="custom-link" to={"/getFullReport"}>
                  See all
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReportPage;

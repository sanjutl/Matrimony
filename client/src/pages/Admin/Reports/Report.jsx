import React, { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar/Sidebar.jsx";
import "./report.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import baseUrl from "../../../baseUrl.js";
function Report() {
  const{id}=useParams()  
  const [userData,setUserData]=useState({});  
  
  useEffect(()=>{
    fetchUserData()
  },[])
  const fetchUserData=async(req,res)=>{
    try {
      const response=await axios.get (`${baseUrl}/api/v1/user/usercarddetails/${id}`)
      setUserData(response.data);
      
    } catch (error) {
      res.status(400)("server error")
    }
  }
  return (
    <div>
      <div className="report-container">
        <div className="container-main">
          <div className="nav">
            <Sidebar /> 
          </div>
          <div className="contents">
            <div className="first-part">
              <div className="report-main">
                <div className="heading">
                  <h1>Reports & Complaints</h1>
                </div>
              </div>
            </div>
            <div className="box-contents">
              <div className="second-part">
                <div className="sub-container">
                  <div className="left-content">
                    <div className="heading">
                      <h3>Abuse Category</h3>
                    </div>
                    <div className="description">
                      <p>{userData.data?.abuseCategory||"nil"}</p>
                    </div>
                  </div>
                  <div className="right-content">
                    <div className="heading">
                      <h3>Subject</h3>
                    </div>
                    <div className="description">
                      <p>{userData.data?.subject||"nil"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="third-part">
                <div className="heading">
                  <h3>Complaint and Details</h3>
                </div>
                <div className="description">
                  <p>
                  {userData.data?.subject||"nil"}
                  </p>
                </div>
              </div>
              <div className="third-part">
                <div className="heading">
                  <h3>Complaint and Details</h3>
                </div>
                <div className="description">
                  <p>
                  {userData.data?.complaint|| "nil"}
                  </p>
                </div>
              </div>
              <div className="fourth-part">
                <div className="heading">
                  <h3>Complaint aginst ID / User name </h3>
                </div>
                <div className="description">
                  <p>{userData.data?.complainstAgainst}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  );
}

export default Report;

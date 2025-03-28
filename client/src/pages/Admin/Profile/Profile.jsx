import React from "react";
import "./Profile.css";
import Sidebar from "../../../component/sidebar/Sidebar";
import Profilebox from "./ProfileComponent"
import {useState,useEffect} from "react"
import axios from "axios"
import { Link } from "react-router-dom";
import baseUrl from "../../../baseUrl";


function Profile() {

const [UserData,setuserData]=useState([])
const showData=UserData.slice(0,4)
const fetchuserData=async (req,res) => {
  
  const response=await axios.get(`${baseUrl}/api/v1/user/unverfieduser`)
  if(response.status===200){
    setuserData(response.data.unverfiedUser || [  ])
    console.log("this",response.data.unverfiedUser);
    
  }else{
    console.log("no users found");
    
  }
}
useEffect(()=>{
fetchuserData()
},[])


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
                  <h1>Profile Verification</h1>
                </div>
              </div>
              <div className="main-second-part-report">
                <div className="second-part-report">
                  <div className="second-part-profile-container">
                  {showData.length > 0 ? (
                      showData.map((user) => {
                        return <Profilebox key={user._id} data={user} />;
                       
                        
                      })
                    ) : (
                      <p>No profiles available</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="see-all-link">
                <Link className="custom-link" to={"/unverifieduser"}>
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

export default Profile;

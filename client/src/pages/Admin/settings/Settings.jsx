import React, { useState } from "react";
import Sidebar from "../../../component/sidebar/Sidebar";
import "./settings.css";
import pic from "../../../assets/serious-man-portrait-real-people-high-definition-grey-background-photo.jpg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { message } from "antd";
import baseUrl from "../../../baseUrl";


function Settings() {
  
  const {token}=useParams()
   const notifySuccess = (message) => toast.success(message);
 
  const [form, setForm] = useState({});
  const handleChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      const response = await axios.patch(`${baseUrl}/api/v1/admin/resetpassword/${token}`,form)
      
      
      if(response.status===200){
        toast.success("Password Updated Successfully")
        setForm({password:"",newPassword:""})
      }
    } catch (error) {
      
    }
  }
  return (
    <div>
      <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
              />
      <div className="settings-container">
        <div className="container-main">
          <div className="nav">
            <Sidebar />
          </div>
          <div className="contents">
            <div className="first-part">
              <div className="report-main">
                <div className="heading">
                  <h1>Settings</h1>
                </div>
              </div>
            </div>
            <div className="box-contents">
              <div className="part-one">
                <div className="profile-container">
                  <div className="profile-icon">
                    <img src={pic} alt="" />
                  </div>
                  
                </div>
              </div>
              <div className="part-two">
                <form onSubmit={handleSubmit}>
                  <div className="form-container-main">
                    <div className="user-name ">
                      <label>Password</label>
                      <input type="text" onChange={handleChange} value={form.password} name="password"/>
                    </div>
                    <div className="pass-username">
                      <div className="password">
                      <label>New Password</label>
                      <input type="text" value={form.newPassword} onChange={handleChange} name="newPassword"/>
                      </div>
                    </div>
                  </div>
                  <div className="save-button">
                    <button>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

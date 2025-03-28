import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AdminVerfication.css";
import Sidebar from "../../../component/sidebar/Sidebar.jsx";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import baseUrl from "../../../baseUrl.js";

function AdminVerification() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/usercarddetails/${id}`
      );
      setUserData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="main-container-admin-verification">
      <div className="sub-container-1">
        <div className="nav">
          <Sidebar />
        </div>
        <div className="verification-sub">
          <h1>PDF Document Review</h1>

          {/* Check if userData and pdfFile exist before rendering */}
          {userData?.data?.pdfFile ? (
            <div style={{ height: "600px", border: "1px solid #ccc" }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={`${baseUrl}${userData.data.pdfFile}`} />
              </Worker>
            </div>
          ) : (
            <p>No PDF available for this user.</p>
          )}

          {/* <div className="button-container">
            <button id="reject-btn" disabled>
              Reject
            </button>
            <button id="verify-btn" disabled>
              Verify
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AdminVerification;

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Profilebox from "./ProfileComponent";
import Pagination from "../components/PaginationAdmin";
import "./GetFullProfile.css";
import baseUrl from "../../../baseUrl";
import Nav from "../../../component/AdminNav/Adminnav";


function GetFullProfile() {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  let lastIndex = currentPage * itemsPerPage;
  let indexOfFirstItem = lastIndex - itemsPerPage;
  let showItem = userData.slice(indexOfFirstItem, lastIndex);

  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/unverfieduser`
      );
      setUserData(response.data.unverfiedUser || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  if (!fetchUserData) return <div>loading...</div>;
  return (
    <div>
      <Nav/>
      <div className="getfullprofile-main">
        <h1>All Unverified Users</h1>
        {userData.length > 0 ? (
          showItem.map((user) => {
            return <Profilebox key={user._id} data={user} />;
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="pagination-container">
        <Pagination
          userData={userData}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default GetFullProfile;

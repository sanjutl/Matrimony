import React, { useEffect, useState, useRef} from "react";
import { motion } from "framer-motion";

import DashStyles from "../Dashboard/dashboard.module.css";
import { HeartStraight, SlidersHorizontal, Pencil, X } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assets/free-photo-of-couple-in-green-grass-field.jpeg";
import Nav from "../../component/Navbar/Nav";
import Footer from "../../component/Footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import PaginationAdmin from "../Admin/components/PaginationAdmin";
import baseUrl from "../../baseUrl";
import CardComponent from "../../component/CardCpmponent/CardComponent";

function TopRecommendation() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const [getLike, setGetLike] = useState([]);
  const [liked, setLiked] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("top");
  const [topMatches, setTopMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]); // Stores filtered matches
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const currentData = filtersApplied ? filteredMatches : topMatches;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = currentData.slice(indexOfFirstItem, indexOfLastItem);

  const [filters, setFilters] = useState({
    age: "",
    height: "",
    maritalStatus: "",
    occupation: "",
    annualIncome: "",
    education: "",
    location: "",
  });
  const toggleLike = (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the like state
    }));
  };

  // const lastIndex = currentPage * itemsPerPage;
  // const indexOfFirstItem = lastIndex - itemsPerPage;

  // const showItems = useMemo(() => {
  //   const data = filteredMatches.length > 0 ? filteredMatches : "No Matches Available";
  //   return data.slice(indexOfFirstItem, lastIndex);
  // }, [topMatches, filteredMatches, currentPage]);
  const navigate = useNavigate();
  // const[showHamburger,setShowHamburger]=useState(true);
  const getLikedProfiles = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/likedProfiles/${userId}`
      );

      // Convert the array into an object for easy lookups
      const likedProfilesMap = response.data.likedUsers.reduce((acc, user) => {
        acc[user._id] = true;
        return acc;
      }, {});

      setGetLike(response.data.likedUsers); // Keep original array
      setLiked(likedProfilesMap); // Update liked state
    } catch (error) {
      console.log("Error fetching liked profiles", error);
    }
  };
  useEffect(() => {
    if (userId) {
      getLikedProfiles();
    }
  }, [userId]);
  const likedProfile = async (id) => {
    if (!userId || !id) {
      console.error("User ID or Profile ID is undefined");
      return;
    }

    // Optimistically update UI
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/likeProfile/${userId}`,
        { likedId: id }
      );

      // If successfully liked, refresh liked profiles
      getLikedProfiles();
    } catch (error) {
      console.error("Error liking profile:", error);

      // Revert state if API fails
      setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScrollHam = () => {
      const filterIcons = document.querySelectorAll(
        `[class*="${DashStyles.FilterIcon}"]`
      );
      filterIcons.forEach((el) => {
        if (
          window.scrollY > 10 &&
          !el.classList.contains(DashStyles.FilterCloseIcon)
        ) {
          el.style.display = "none";
        } else {
          el.style.display = "block";
        }
      });
    };

    window.addEventListener("scroll", handleScrollHam);
    return () => {
      window.removeEventListener("scroll", handleScrollHam);
    };
  }, []);

  const TopMatch = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/topmatch/${userId}`
      );

      setTopMatches(response.data.matches);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (userId) {
      TopMatch();
    }
  }, [userId]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  const applyFilters = () => {
    const isFiltersApplied = Object.values(filters).some((val) => val !== "");
    const filteredData = topMatches.filter((item) => {
      const numericHeight = item.height
        ? parseInt(item.height.replace(/[^0-9]/g, ""), 10)
        : null;
      const [minHeight, maxHeight] = filters.height
        ? filters.height.split("-").map((num) => parseInt(num, 10))
        : [null, null];
      const [minAge, maxAge] = filters.age
        ? filters.age.split("-").map((num) => parseInt(num, 10))
        : [null, null];

      return (
        (filters.age === "" || (item.age >= minAge && item.age <= maxAge)) &&
        (filters.height === "" ||
          (numericHeight >= minHeight && numericHeight <= maxHeight)) &&
        (filters.maritalStatus === "" ||
          item.maritalStatus?.toLowerCase() ===
            filters.maritalStatus?.toLowerCase()) &&
        (filters.occupation === "" ||
          item.occupation?.toLowerCase() ===
            filters.occupation?.toLowerCase()) &&
        (filters.annualIncome === "" ||
          item.annualIncome?.toLowerCase() ===
            filters.annualIncome?.toLowerCase()) &&
        (filters.education === "" ||
          item.education?.toLowerCase() === filters.education?.toLowerCase())&&
          (filters.location === "" ||
            item.location?.toLowerCase() === filters.location?.toLowerCase())
      );
    });

    setCurrentPage(1);
    setFilteredMatches(filteredData);
    setFiltersApplied(isFiltersApplied);
    if (isOpen) setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      age: "",
      height: "",
      maritalStatus: "",
      occupation: "",
      annualIncome: "",
      education: "",
      location:""
    });
    setFilteredMatches(topMatches);
    setFiltersApplied(false);
    setCurrentPage(1);
    if(isOpen)setIsOpen(false);

  };
  // to view individual profiles
  const profileView = async (id) => {
    if (!id) {
      console.log("Error fetching id");
      return;
    }
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/usercarddetails/${id}`
      );
      navigate(`/mainuser/${id}`);
    } catch (error) {
      console.log("Error fetching the data", error);
    }
  };
  const myRef = useRef([]);
  const observerRef = useRef(null); // ✅ Ensure it's null initially
  const headingRef = useRef([]); // ✅ Separate ref for heading

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(DashStyles.animateIn);
          }
        });
      });
    }

    // ✅ Ensure only unique elements are observed
    headingRef.current.forEach((el) => {
      if (el && observerRef.current) observerRef.current.observe(el);
    });

    myRef.current.forEach((el) => {
      if (el && observerRef.current) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const setElementRef = (index) => (el) => {
    if (el) {
      myRef.current[index] = el;
      if (observerRef.current) observerRef.current.observe(el);
    }
  };

  const setHeadingRef = (index) => (el) => {
    if (el) {
      headingRef.current[index] = el;
      if (observerRef.current) observerRef.current.observe(el);
    }
  };
  return (
    <div className={DashStyles.mainContainer}>
      <Nav userId={userId} />
      <div className={DashStyles.PageSelection}>
        <Link
          to={`/toprecommendations/${userId}`}
          className={`${DashStyles.heading} ${
            activeTab === "top" ? DashStyles.tabSelected : ""
          }`}
          onClick={() => setActiveTab("top")}
        >
          Top Recommendations
        </Link>

        <Link
          to={`/allmatches/${userId}`}
          className={`${DashStyles.heading} ${
            activeTab === "all" ? DashStyles.tabSelected : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Matches
        </Link>
      </div>

      <div className={DashStyles.SubContainer}>
        {/* Filter div start */}

        <div className={DashStyles.FilterDivMain}>
          <div className={DashStyles.FilterDiv}>
            <div className={DashStyles.FilterProfiles}>
              <h3 className={DashStyles.FilterProfilesHeading}>
                Filter Profiles
              </h3>
            </div>
            <div className={DashStyles.BasicDetailsMainDiv}>
              <h3 className={DashStyles.BasicDetailsHead}>Basic Details</h3>
              <div className={DashStyles.BasicDetailsDiv}>
                <select
                  name="age"
                  className={DashStyles.bdSelect}
                  onChange={handleFilterChange}
                  value={filters.age}
                >
                  <option>Age</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46-55">46-55</option>
                  <option value="56-65">56-65</option>
                </select>
                <select
                  name="height"
                  className={DashStyles.bdSelect}
                  onChange={handleFilterChange}
                  value={filters.height}
                >
                  <option>Height</option>
                  <option value="135-145">135-145</option>
                  <option value="145-155">145-155</option>
                  <option value="155-165">155-165</option>
                  <option value="165-175">165-175</option>
                  <option value="175-185">175-185</option>
                  <option value="185-195">185-195</option>
                  <option value="195-200">195-200</option>
                </select>

                <select
                  name="maritalStatus"
                  className={DashStyles.bdSelect}
                  onChange={handleFilterChange}
                  value={filters.maritalStatus}
                >
                  <option>Marital Status</option>
                  <option value="Never Married">Never Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
                </select>
               <select
                                  name="location"
                                  className={DashStyles.bdSelect}
                                  value={filters.location}
                                  onChange={handleFilterChange}
                                >
                                  <option>Location</option>
                                  <option value="Aberdeen">Aberdeen</option>
                <option value="Antrim">Antrim</option>
                <option value="Armagh">Armagh</option>
                <option value="Ballymena">Ballymena</option>
                <option value="Bangor">Bangor</option>
                <option value="Bangor">Bangor</option>
                <option value="Barry">Barry</option>
                <option value="Belfast">Belfast</option>
                <option value="Birmingham">Birmingham</option>
                <option value="Blackpool">Blackpool</option>
                <option value="Bradford">Bradford</option>
                <option value="Bridgend">Bridgend</option>
                <option value="Brighton">Brighton</option>
                <option value="Bristol">Bristol</option>
                <option value="Caerphilly">Caerphilly</option>
                <option value="Cambridge">Cambridge</option>
                <option value="Carrickfergus">Carrickfergus</option>
                <option value="Cardiff">Cardiff</option>
                <option value="Coleraine">Coleraine</option>
                <option value="Coventry">Coventry</option>
                <option value="Derry">Derry</option>
                <option value="Dundee">Dundee</option>
                <option value="Dunfermline">Dunfermline</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="Exeter">Exeter</option>
                <option value="Falkirk">Falkirk</option>
                <option value="Glasgow">Glasgow</option>
                <option value="Inverness">Inverness</option>
                <option value="Leeds">Leeds</option>
                <option value="Leicester">Leicester</option>
                <option value="Lisburn">Lisburn</option>
                <option value="Liverpool">Liverpool</option>
                <option value="Livingston">Livingston</option>
                <option value="London">London</option>
                <option value="Luton">Luton</option>
                <option value="Llanelli">Llanelli</option>
                <option value="Manchester">Manchester</option>
                <option value="Merthyr Tydfil">Merthyr Tydfil</option>
                <option value="Newcastle">Newcastle</option>
                <option value="Newport">Newport</option>
                <option value="Newry">Newry</option>
                <option value="Nottingham">Nottingham</option>
                <option value="Norwich">Norwich</option>
                <option value="Oxford">Oxford</option>
                <option value="Paisley">Paisley</option>
                <option value="Perth">Perth</option>
                <option value="Plymouth">Plymouth</option>
                <option value="Portsmouth">Portsmouth</option>
                <option value="Sheffield">Sheffield</option>
                <option value="Southampton">Southampton</option>
                <option value="Stirling">Stirling</option>
                <option value="Swansea">Swansea</option>
                <option value="Wrexham">Wrexham</option>
                <option value="York">York</option>
                                </select>
              </div>
            </div>

            <div className={DashStyles.ProfessionalDetailsMainDiv}>
              <h3 className={DashStyles.ProfessionalDetailsHead}>
                Professional Details
              </h3>
              <div className={DashStyles.ProfessionalDetailsDiv}>
                <select
                  name="occupation"
                  className={DashStyles.pdSelect}
                  onChange={handleFilterChange}
                  value={filters.occupation}
                >
                  <option>Occupation</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Paramedic">Paramedic</option>
                  <option value="Physiotherapist">Physiotherapist</option>
                  <option value="Care Worker">Care Worker</option>

                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Civil Engineer">Civil Engineer</option>
                  <option value="Mechanical Engineer">
                    Mechanical Engineer
                  </option>
                  <option value="Electrical Engineer">
                    Electrical Engineer
                  </option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="It Consultant">IT Consultant</option>

                  <option value="Teacher">Teacher</option>
                  <option value="Lecturer">University Lecturer</option>
                  <option value="Teaching Assistant">Teaching Assistant</option>

                  <option value="Accountant">Accountant</option>
                  <option value="Banker">Banker</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Solicitor">Solicitor</option>
                  <option value="Barrister">Barrister</option>

                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Mechanic">Mechanic</option>

                  <option value="Police Officer">Police Officer</option>
                  <option value="Firefighter">Firefighter</option>
                  <option value="Armed Forces">Armed Forces</option>
                  <option value="Social Worker">Social Worker</option>

                  <option value="Chef">Chef</option>
                  <option value="Hotel Manager">Hotel Manager</option>
                  <option value="Retail Manager">Retail Manager</option>
                  <option value="Customer Service">
                    Customer Service Representative
                  </option>

                  <option value="Journalist">Journalist</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Actor">Actor</option>
                  <option value="Musician">Musician</option>

                  <option value="Truck Driver">Truck Driver</option>
                  <option value="Delivery Driver">Delivery Driver</option>
                  <option value="Airline Pilot">Airline Pilot</option>

                  <option value="Self Employed">Self-Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                  <option value="Others">Others</option>
                </select>

                <select
                  name="annualIncome"
                  className={DashStyles.pdSelect}
                  onChange={handleFilterChange}
                  value={filters.annualIncome}
                >
                  <option>Annual Income</option>
                  <option value="under_15000">Under £15,000</option>
                  <option value="15000_25000">£15,000 - £25,000</option>
                  <option value="25000_35000">£25,000 - £35,000</option>
                  <option value="35000_50000">£35,000 - £50,000</option>
                  <option value="50000_75000">£50,000 - £75,000</option>
                  <option value="75000_100000">£75,000 - £100,000</option>
                  <option value="100000_150000">£100,000 - £150,000</option>
                  <option value="150000_250000">£150,000 - £250,000</option>
                  <option value="over_250000">Over £250,000</option>
                </select>

                <select
                  name="education"
                  className={DashStyles.pdSelect}
                  onChange={handleFilterChange}
                  value={filters.education}
                >
                  <option>Education</option>
                  <option value="Below 10">Below 10th</option>
                  <option value="10th">10th (SSLC/Matriculation)</option>
                  <option value="12th Science">12th - Science</option>
                  <option value="12th Humanities">12th - Humanities</option>
                  <option value="12th Commerce">12th - Commerce</option>
                  <option value="Diploma">Diploma</option>
                  <option value="BSc">BSc (Bachelor of Science)</option>
                  <option value="BA">BA (Bachelor of Arts)</option>
                  <option value="BCom">BCom (Bachelor of Commerce)</option>
                  <option value="BTech">BTech (Bachelor of Technology)</option>
                  <option value="BE">BE (Bachelor of Engineering)</option>
                  <option value="BBA">
                    BBA (Bachelor of Business Administration)
                  </option>
                  <option value="BCA">
                    BCA (Bachelor of Computer Applications)
                  </option>
                  <option value="LLB">LLB (Bachelor of Law)</option>
                  <option value="MBBS">
                    MBBS (Bachelor of Medicine & Surgery)
                  </option>
                  <option value="BPharm">BPharm (Bachelor of Pharmacy)</option>
                  <option value="BDS">BDS (Bachelor of Dental Surgery)</option>
                  <option value="MSC">MSc (Master of Science)</option>
                  <option value="MA">MA (Master of Arts)</option>
                  <option value="MCom">MCom (Master of Commerce)</option>
                  <option value="MTech">MTech (Master of Technology)</option>
                  <option value="ME">ME (Master of Engineering)</option>
                  <option value="MBA">
                    MBA (Master of Business Administration)
                  </option>
                  <option value="MCA">
                    MCA (Master of Computer Applications)
                  </option>
                  <option value="LLM">LLM (Master of Law)</option>
                  <option value="MD">MD (Doctor of Medicine)</option>
                  <option value="MS">MS (Master of Surgery)</option>
                  <option value="MPhil">MPhil (Master of Philosophy)</option>
                  <option value="PhD">PhD (Doctorate)</option>
                </select>
              </div>
            </div>

            <div className={DashStyles.FilterDivButtonsMain}>
              <button
                className={DashStyles.FilterDivButtonOne}
                onClick={applyFilters}
              >
                Apply
              </button>
              <button
                className={DashStyles.FilterDivButtonOne}
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {/* filter div end */}
        {/* Profile details div for smalle screens start */}
        <div
          className={isOpen ? "overlay overlayActive" : "overlay"}
          // onClick={toggleMenu}
        >
          <div className={DashStyles.HamburgerMain}>
            {/* {showHamburger&&( */}
            <div className={DashStyles.FilterHam} onClick={() => toggleMenu()}>
              {isOpen ? (
                <X
                  size={40}
                  weight="bold"
                  className={DashStyles.FilterCloseIcon}
                />
              ) : (
                <SlidersHorizontal
                  size={40}
                  weight="duotone"
                  className={DashStyles.FilterIcon}
                />
              )}
            </div>
            {/* )} */}
            {/* profile div for smaller screens */}
            <div
              className={`${DashStyles.drawer} ${
                isOpen ? DashStyles.drawerOpen : DashStyles.drawerClosed
              }`}
            >
              {/* <div className={DashStyles.FilterDiv}> */}
              <div className={DashStyles.FilterProfiles}>
                <h3 className={DashStyles.FilterProfilesHeading}>
                  Filter Profiles
                </h3>
              </div>
              <div className={DashStyles.BasicDetailsMainDiv}>
                <h3 className={DashStyles.BasicDetailsHead}>Basic Details</h3>
                <div className={DashStyles.BasicDetailsDiv}>
                  <select
                    name="age"
                    className={DashStyles.bdSelect}
                    onChange={handleFilterChange}
                    value={filters.age}
                  >
                    <option>Age</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46-55">46-55</option>
                    <option value="56-65">56-65</option>
                  </select>
                  <select
                    name="height"
                    className={DashStyles.bdSelect}
                    value={filters.height}
                    onChange={handleFilterChange}
                  >
                    <option>Height</option>
                    <option value="135-145">135-145</option>
                    <option value="145-155">145-155</option>
                    <option value="155-165">155-165</option>
                    <option value="165-175">165-175</option>
                    <option value="175-185">175-185</option>
                    <option value="185-195">185-195</option>
                    <option value="195-200">195-200</option>
                  </select>

                  <select
                    name="maritalStatus"
                    className={DashStyles.bdSelect}
                    onChange={handleFilterChange}
                    value={filters.maritalStatus}
                  >
                    <option>Marital Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                  </select>
                   <select
                                      name="location"
                                      className={DashStyles.bdSelect}
                                      value={filters.location}
                                      onChange={handleFilterChange}
                                    >
                                      <option>Location</option>
                                      <option value="Aberdeen">Aberdeen</option>
                    <option value="Antrim">Antrim</option>
                    <option value="Armagh">Armagh</option>
                    <option value="Ballymena">Ballymena</option>
                    <option value="Bangor">Bangor</option>
                    <option value="Bangor">Bangor</option>
                    <option value="Barry">Barry</option>
                    <option value="Belfast">Belfast</option>
                    <option value="Birmingham">Birmingham</option>
                    <option value="Blackpool">Blackpool</option>
                    <option value="Bradford">Bradford</option>
                    <option value="Bridgend">Bridgend</option>
                    <option value="Brighton">Brighton</option>
                    <option value="Bristol">Bristol</option>
                    <option value="Caerphilly">Caerphilly</option>
                    <option value="Cambridge">Cambridge</option>
                    <option value="Carrickfergus">Carrickfergus</option>
                    <option value="Cardiff">Cardiff</option>
                    <option value="Coleraine">Coleraine</option>
                    <option value="Coventry">Coventry</option>
                    <option value="Derry">Derry</option>
                    <option value="Dundee">Dundee</option>
                    <option value="Dunfermline">Dunfermline</option>
                    <option value="Edinburgh">Edinburgh</option>
                    <option value="Exeter">Exeter</option>
                    <option value="Falkirk">Falkirk</option>
                    <option value="Glasgow">Glasgow</option>
                    <option value="Inverness">Inverness</option>
                    <option value="Leeds">Leeds</option>
                    <option value="Leicester">Leicester</option>
                    <option value="Lisburn">Lisburn</option>
                    <option value="Liverpool">Liverpool</option>
                    <option value="Livingston">Livingston</option>
                    <option value="London">London</option>
                    <option value="Luton">Luton</option>
                    <option value="Llanelli">Llanelli</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Merthyr Tydfil">Merthyr Tydfil</option>
                    <option value="Newcastle">Newcastle</option>
                    <option value="Newport">Newport</option>
                    <option value="Newry">Newry</option>
                    <option value="Nottingham">Nottingham</option>
                    <option value="Norwich">Norwich</option>
                    <option value="Oxford">Oxford</option>
                    <option value="Paisley">Paisley</option>
                    <option value="Perth">Perth</option>
                    <option value="Plymouth">Plymouth</option>
                    <option value="Portsmouth">Portsmouth</option>
                    <option value="Sheffield">Sheffield</option>
                    <option value="Southampton">Southampton</option>
                    <option value="Stirling">Stirling</option>
                    <option value="Swansea">Swansea</option>
                    <option value="Wrexham">Wrexham</option>
                    <option value="York">York</option>
                                    </select>
                </div>
              </div>

              <div className={DashStyles.ProfessionalDetailsMainDiv}>
                <h3 className={DashStyles.ProfessionalDetailsHead}>
                  Professional Details
                </h3>
                <div className={DashStyles.ProfessionalDetailsDiv}>
                  <select
                    name="occupation"
                    className={DashStyles.pdSelect}
                    value={filters.occupation}
                    onChange={handleFilterChange}
                  >
                    <option>Occupation</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Dentist">Dentist</option>
                    <option value="Paramedic">Paramedic</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                    <option value="Care Worker">Care Worker</option>

                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Civil Engineer">Civil Engineer</option>
                    <option value="Mechanical Engineer">
                      Mechanical Engineer
                    </option>
                    <option value="Electrical Engineer">
                      Electrical Engineer
                    </option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="It Consultant">IT Consultant</option>

                    <option value="Teacher">Teacher</option>
                    <option value="Lecturer">University Lecturer</option>
                    <option value="Teaching Assistant">
                      Teaching Assistant
                    </option>

                    <option value="Accountant">Accountant</option>
                    <option value="Banker">Banker</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                    <option value="Solicitor">Solicitor</option>
                    <option value="Barrister">Barrister</option>

                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Mechanic">Mechanic</option>

                    <option value="Police Officer">Police Officer</option>
                    <option value="Firefighter">Firefighter</option>
                    <option value="Armed Forces">Armed Forces</option>
                    <option value="Social Worker">Social Worker</option>

                    <option value="Chef">Chef</option>
                    <option value="Hotel Manager">Hotel Manager</option>
                    <option value="Retail Manager">Retail Manager</option>
                    <option value="Customer Service">
                      Customer Service Representative
                    </option>

                    <option value="Journalist">Journalist</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                    <option value="Actor">Actor</option>
                    <option value="Musician">Musician</option>

                    <option value="Truck Driver">Truck Driver</option>
                    <option value="Delivery Driver">Delivery Driver</option>
                    <option value="Airline Pilot">Airline Pilot</option>

                    <option value="Self Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                    <option value="Others">Others</option>
                  </select>
                  <select
                    name="annualIncome"
                    className={DashStyles.pdSelect}
                    value={filters.annualIncome}
                    onChange={handleFilterChange}
                  >
                    <option>Annual Income</option>
                    <option value="15000_25000">£15,000 - £25,000</option>
                    <option value="25000_35000">£25,000 - £35,000</option>
                    <option value="35000_50000">£35,000 - £50,000</option>
                    <option value="50000_75000">£50,000 - £75,000</option>
                    <option value="75000_100000">£75,000 - £100,000</option>
                    <option value="100000_150000">£100,000 - £150,000</option>
                    <option value="150000_250000">£150,000 - £250,000</option>
                    <option value="over_250000">Over £250,000</option>
                  </select>
                  <select
                    name="education"
                    className={DashStyles.pdSelect}
                    value={filters.education}
                    onChange={handleFilterChange}
                  >
                    <option>Education</option>
                    <option value="Below 10">Below 10th</option>
                    <option value="10th">10th (SSLC/Matriculation)</option>
                    <option value="12th Science">12th - Science</option>
                    <option value="12th Humanities">12th - Humanities</option>
                    <option value="12th Commerce">12th - Commerce</option>
                    <option value="Diploma">Diploma</option>
                    <option value="BSc">BSc (Bachelor of Science)</option>
                    <option value="BA">BA (Bachelor of Arts)</option>
                    <option value="BCom">BCom (Bachelor of Commerce)</option>
                    <option value="BTech">
                      BTech (Bachelor of Technology)
                    </option>
                    <option value="BE">BE (Bachelor of Engineering)</option>
                    <option value="BBA">
                      BBA (Bachelor of Business Administration)
                    </option>
                    <option value="BCA">
                      BCA (Bachelor of Computer Applications)
                    </option>
                    <option value="LLB">LLB (Bachelor of Law)</option>
                    <option value="MBBS">
                      MBBS (Bachelor of Medicine & Surgery)
                    </option>
                    <option value="BPharm">
                      BPharm (Bachelor of Pharmacy)
                    </option>
                    <option value="BDS">
                      BDS (Bachelor of Dental Surgery)
                    </option>
                    <option value="MSC">MSc (Master of Science)</option>
                    <option value="MA">MA (Master of Arts)</option>
                    <option value="MCom">MCom (Master of Commerce)</option>
                    <option value="MTech">MTech (Master of Technology)</option>
                    <option value="ME">ME (Master of Engineering)</option>
                    <option value="MBA">
                      MBA (Master of Business Administration)
                    </option>
                    <option value="MCA">
                      MCA (Master of Computer Applications)
                    </option>
                    <option value="LLM">LLM (Master of Law)</option>
                    <option value="MD">MD (Doctor of Medicine)</option>
                    <option value="MS">MS (Master of Surgery)</option>
                    <option value="MPhil">MPhil (Master of Philosophy)</option>
                    <option value="PhD">PhD (Doctorate)</option>
                  </select>
                </div>
              </div>
              <div className={DashStyles.FilterDivButtonsMain}>
                <button
                  className={DashStyles.FilterDivButtonOne}
                  onClick={applyFilters}
                >
                  Apply
                </button>
                <button
                  className={DashStyles.FilterDivButtonOne}
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${DashStyles.Container} ${
            isOpen ? DashStyles.contentDimmed : ""
          }`}
        >
          {/* Top recommendation start */}
          <div className={DashStyles.TopRecommendation}>
            <div className={DashStyles.trHeading} ref={setHeadingRef(0)}>
              <h2 className={DashStyles.TrHead}>Top Recommendations</h2>
              <h4 className={DashStyles.TrContent}>
                Members who match your partner preference
              </h4>
            </div>
            <div className={DashStyles.trContentDisplay}>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <div className={DashStyles.trCard} key={index} ref={(el) => setElementRef(-1)(el)}>
                    <div
                      className={DashStyles.trCardImg}
                      onClick={() => profileView(item.id)}
                    >
                      <img
                        src={
                          item.profilePicture
                            ? `${baseUrl}${item.profilePicture}`
                            : " "
                        }
                        alt="CardImage"
                        className={DashStyles.cardImage}
                      />
                    </div>
                    <div className={DashStyles.trCardDetails}>
                      <div
                        className={DashStyles.trCardDetailSub}
                        onClick={() => profileView(item.id)}
                      >
                        <h5 className={DashStyles.trUserName}>{item.name}</h5>
                        <h6 className={DashStyles.trUserDetails}>
                          {`${item.age} Yrs, ${item.height}cms`}
                        </h6>
                      </div>
                      <div
                        className={DashStyles.LikeButton}
                        onClick={() => likedProfile(item.id)}
                      >
                        <HeartStraight
                          size={30}
                          weight={liked[item.id] ? "fill" : "light"}
                          className={`${DashStyles.likedHeartBefore} ${
                            liked[item.id] ? DashStyles.likedHeart : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  // <motion.div
                  //     key={index}
                  //     initial={{ opacity: 0, y: 20 }}
                  //     animate={{ opacity: 1, y: 0 }}
                  //     transition={{ delay: index * 0.2, duration: 0.5 }}
                  //   >
                  //     <CardComponent profiles={item} profileView={TopMatch} likedProfile={likedProfile}
                  //     liked={liked}
                  //     setLiked={setLiked}
                  //     toggleLike={toggleLike}
                  //     />
                  //   </motion.div>
                ))
              ) : (
                <p>No matches found</p>
              )}
            </div>
            <PaginationAdmin
              itemsPerPage={itemsPerPage}
              userData={currentData}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TopRecommendation;

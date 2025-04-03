import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPAge from "./pages/LoginPage/LoginPAge";
import FormPage1 from "./pages/FormPage1/FormPage1";
import LandingPage from "./pages/LandingPage/LandingPage";
import FormPage2 from "./pages/FormPage2/FormPage2";
import FormPage4 from "./pages/FormPage4/FormPage4";
import FormPage3 from "./pages/FormPage3/FormPage3";
import Formpage5 from "./pages/FormPage5/FormPage5";
import Dashboard from "./pages/Dashboard/Dashboard";
import OtpPage from "./pages/Otppage/OtpPage";
import AdminProfile from "./pages/Admin/adminDashboard/Adimindashboard";
import Report from "./pages/Admin/AdminReportPage/AdminReportPage";
import TopRecommendation from "./pages/TopRecomendation/TopRecommendation";
import Settings from "./pages/Admin/settings/Settings";
import AdminUserProfileView from "./pages/Admin/adminprofile/Adminprofile";
import GetFullUser from "./pages/Admin/userPage/GetFullUser";
import AllMatches from "./pages/AllMatches/AllMatches";
import AdminLanding from "./pages/Admin/adminLoginPage/AdminLogin";
import Report1 from "./pages/ReportViolation/Report1";
import UserMain from "./pages/UserMain/UserMain";
import UserSettings from "./pages/UserSettings/UserSettings";
import LikedProfiles from "./pages/LikedProfiles/LikedProfiles";
import ResetPassword from "./pages/Admin/Passwordreset/PasswordReset";
import { ToastContainer } from "react-toastify";
import MyProfile from "./pages/MyProfile/MyProfile";
import AdminFullReport from "./pages/Admin/Reports/GetFullReport";
import AdminSideUserReport from "./pages/Admin/Reports/Report";
import ProfileVerification from "./pages/Admin/Profile/Profile";
import UnverifiedUsers from "./pages/Admin/Profile/GetFullProfile";
import AdminUserVerification from "./pages/Admin/AdminProfileVerification/AdminVerififcation";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./pages/Checkout/Checkout";
import UserPasswordReset from "./pages/UserPasswordReset/PasswordReset";
import PaymentSuccess from "./pages/Checkout/PaymentSuccess";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
function App() {
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<LoginPAge />} />
          <Route path="/OtpPage" element={<OtpPage />} />
          <Route
            path="/resetPasswordUser/:id/:token"
            element={<UserPasswordReset />}
          />
          <Route element={<ProtectedRoute allowedRoles={[300]} />}>
            <Route path="/formpage1" element={<FormPage1 />} />
            <Route path="/formpage2" element={<FormPage2 />} />
            <Route path="/formpage3" element={<FormPage3 />} />
            <Route path="/formpage5" element={<Formpage5 />} />
            <Route path="/formpage4" element={<FormPage4 />} />
            <Route path="/dashboard/:userId" element={<Dashboard />} />
            <Route
              path="/toprecommendations/:id"
              element={<TopRecommendation />}
            />
            <Route path="/allmatches/:id" element={<AllMatches />} />
            <Route path="/report/:userId" element={<Report1 />} />
            <Route path="/mainuser/:id" element={<UserMain />} />
            <Route path="/Usettings" element={<UserSettings />} />
            <Route path="/Usettings/:id" element={<UserSettings />} />

            <Route path="/likedprofiles/:id" element={<LikedProfiles />} />
            <Route path="/myprofile/:id" element={<MyProfile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={[500]} />}>
            <Route path="/Admindashboard" element={<AdminProfile />} />
            <Route path="/Adminreport" element={<Report />} />
            <Route path="/Adminsettings/:token" element={<Settings />} />
            <Route
              path="/Adminusersview/:id"
              element={<AdminUserProfileView />}
            />
            <Route
              path="/Adminreportview/:id"
              element={<AdminSideUserReport />}
            />
            <Route path="/getFullUser" element={<GetFullUser />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />
            <Route path="/getFullReport" element={<AdminFullReport />} />
            <Route
              path="/profileVerification"
              element={<ProfileVerification />}
            />
            <Route path="/unverifieduser" element={<UnverifiedUsers />} />
            <Route
              path="/userProfileVerify/:id"
              element={<AdminUserVerification />}
            />
          </Route>

          <Route path="/adminlanding" element={<AdminLanding />} />

          {/* <Route path="main/mainuser/:id" element={<UserMain/>} /> */}
          <Route path="/checkout/:userId" element={<Checkout />} />
          <Route path="/payment-success/" element={<PaymentSuccess />} />
        </Routes>

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
      </BrowserRouter>
    </div>
  );
}

export default App;

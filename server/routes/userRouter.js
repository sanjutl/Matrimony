import {
  editUser,
  registerUser,
  verifyOtp,
  resetPassword,
  forgotPassword,
  getUser,
  userLogin,
  getUserById,
  topMatch,
  resendOtp,
  userdetails,
  userReport,
  getNotifications,
  likeProfile,
  likedProfiles,
  getComplaint,
  unVerifiedUser,
  notificationTrigger,
  unreadNotification,
  logout,
  markNotificationAsRead,
  updateUserAccess,
  deleteUser,
  getunlockedProfile,
  subscriptionStatus
} from "../controller/userController.js";
import { Router } from "express";
import upload from "../multer/multer.js";
import multer from "multer";
import { __dirname } from "../app.js";
import { createPaymentIntent } from "../controller/paymentController.js"

const userRouter = Router();
userRouter.route("/register").post(registerUser);
// userRouter.route('/edit/:id').patch(upload.array("image", 2), editUser)
// userRouter.route("/edit/:id").patch(uploads.single("profilePicture"), upload.array("image", 2),editUser);
userRouter.route("/edit/:id").patch(
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "image", maxCount: 2 },
    { name: "pdfFile", maxCount: 1 },
  ]),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "Image Limit" });
      } else if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size should not exceed 5MB!" });
      }
    }
    next();
  },
  editUser
);
userRouter.route("/userdetails").get(userdetails);
userRouter.route("/verifyOtp/:userEmail").post(verifyOtp);
userRouter.route("/getUserById/:id").get(getUser); //all matches
userRouter.route("/resetpassword/:id/:token").post(resetPassword);
userRouter.route("/forgotpassworduser").post(forgotPassword);
userRouter.route("/usercarddetails/:id").get(getUserById); //dashboard api
userRouter.route("/login").post(userLogin);
userRouter.route("/topmatch/:id").get(topMatch);
userRouter.route("/resendOtp/:userEmail").post(resendOtp);
// userRouter.route('/profileLiked/:likedByUserId').post(profileLiked);
// userRouter.route('/likedProfiles/:likedByUserId').get(likedprofiles);
userRouter.route("/userReport/:id").patch(userReport);
userRouter.route("/getNotifications").get(getNotifications);
userRouter.route("/likeProfile/:likerId").post(likeProfile);
userRouter.route("/likedProfiles/:likerId").get(likedProfiles);
userRouter.route("/getComplaint").get(getComplaint);
userRouter.route("/unverfieduser").get(unVerifiedUser);
userRouter.route("/notificationTrigger/:id").get(notificationTrigger);
userRouter.route("/unread/:id").get(unreadNotification);
userRouter.route('/logout').post(logout)
userRouter.route('/notificationPreview/:id').patch(markNotificationAsRead)
// userRouter.route('/notificationPreview/:id').patch(markNotificationAsRead)
userRouter.route('/deleteUser/:id').delete(deleteUser)
userRouter.route('/getunlockedProfile').post(getunlockedProfile)

//STRIPE ROUTES
userRouter.route('/create-payment-intent/:userId').post(createPaymentIntent)
// userRouter.route('/updateUserAccess/:userId/:profileId').post(updateUserAccess)
userRouter.route('/update/:userId').patch(subscriptionStatus)



export default userRouter;

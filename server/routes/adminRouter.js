import { Router } from "express";
import { registerAdmin,adminlogin ,adminlogout,forgotPassword,resetPassword, resetPasswordAdmin} from "../controller/adminController.js";

const adminRouter = Router();

adminRouter.post("/register", registerAdmin);
adminRouter.route('/login').post(adminlogin);
adminRouter.route('/logout').post(adminlogout)
adminRouter.route('/forgotpasswordadmin').post(forgotPassword)
adminRouter.route('/resetpasswordadmin/:token').post(resetPassword); 
adminRouter.route('/resetpassword/:token').patch(resetPasswordAdmin); 


export default adminRouter;

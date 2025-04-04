import { User } from "../model/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Notification } from "../model/notificationModel.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { __dirname } from '../app.js';

const generateShortId = () => {
  const timestamp = Date.now(); // Get current time in milliseconds
  const randomComponent = Math.floor(Math.random() * 1000); // Random number from 0 to 999

  // Combine timestamp and random component to create a unique ID
  const uniqueId = `EZ ${timestamp}${randomComponent}`;

  return uniqueId;
};

const registerUser = async (req, res) => {
  const { relation, firstName, userEmail } = req.body;

  try {
    if (!relation || !firstName || !userEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const userId = generateShortId();

    const role = process.env.USER_ROLE;

    const otp = crypto.randomInt(100000, 999999);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const otpExpiry = Date.now() + 10 * 60 * 1000; 

    const user = await User.create({
      relation,
      firstName,
      userEmail,
      userId,
      role,
      otp: hashedOtp, 
      otpExpiry, 
      isVerified: false, 
    });
    const token = jwt.sign(
      { id: user._id, email: user.userEmail, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" } 
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Email Verification - OTP",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007bff;">Email Verification</h2>
      <p>Your One-Time Password (OTP) for email verification is:</p>
      <p style="font-size: 24px; font-weight: bold; color: #d9534f; background: #f8d7da; padding: 10px; border-radius: 5px; display: inline-block;">
        ${otp}
      </p>
      <p>The OTP is valid for <strong>10 minutes</strong> .Do not share with anyone.</p>
    </div>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "User registered successfully. Please check your email for the OTP.",
      user: {
        id: user._id,
        relation: user.relation,
        firstName: user.firstName,
        userEmail: user.userEmail,
        role: user.role,
      },
      token,
    });
    
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(204).json({ message: "Invalid Cookie" })
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "None"
    })
    return res.status(200).json({ message: "Logout Successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Internal server error due to ${error.message}` })
  }
}

const editUser = async (req, res) => {
  const { id } = req.params;
  console.log("User ID:", id);

  const files = req.files;
  const profilePicture = files?.profilePicture ? files.profilePicture[0] : null;
  const images = files?.image || [];
  const pdfFile = files?.pdfFile ? files.pdfFile[0] : null;

  const {
    dateOfBirth,
    religion,
    motherTongue,
    email,
    password,
    caste,
    subCaste,
    gothram,
    suddhaJathakam,
    dosham,
    gender,
    maritalStatus,
    height,
    familyStatus,
    familyNetworth,
    familyType,
    familyValues,
    physicallyChallenged,
    education,
    employmentStatus,
    occupation,
    annualIncome,
    about,
    location,
    hobbies,
    age,
    city,
    citizenship,
    residentStatus,
    educationDetails,
    state,
    phoneNumber,
    firstName
  } = req.body;

  try {
    // Fetch the existing user
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedData = {
      firstName,
      dateOfBirth,
      religion,
      motherTongue,
      email,
      caste,
      subCaste,
      gothram,
      suddhaJathakam,
      dosham,
      maritalStatus,
      height,
      familyStatus,
      familyNetworth,
      familyType,
      familyValues,
      physicallyChallenged,
      education,
      employmentStatus,
      occupation,
      annualIncome,
      about,
      password,
      gender,
      location,
      hobbies,
      age,
      city,
      citizenship,
      residentStatus,
      educationDetails,
      state,
      phoneNumber,
    };

    let existingImages = existingUser.image || [];

    if (images.length > 0) {
      // Handle the image replacement logic
      if (existingImages.length === 2 && images.length === 1) {
        // Remove one old image if it's replaced by only one image
        const baseDir = path.resolve();
        const imageToRemove = existingImages[0];
        const fullPath = path.join(baseDir, imageToRemove);
        console.log('Attempting to remove image at:', fullPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log('Image removed successfully');
        } else {
          console.log("not found");

        }
        existingImages.shift(); // Remove the first image
      } else if (images.length === 2) {
        // Remove both old images if two new images are uploaded
        existingImages.forEach((imgPath) => {
          const baseDir = path.resolve();

          const fullPath = path.join(baseDir, imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
        existingImages = []; // Clear the existing images
      }

      // Add new images
      existingImages = [
        ...existingImages,
        ...images.map((file) => `/uploads/${file.filename}`),
      ];
    }

    // Update the images in updatedData
    updatedData.image = existingImages;

    if (pdfFile) {
      updatedData.pdfFile = `/uploads/pdf/${pdfFile.filename}`;
    }

    if (profilePicture) {
      const baseDir = path.resolve();
      const imageToRemove = existingUser.profilePicture
      if (imageToRemove) {
        const fullPath = path.join(baseDir, imageToRemove);

    
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    
      // Assign new profile picture path AFTER deletion
      updatedData.profilePicture = `/uploads/${profilePicture.filename}`;
    }

    // Hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    // Update the user data in the database
    const editedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!editedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User edited successfully",
      data: editedUser,
    });
  } catch (error) {
    console.error("Error editing user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default editUser;


const resendOtp = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const user = await User.findOne({ userEmail });
    console.log(user);
    console.log(userEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = crypto.randomInt(100000, 999999); // Generate a new OTP
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // Reset expiry time
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Resend OTP",
      text: `Your new OTP is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Error during OTP resend:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    let userDetails;
    const user = await User.findById(id);
    const gender = user.gender;
    if (gender.toLowerCase() === "male") {
      userDetails = await User.find({ gender: { $in: ["Female", "female"] } });
    } else {
      userDetails = await User.find({ gender: { $in: ["Male", "male"] } });
    }
    return res.status(200).json({ user: userDetails });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { userEmail } = req.body;
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Check the email." });
    }

    const token = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const resetLink = `${process.env.CLIENT_URL}/resetPasswordUser/${user._id}/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Password Reset Request",
      html: `
        <p>Hi ${user.firstName},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email." });
      } else {
        console.log("Email sent:", info.response);
        return res
          .status(200)
          .json({ message: "Password reset email sent successfully." });
      }
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  try {
    // Verify the token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (decoded.id !== id) {
      return res
        .status(400)
        .json({ message: "Invalid token or mismatched user ID." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(password, 10);
    user.password = password;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Reset link has expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid reset link." });
    } else {
      console.error("Error in resetPassword:", error);
      return res
        .status(500)
        .json({ message: "Internal server error.", error: error.message });
    }
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const userdata = await User.findById(id);
    return res.status(200).json({ data: userdata });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  const { userEmail, password } = req.body;
  try {
    // Sanitize and validate input
    if (!userEmail?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user
    const user = await User.findOne({ userEmail: userEmail });

    if (!user) {
      return res.status(404).json({ message: "Email doesn't exist" });
    }
    if (!user.password) {
      return res.status(500).json({ message: "Not Registered User" });
    }
    // Verify password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (!user.isEnabled) {
      return res
        .status(401)
        .json({ message: "You have been disabled by admin" });
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      userId: user._id, // Send MongoDB _id
      token: accessToken,
      role:process.env.USER_ROLE
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized API request" });
  }

  try {
    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(403)
              .json({ message: "Refresh token expired. Please log in again." });
          }
          return res.status(403).json({ message: "Forbidden. Invalid token." });
        }

        let user;
        const role = Number(decoded.role);

        // Retrieve user based on role from decoded token
        if (!role) {
          return res
            .status(403)
            .json({ message: "Forbidden. Invalid user role." });
        }

        // const adminRole = Number(process.env.ADMIN_ROLE);
        const userRole = Number(process.env.USER_ROLE);

        switch (role) {
          // case adminRole:
          //   user = await Admin.findById(decoded.id);
          //   break;
          case userRole:
            user = await User.findById(decoded.id);
            break;
          default:
            return res.status(404).json({ message: "Invalid role" });
        }

        if (!user) {
          return res.status(404).json({ message: "Cannot find user" });
        }

        // Generate new access token
        const accessToken = await user.generateAccessToken();

        return res
          .status(200)
          .json({ message: "User validation successful", data: accessToken });
      }
    );
  } catch (err) {
    console.error("Error during token refresh:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};
const topMatch = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Prepare regex for hobbies
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const hobbiesRegex = user.hobbies
      ? user.hobbies
        .split(",")
        .map((hobby) => escapeRegex(hobby.trim()))
        .join("|")
      : null;
    const oppositeGender =
      user.gender.toLowerCase() === "male" ? "female" : "male";
    // Use 'city' instead of 'location' and case-insensitive gender check
    const userLocation = user.location ? user.location.trim() : '';
    const userOccupation = user.occupation ? user.occupation.trim() : '';
    const userMaritalStatus=user.maritalStatus?user.maritalStatus.trim():'';
    const userEducation=user.education?user.education.trim():"";
    const userAnnualIncome=user.annualIncome?user.annualIncome.trim():"";
    const matchQuery = {
      $or: [
        ...(userLocation ? [{ location: { $regex: new RegExp(`^${escapeRegex(userLocation)}$`, "i") } }] : []),
        ...(hobbiesRegex
          ? [{ hobbies: { $regex: hobbiesRegex, $options: "i" } }]
          : []),
        ...(userOccupation ? [{ occupation: { $regex: new RegExp(`^${escapeRegex(userOccupation)}$`, "i") } }] : []),
        ...(userMaritalStatus
          ? [{ maritalStatus: { $regex: new RegExp(`^${escapeRegex(userMaritalStatus)}$`, "i") } }]
          : []),
          ...(userEducation
            ? [{ education: { $regex: new RegExp(`^${escapeRegex(userEducation)}$`, "i") } }]
            : []),
            ...(userAnnualIncome
              ? [{ annualIncome: { $regex: new RegExp(`^${escapeRegex(userAnnualIncome)}$`, "i") } }]
              : [])
      ],
      gender: { $regex: new RegExp(`^${oppositeGender}$`, 'i') }, // Case-insensitive gender check
      _id: { $ne: user._id }, // Exclude the current user
    };
    // Find matching users
    const matches = await User.find(matchQuery).select("firstName occupation age location hobbies gender height profilePicture maritalStatus education annualIncome");
    if (matches.length === 0) {
      return res.status(200).json({ message: "No matches found", matches: [] });
    }
    // Format the response with matched users
    const response = matches.map((match) => ({
      name: match.firstName,
      id: match._id,
      occupation: match.occupation,
      age: match.age,
      location: match.location,
      hobbies: match.hobbies,
      height: match.height,
      profilePicture: match.profilePicture,
      maritalStatus: match.maritalStatus,
      education: match.education,
      annualIncome: match.annualIncome,
    }));
    res.status(200).json({ message: "Matches found", matches: response });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching matches", error: err.message });
  }
};
const verifyOtp = async (req, res) => {
  const { userEmail } = req.params; // Extract userEmail from URL params
  const { otp } = req.body; // Extract OTP from request body

  if (!userEmail || !otp) {
    return res.status(400).json({ message: "User email and OTP are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is valid and not expired
    const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);
    if (!isOtpValid || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update user status and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Respond with success message
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

const userdetails = async (req, res) => {
  try {
    const userdetails = await User.find();
    return res
      .status(200)
      .json({ message: "User details successfully", data: userdetails });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Internal server error due to", error: error.message });
  }
};

// const profileLiked = async (req, res) => {
//   const { likedByUserId } = req.params;
//   const { likedUserId } = req.body;

//   console.log("liked by user", likedByUserId);
//   console.log("likedUser", likedUserId)

//   try {
//     // Save the like to the database (optional, but for tracking)
//     const like = new likedByProfile({ likedByUserId, likedUserId });
//     await like.save();

//     // Create the notification
//     const message = "Someone liked your profile!";
//     const newNotification = new Notification({
//       senderId: likedByUserId,
//       receiverId: likedUserId,
//       message
//     });

//     // Save the notification to the database
//     await newNotification.save();

//     // Notify the woman (receiver) via Socket.io if she's online
//     if (req.io.sockets.connected[likedUserId]) {
//       req.io.to(likedUserId).emit('newNotification', newNotification);
//     }

//     // Send success response
//     res.status(200).json({ message: 'Profile liked and notification sent successfully' });
//   } catch (error) {
//     console.error('Error liking profile:', error.message);
//     res.status(500).json({ error: 'An error occurred while liking the profile', message: error.message });
//   }
// };

// const likedprofiles = async (req, res) => {
//   const { likedByUserId } = req.params;

//   try {
//     // Find all liked profiles and populate likedUserId to get full user details
//     const likedData = await likedByProfile.find({ likedByUserId })
//       .populate('likedUserId', 'firstName age height location profilePicture') // Fetch selected details

//     if (!likedData || likedData.length === 0) {
//       return res.status(200).json({ message: "No liked profiles found", data: [] });
//     }

//     return res.status(200).json({ message: "Successfully fetched liked profiles", data: likedData });
//   } catch (error) {
//     console.error("Error fetching liked profiles:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// }

const userReport = async (req, res) => {
  const { id } = req.params;
  const { abuseCategory, subject, complaint, complainstAgainst } = req.body;
  try {
    const reportData = await User.findByIdAndUpdate(
      id,
      {
        abuseCategory,
        subject,
        complaint,
        complainstAgainst,
        complaintRegister: true,
      },
      { new: true }
    );
    res.status(200).json({ message: "User report created", data: reportData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// Get notifications for a user
const getNotifications = async (req, res) => {
  const { userId } = req.body;
  try {
    const notifications = await Notification.find({ receiverId: userId }).sort({
      createdAt: -1,
    });
    console.log("notifications", notifications);
    res
      .status(200)
      .json({ message: "Notification fetched sucessfully", notifications });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const likeProfile = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { likerId } = req.params;
    const { likedId } = req.body;

    console.log("Liker ID:", likerId);
    console.log("Liked ID:", likedId);

    if (likedId === likerId) {
      return res
        .status(400)
        .json({ message: "You cannot like your own profile." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(likerId) ||
      !mongoose.Types.ObjectId.isValid(likedId)
    ) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const liker = await User.findById(likerId);
    const likedUser = await User.findById(likedId);

    if (!liker || !likedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (liker.like.includes(likedUser._id)) {
      liker.like = liker.like.filter(
        (id) => id.toString() !== likedUser._id.toString()
      );
      await liker.save();

      await Notification.findOneAndDelete({
        senderId: likerId,
        receiverId: likedId,
      });

      return res.status(200).json({ message: "User Unliked Successfully" });
    }

    liker.like.push(likedUser._id);
    await liker.save();

    const message = `${liker.firstName} liked your profile`;
    const newNotification = new Notification({
      senderId: likerId,
      receiverId: likedId,
      message,
    });
    await newNotification.save();

    io.to(likedId).emit("receiveNotification", newNotification);

    res
      .status(200)
      .json({ message: "Profile liked and notification sent successfully" });
  } catch (error) {
    console.error("Error in likeProfile:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


const likedProfiles = async (req, res) => {
  try {
    const { likerId } = req.params;

    // Find user and populate the "like" array with fullName field
    const user = await User.findById(likerId).populate(
      "like",
      "firstName age height location profilePicture"
    );

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({ likedUsers: user.like });
  } catch (error) {
    console.error("Error fetching liked profiles:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getComplaint = async (req, res) => {
  try {
    const reportedUser = await User.find({ complaintRegister: true });
    res.status(200).json({ reportedUser });
  } catch (error) {
    console.error("Error fetching liked profiles:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const unVerifiedUser = async (req, res) => {
  try {
    const unverfiedUser = await User.find({ userVerified: false })
    if (!unverfiedUser.length === 0) {
      res.status(400).json({ message: "no unverfiedUser found" })
    }
    return res.status(200).json({ unverfiedUser })
  } catch (error) {
    res.status(500).json({ message: "server-error" })
  }
}
const notificationTrigger = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Notification.find({ receiverId: id })
      .sort({ createdAt: -1 })
      .populate("senderId", "name profilePicture");

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const unreadNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notifications = await Notification.find({ receiverId: id, isRead: false });
    res.json({ response: notifications })
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { notified: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification marked as read", updatedNotification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Example route in paymentController.js

const updateUserAccess = async (req, res) => {
  const { userId, profileId } = req.params;

  try {
    // Use { new: true } to get the updated document in the response
    const payment = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { unlockedProfiles: profileId } }, // $addToSet prevents duplicates
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Access Granted', data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



const deleteUser = async (req, res) => {

  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id)
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully", user: deleteUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
const getunlockedProfile = async (req, res) => {
  const { id } = req.body;
  try {
    const response = await User.findById(id).select("unlockedProfiles");
    res.status(200).json({ message: 'get',data:response })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
const subscriptionStatus = async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { subscription: true }, // Directly setting subscription to true
        { new: true }
      );
      res.json({
        message: "Subscription updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
export {
  registerUser,
  editUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  getUser,
  userLogin,
  refreshAccessToken,
  getUserById,
  topMatch,
  userdetails,
  likedProfiles,
  userReport,
  getNotifications,
  likeProfile,
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
  
};

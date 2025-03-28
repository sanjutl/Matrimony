import { Admin } from "../model/adminModel.js";
import { passwordValidator } from "../utils/passwordValidator.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const registerAdmin = async (req, res) => {
  const { firstName, userEmail, password } = req.body;

  try {
    if (!firstName || !userEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!passwordValidator(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const existingAdmin = await Admin.findOne({ userEmail });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const role = Number(process.env.ADMIN_ROLE) || 1;

    const admin = await Admin.create({ firstName, userEmail, password, role });

    const createdAdmin = await Admin.findById(admin._id).select("-password");
    if (!createdAdmin) {
      return res.status(500).json({ message: "Admin registration failed" });
    }

    res.status(201).json({
      message: "Admin registered successfully",
      data: createdAdmin,
    });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};

const adminlogin=async(req,res)=>{
    const{userEmail,password} = req.body
    try {
        const isEmptyField=[userEmail,password].some((field)=>!field || field.trim()==='');
        if(isEmptyField){
            return res.status(400).json({ message: 'All fields are required' });

        }
        let admin = await Admin.findOne({ userEmail: userEmail });
        let adminType = "Admin";
        if (!admin) {
            return res.status(404).json({ message: 'No admin found' });
        }

        const isPasswordCorrect = await admin.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }
        const accessToken = await admin.generateAccessToken();

        const refreshToken = await admin.generateRefreshToken();

        // Store refresh token in a cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });

        return res.status(200).json({
            message: `${adminType} login successful`,
            adminType,
            role:process.env.ADMIN_ROLE,
            token: accessToken,
            admin,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}
const adminlogout = async (req, res) => {
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

const forgotPassword = async (req, res) => {
  const { userEmail } = req.body;
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const CLIENT_URL = process.env.CLIENT_URL;

  if (!ACCESS_TOKEN_SECRET || !CLIENT_URL) {
    return res.status(500).json({ message: "Server configuration error." });
  }

  try {
    const admin = await Admin.findOne({ userEmail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found. Check the email." });
    }

    const token = jwt.sign({ id: admin._id }, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    const resetLink = `${CLIENT_URL}/resetPassword/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Password Reset Request",
      html: `
        <p>Hi ${admin.firstName},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link is valid for 24 hours.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const resetPassword=async(req,res)=>{
  const {token } = req.params;
  const { password } = req.body;
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);  
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
      admin.password = password;
      await admin.save();
  
      return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
const resetPasswordAdmin=async(req,res)=>{
  const {token } = req.params;
  const { password } = req.body;
  const {newPassword}=req.body;

  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);  
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
      const isMatch=await bcrypt.compare(password,admin.password)
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
      admin.password = newPassword;
      await admin.save();
  
      return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export { registerAdmin ,adminlogin,adminlogout,forgotPassword,resetPassword,resetPasswordAdmin};

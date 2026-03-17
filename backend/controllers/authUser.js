import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    // Check existing user
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Aadhaar validation:
    // ✔ 12 digits
    // ✔ Cannot start with 0 or 1


    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Encrypt Aadhaar before storing


    // Profile image
    const profileImage = req.file ? req.file.filename : "user.png";

    await User.create({
      name,
      email,
      password: hashPassword,
      profileImage,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const login=async(req,res)=>{
    try {
        const{email,password}=req.body
        const user=await User.findOne({email})
        if(!user)
            return res.status(400).json({message:"User does not exist"})
        const match= await bcrypt.compare(password,user.password)
        if(!match)
            return res.status(400).json({message:"Invalid credentials"})
        const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{
            expiresIn:'1d'
        })
        res.json({token})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const profile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // 🔥 return full user
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // Create a short-lived token for password reset
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "15m" } // 15 minutes validity
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You requested a password reset. Click here to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`;

    await sendEmail(user.email, "Password Reset Request", message);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // token sent in URL
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: "Password is required" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token expired" });
    }
    res.status(500).json({ message: err.message });
  }
};
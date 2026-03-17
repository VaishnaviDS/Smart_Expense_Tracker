import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { forgotPassword, login, profile, register, resetPassword } from '../controllers/authUser.js'
import { upload } from '../utils/upload.js';
import User from '../models/User.js';

const router=express.Router()
router.post("/register", upload.single("profileImage"), register);
router.post('/login',login)
router.get('/profile',authenticate,profile)
router.put("/profile-image", authenticate, upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImage = req.file.filename;
    await user.save();

    res.json({ message: "Profile image updated", image: user.profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/add-category", authenticate, async (req, res) => {
  try {
    const { category } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.customCategories.includes(category)) {
      user.customCategories.push(category);
      await user.save();
    }

    res.json({ message: "Category added" });

  } catch (err) {
    res.status(500).json({ message: "Error adding category" });
  }
});

export default router;

const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../Schema/User"); // Adjust the path to your User model
const router = express.Router();
const jwt = require("jsonwebtoken");
const Authmid = require("../middleware/AuthMid");
const crypto = require("crypto");
const nodemailer = require("nodemailer"); 


const JsonSecretKey = "FindbooksDAD";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "dhruvbhavsar6205@gmail.com", pass: "vncf cfog orud izhw" }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ Email:email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const otp = crypto.randomInt(100000, 999999); // Generate 6-digit OTP
  user.otp = otp;
  await user.save();

  // Send email
  await transporter.sendMail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. It is valid for 1 minutes.`
  });

  res.json({ message: "OTP sent to email" });
});

// Step 2: Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ Email:email });

  if (!user || user.otp !== otp ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  await user.save();

  res.json({ message: "OTP verified. You can now reset your password" });
});

// Step 3: Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ Email:email });

  if (!user) return res.status(400).json({ message: "User not found" });

  user.Password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password reset successfully" });
});

// Registration route
router.post(
  "/User",
  [
    // Validate fields
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("mobile")
      .isMobilePhone()
      .withMessage("Please provide a valid mobile number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
  ],
  async (req, res) => {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the user already exists
      let user = await User.findOne({ Email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const admin = req.body.role === "Admin" ? true : false;
      const DeliveryPerson = req.body.role === "DeliveryPerson" ? true : false;
      const users = req.body.role === "User" ? true : false;

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create and save the user
      const newUser = new User({
        First_name: req.body.firstName,
        Last_name: req.body.lastName,
        Email: req.body.email,
        Phone_no: req.body.mobile,
        Password: hashedPassword,
        Role: [{
          isUser: users,
          isAdmin: admin,
          isDeliveryPerson: DeliveryPerson,
        }]
      });

      const savedUser = await newUser.save();

      const data = {
        //for generate token threw id
        User: {
          id: newUser.id,
        },
      };
      const authtoken = jwt.sign(data, JsonSecretKey);

      // Respond with success
      res.status(201).json({ user: savedUser, authtoken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/Login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    let success = false;

    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find the user
      let user = await User.findOne({ Email: email });
      if (!user) {
        return res.status(400).json({ success, error: "User does not exist" });
      }

      // Compare passwords
      const comparePass = await bcrypt.compare(password, user.Password);
      if (!comparePass) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      // Generate JWT token
      const data = {
        User: { id: user.id },
      };
      const authtoken = jwt.sign(data, JsonSecretKey);
      success = true;

      // Respond with the token
      console.log("token: ",authtoken);
      res.json({ success, authtoken, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/User", Authmid, async (req, res) => {
  try {
    const User_id = req.userId;
    const user = await User.findOne({_id : User_id});
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }
    res.json({user: user});
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/AllUser", Authmid, async (req, res) => {
    try {
      const users = await User.find({});
      if (!users) {
        return res.status(404).json({ error: "No users data found" });
      }
      res.json({users : users});
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete(
  "/User",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
  ],
  Authmid,
  async (req, res) => {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    try {
      // Find and delete the user
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


router.put("/User",[ 
    body("userId").notEmpty(),
    body("username"),
    body("email"),
    body("mobile"),
    body("password"),
    body("role")
  ],Authmid , async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, firstName, lastName, email, mobile, password, role } = req.body;

  try{
    const user = await User.findOne({_id : userId});
    if(!user){
      return res.status(404).json({ error: "No user found" });
    }

    let updatedData = {};
    if (firstName) updatedData.First_name = firstName;
    if (lastName) updatedData.Last_name = lastName;
    if (email) updatedData.Email = email;
    if (mobile) updatedData.Phone_no = mobile;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.Password = hashedPassword;
    }
    if (role) updatedData.Role[0].isAdmin = role;

    // Update the user
    user = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });

    res.json({ success: true, message: "User updated successfully", user });

  }catch(error){
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})



module.exports = router;

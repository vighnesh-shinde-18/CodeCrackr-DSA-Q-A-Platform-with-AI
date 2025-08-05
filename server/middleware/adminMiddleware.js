const User = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    console.log(1)
    const userId = req.user.id; 
    console.log(2)
    const admin = await User.findOne({ _id: userId, isAdmin : true });
    console.log(3)
    
    if (!admin) {
      console.log(4)
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    console.log(5)
    
    next();
    console.log(6)
  } catch (err) {
    console.error("Admin check failed:", err);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = isAdmin;

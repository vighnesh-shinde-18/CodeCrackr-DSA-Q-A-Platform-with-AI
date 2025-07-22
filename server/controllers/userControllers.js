const User = require('../models/userModel');

const returnUserProfileInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getLeaderboardUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("username email");

    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const questionsSubmitted = await Problem.countDocuments({ createdBy: user._id });
        const answersReplied = await Solution.countDocuments({ createdBy: user._id });
        const answersAccepted = await Solution.countDocuments({ createdBy: user._id, isAccepted: true });

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          questionsSubmitted,
          answersReplied,
          answersAccepted
        };
      })
    );

    res.status(200).json(leaderboardData);
  } catch (err) {
    console.error("Error fetching leaderboard users:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
};

const getUsersCount = async(req,res,next)=>{
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ success: true, data: userCount });
  } catch (error) {
    next(error);
  }
}

module.exports = {
returnUserProfileInfo,
getUsersCount,
getLeaderboardUsers
}
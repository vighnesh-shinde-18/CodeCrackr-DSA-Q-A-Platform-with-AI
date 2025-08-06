const User = require('../models/userModel');
const Problem = require('../models/problemModel')
const Solution = require('../models/solutionModel')

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

const getAllUserStats = async (req, res) => {
  try {
    
    const users = await User.find().lean();
    
    const stats = await Promise.all(
      users.map(async (user) => {
        const totalQuestionsPosted = await Problem.countDocuments({ user: user._id });
        const totalAnswersGiven = await Solution.countDocuments({ user: user._id });
        const totalAcceptedAnswers = await Solution.countDocuments({
          user: user._id,
          accepted: true,
        });

        return {
          userId: user._id,
          username: user.username,
          email: user.email,
          totalQuestionsPosted,
          totalAnswersGiven,
          totalAcceptedAnswers,
        };
      })
    ); 
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getUsersCount = async (req, res, next) => {
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
  getAllUserStats
}
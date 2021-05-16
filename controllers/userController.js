const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
  const userList = await User.find();

  res.status(200).json({
    success: true,
    users: userList,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    message: "endpoint is not implemented yet",
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    message: "endpoint is not implemented yet",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    message: "endpoint is not implemented yet",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: "endpoint is not implemented yet",
  });
};

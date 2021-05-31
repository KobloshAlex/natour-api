const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const _findObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((element) => {
    if (allowedFields.includes(element)) {
      newObj[element] = obj[element];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const userList = await User.find();

  res.status(200).json({
    success: true,
    users: userList,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if use post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("You can not update password", 400));
  }

  const filteredBody = _findObject(req.body, "name", "email");
  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
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

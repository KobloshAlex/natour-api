const { promisify } = require("util");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const _signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const _createAndSendToken = (user, statusCode, res) => {
  const token = _signToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  _createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("email or password is missing", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  _createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //get the token and check if exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Your are not logged in, please log in to get access", 401));
  }
  //validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //if user is still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("The user belonging to the token does not exist"));
  }

  //if user change password after jwt was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changes password. Please log in again"));
  }

  //Grand Access to Protected route
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req);
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("User not found with email address", 404));
  }
  //generate random token
  const restToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${restToken}`;

  const message = `submit patch request with new password and passwordConfirm to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token",
      message,
    });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "token was sent to email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  _createAndSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user from the collection
  const user = await User.findById(req.user.id).select("+password");

  //check if the posted password is correctPassword
  if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError("Your current password is incorrect", 401));
  }

  //if password is correct - update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //log the user in with new password
  _createAndSendToken(user, 201, res);
});

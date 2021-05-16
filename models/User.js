const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    trim: true,
    maxlength: [50, "A tour name must be less or equal 50 characters"],
    minlength: [2, "A tour name must be greater or equal 2 characters"],
  },
  email: {
    type: String,
    required: [true, "A tour must have an email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "please provide password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "please provide password"],
    minLength: 8,
    validate: {
      // works only on create and save
      validator: function (element) {
        return element === this.password;
      },
      message: "Password does not match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

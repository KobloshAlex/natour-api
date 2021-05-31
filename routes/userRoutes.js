const express = require("express");
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateMe,
} = require("../controllers/userController");
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updateMyPassword", protect, updatePassword);

router.patch("/updateMe", protect, updateMe);

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

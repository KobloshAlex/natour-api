const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getTourById,
  updateTour,
  getMonthlyPlan,
  getTourStatistics,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

router.route("/").get(protect, getAllTours).post(createTour);

router.route("/tour-stats").get(getTourStatistics);

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router
  .route("/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;

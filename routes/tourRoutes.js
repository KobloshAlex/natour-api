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
const router = express.Router();

router.route("/").get(getAllTours).post(createTour);

router.route("/tour-stats").get(getTourStatistics);

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;

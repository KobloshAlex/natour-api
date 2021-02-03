const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getTourById,
  updateTour,
} = require("../controllers/tourController");
const router = express.Router();

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;

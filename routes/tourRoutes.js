const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTours,
  getTourById,
  updateTour,
  checkId,
  validateRequest
} = require("../controllers/tourController");
const router = express.Router();

router.param("id", checkId);

router.route("/").get(getAllTours).post(validateRequest, createTour);
router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;

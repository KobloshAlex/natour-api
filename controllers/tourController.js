const Tour = require("../models/Tour");
const APIFeatures = require("../utils/apiFiltering");

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid data sent",
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const feature = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await feature.query;

    res.status(200).json({
      success: true,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Fail to retrieve tours",
    });
  }
};

exports.getTourById = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      success: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Was not able to find tour with id ${id}`,
    });
  }
};

exports.updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Was not able to find tour with id ${id}`,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
    await Tour.findOneAndDelete(id);

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Was not able to find tour with id ${id}`,
    });
  }
};

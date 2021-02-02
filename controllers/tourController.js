const Tour = require("../models/Tour");

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
    const tours = await Tour.find();

    res.status(200).json({
      success: true,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    console.log(error);
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

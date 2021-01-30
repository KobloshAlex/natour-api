const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// check id middleware
exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      success: false,
      message: "invalid ID",
    });
  }
  next();
};

// request validation middleware
exports.validateRequest = (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.property) {
    return res.status(400).json({
      success: false,
      message: "required fields missing",
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    success: true,
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(200).json({
      success: true,
      data: {
        tour: newTour,
      },
    });

    console.log(err);
  });
};

exports.getTourById = (req, res) => {
  const id = req.params.id * 1; //convert to number
  const tour = tours.find((element) => element.id === id);

  res.status(200).json({
    success: true,
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      tour,
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    success: true,
    data: null,
  });
};

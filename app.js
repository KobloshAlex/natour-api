const express = require("express");
const app = express();
const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.use(express.json());
const API_ADDRESS = "/api/v1/tours";
const API_ADDRESS_ID = "/api/v1/tours/:id";

app.get(API_ADDRESS, (req, res) => {
  res.status(200).json({
    success: true,
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post(API_ADDRESS, (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        success: true,
        data: {
          tour: newTour,
        },
      });

      console.log(err);
    }
  );
});

app.get(API_ADDRESS_ID, (req, res) => {
  const id = req.params.id * 1; //convert to number
  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: "invalid ID",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      tour,
    },
  });
});

app.patch(API_ADDRESS_ID, (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      success: false,
      message: "invalid ID",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      tour,
    },
  });
});

app.delete(API_ADDRESS_ID, (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      success: false,
      message: "invalid ID",
    });
  }

  res.status(204).json({
    success: true,
    data: null,
  });
});

const port = 3000;
app.listen(port, () => console.log(`App running on port ${port}`));

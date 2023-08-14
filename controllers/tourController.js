const fs = require('fs');
const Tour = require('../models/tourModel');

const checkId = (req, res, next, val) => {
  console.log(`id is ${val}`);
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail', message: 'Invalid ID'
    })
  }
  next();
}

const getAllTours = async (req, res) => {
  try {
    // 若不帶參數，就會取到整個 collection
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid'
    })
  }
}

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour }
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent'
    })
  }
}

const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    // tour.findOne({ _id: id }) 與下面的 findById 等價
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

const updateTour = (req, res) => {
  // if (req.params.id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail', message: 'Invalid ID'
  //   })
  // }
  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here...>' } })
}

const deleteTour = (req, res) => {
  // if (req.params.id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail', message: 'Invalid ID'
  //   })
  // }
  res.status(204).json({
    status: 'success',
    data: null
  });
}

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
}

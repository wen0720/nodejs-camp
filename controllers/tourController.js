const Tour = require('../models/tourModel');
const APIFeature = require('../utils/apiFeatures');

const checkId = (req, res, next, val) => {
  console.log(`id is ${val}`);
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail', message: 'Invalid ID'
    })
  }
  next();
}

exports.aliasTopTours = (req, res, next) => {
  req.query = {
    sort: '-ratinSAverage,price',
    limit: '5',
    fields: 'name,price,ratinSAverage,summary,difficulty'
  }
  next();
}

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const features = new APIFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    // EXCUTE QUERY
    const tours = await features.query

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

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour }
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req, res) => {
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

exports.updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(
      id,
      req.body, // 要更新的資料
      {
        new: true, // new 會回傳新的資料
        runValidators: true, // 在 schema 設的 validate 會再跑一次
      }
    );
    res.status(200).json({ status: 'success', data: { tour } })
  } catch(err) {
    res.status(400).json({ status: 'fail', message: err });
  }
}

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch(err) {
    res.status(400).json({ status: 'fail', message: err });
  }
}

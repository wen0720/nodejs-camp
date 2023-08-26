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
    // console.log(req.query)

    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    // 排除不要 filter 的 query string
    excludedFields.forEach((field) => { delete queryObj[field]; });

    // 1B) Advanced filterring
    // { difficulty: easy, duration: { $gte: 5 } }
    const queryString = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryString));


    // 2) Sorting
    if (req.query.sort) {
      // { sort: 'price' } 由小到大
      // { sort: '-price' } 由大到小
      const sortBy = req.query.sort.split(',').join(' ')
      console.log(req.query.sort)
      query = query.sort(sortBy);
      // .sort('price ratingAverage') 可以透過多個值排序
    } else {
      // 如果沒傳排序，照 createdAt 排
      query = query.sort('-createdAt')
    }

    // 3) Limit field
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields)
    } else {
      // 如果沒有傳 field，則預設回傳的東西在這裡設定
      query = query.select('-__v')
    }

    // EXCUTE QUERY
    const tours = await query

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
      message: err
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

const updateTour = async (req, res) => {
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

const deleteTour = async (req, res) => {
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

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
}

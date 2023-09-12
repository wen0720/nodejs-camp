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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratinSAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' }, // 設定 null 代表把所有的 doc 當作一個群組
          numTours: { $sum: 1 }, // 每一個 doc +1，所以也就是計算 doc 的總量
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratinSAverage' }, // 原本的 key 要給 $ 字號
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: {
          avgPrice: 1, // 1 代表 ascending
        }
      },
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' }  // ne 是 not equal 的意思，所以會排除掉 EASY
      //   }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    })
  } catch (err) {
    console.log(err.message)
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

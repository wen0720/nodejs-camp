const Tour = require('../models/tourModel');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

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

exports.getAllTours = catchAsync(async (req, res, next) => {
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
})

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { tour: newTour }
  });
})

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // tour.findOne({ _id: id }) 與下面的 findById 等價
  const tour = await Tour.findById(id);
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
})

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(
    id,
    req.body, // 要更新的資料
    {
      new: true, // new 會回傳新的資料
      runValidators: true, // 在 schema 設的 validate 會再跑一次
    }
  );
  res.status(200).json({ status: 'success', data: { tour } })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Tour.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    data: null
  });
})

exports.getTourStats = catchAsync(async (req, res, next) => {
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
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plans = await Tour.aggregate([
    { $unwind: '$startDates' }, // 會依每個 doc startDates 的數量展開
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourCounts: { $sum: 1 },
        tours: { $push: '$name' } // $push 代表是一個 array，這邊就是會找到在同個月份的 tour name
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0, // 0 表示會被移除
      }
    },
    {
      $sort: {
        numTourCounts: -1 // descending
      }
    },
    {
      $limit: 12 // 最多 12 筆
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: plans
  });
})

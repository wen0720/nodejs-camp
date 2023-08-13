const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

const checkBody = (req, res, next) => {
  if (req.body.name && req.body.price) {
    return next();
  }
  res.status(403).json({ status: 'fail', message: 'missing name or price' })
}

const checkId = (req, res, next, val) => {
  console.log(`id is ${val}`);
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail', message: 'Invalid ID'
    })
  }
  next();
}

const getAllTours = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  });
}

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...req.body,
  }
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    // 201 表示 created
    res.status(201).json({
      status: 'success',
      data: { tour: newTour }
    })
  });
}

const getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => Number(el.id) === Number(id));
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' })
  }
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
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
  checkBody
}

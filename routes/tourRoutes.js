const express = require('express');
const router = express.Router();
const tourController =  require('../controllers/tourController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = tourController;

// router.param('id', checkId)

router.route('/')
  .get(getAllTours)
  .post(createTour)

router.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

module.exports = router;

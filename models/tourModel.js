const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name'], // 第 2 個值表示 error message
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    require: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'A tour must have maxGroupSize']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have diffculty']
  },
  ratinSAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have summary']
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required:  [true, 'A tour must have imgCover']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false // query 時，不會回傳
  },
  startDates: [Date],
  slug: String
}, {
  toJSON: { virtuals: true }, // 在取得 json 時，要使用 vitural proprty
  toObject: { virtuals: true } // 在取得 object 時，要使用 vitural proprty
});


// virtual property 是 mongoose 提供的功能，
// 似乎有點像是 vue 的 computed
// 這個值不會存進資料庫裡，當去取資料了之後，
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
})

// DOCUMENT MIDDLEWARE
// pre(): run before .save() and .create()
// tourSchema.pre('save', function(next) {
//   // console.log(this) // 這邊這個 this 會拿到的是當前的 document
//   this.slug = slugify(this.name, {
//     lower: true,
//   })
//   next();
// })

// tourSchema.pre('save', function(next) {
//   console.log('document is going to save');
//   next();
// });

tourSchema.post('save', function(doc, next) {
  console.log(doc); // 這個是剛存進資料庫的那筆 document
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

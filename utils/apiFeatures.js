class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    // 排除不要 filter 的 query string
    excludedFields.forEach((field) => { delete queryObj[field]; });

    // 1B) Advanced filterring
    // { difficulty: easy, duration: { $gte: 5 } }
    const queryString = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      // { sort: 'price' } 由小到大
      // { sort: '-price' } 由大到小
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy);
      // .sort('price ratingAverage') 可以透過多個值排序
    } else {
      // 如果沒傳排序，照 _id 排
      this.query = this.query.sort('-_id')
    }

    return this;
  }
  limitFields() {
    // 3) Limit field
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields)
    } else {
      // 如果沒有傳 field，則預設回傳的東西在這裡設定
      this.query = this.query.select('-__v')
    }
    return this;
  }
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;

    // if (this.queryString.page) {
    //   const numberTours = await Tour.countDocuments(); // 取得 tours 總數
    //   if (skip >= numberTours) {
    //     throw new Error('This page does not exist;')
    //   }
    // }
  }
}

module.exports = APIFeature;

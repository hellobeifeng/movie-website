var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var MovieSchema = new Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

MovieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.updateAt = this.meta.createAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next()
});

MovieSchema.statics = {
  fetch: function (cb) {
    return this.find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this.findOne({_id: id})
      .sort('meta.updateAt')
      .exec(cb);
  }
};

module.exports = MovieSchema;
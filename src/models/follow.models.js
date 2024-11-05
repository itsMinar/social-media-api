const { Schema, model } = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const followSchema = new Schema(
  {
    // The one who follows
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // The one who is being followed
    followeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// add third party plugin for aggregation and pagination
followSchema.plugin(mongooseAggregatePaginate);

const Follow = model('Follow', followSchema);

module.exports = { Follow };

const { Schema, model } = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// add third party plugin for aggregation and pagination
commentSchema.plugin(mongooseAggregatePaginate);

const Comment = model('Comment', commentSchema);

module.exports = { Comment };

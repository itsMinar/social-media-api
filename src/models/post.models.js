const { Schema, model } = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    photos: {
      type: [
        {
          url: String,
        },
      ],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// add third party plugin for aggregation and pagination
postSchema.plugin(mongooseAggregatePaginate);

const Post = model('Post', postSchema);

module.exports = { Post };

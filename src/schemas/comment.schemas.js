const { z } = require('zod');

const addCommentSchema = z.object({
  content: z
    .string({ message: 'content is required' })
    .min(1, 'Content must be at least 1 character'),
});

const updateCommentSchema = addCommentSchema.partial();

module.exports = {
  addCommentSchema,
  updateCommentSchema,
};

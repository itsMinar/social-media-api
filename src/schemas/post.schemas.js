const { z } = require('zod');

const createPostSchema = z.object({
  content: z
    .string({ message: 'Content is required' })
    .min(1, 'Content should be at least 1 character'),
  tags: z
    .array(
      z
        .string({ message: 'tags should be array of string' })
        .min(1, 'tag should be at least 1 character'),
      {
        message: 'tags should be an array',
      }
    )
    .default([]),
});

const updatePostSchema = createPostSchema.partial();

module.exports = {
  createPostSchema,
  updatePostSchema,
};

/**
 * Blog — a financial-insights article with draft/publish workflow and SEO slug.
 */
import mongoose from 'mongoose';
import slugify from 'slugify';
import { BLOG_STATUS, BLOG_STATUS_VALUES } from '../constants/index.js';
import { mediaSchema } from './common.schema.js';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    coverImage: { type: mediaSchema, default: () => ({}) },

    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, default: 'General', index: true },
    tags: { type: [String], default: [] },

    status: {
      type: String,
      enum: BLOG_STATUS_VALUES,
      default: BLOG_STATUS.DRAFT,
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    readTimeMins: { type: Number, default: 3 },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });

blogSchema.pre('save', function beforeSave() {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Estimate read time (~200 wpm) whenever content changes.
  if (this.isModified('content') && this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.readTimeMins = Math.max(1, Math.round(words / 200));
  }
  // Stamp publish time on first transition to published.
  if (this.isModified('status') && this.status === BLOG_STATUS.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export const Blog = mongoose.model('Blog', blogSchema);
export default Blog;

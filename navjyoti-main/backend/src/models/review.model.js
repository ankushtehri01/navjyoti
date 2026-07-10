/**
 * Review — a customer testimonial. May be linked to a User or submitted with a
 * name/designation. Requires admin approval before appearing publicly.
 */
import mongoose from 'mongoose';
import { mediaSchema } from './common.schema.js';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    designation: { type: String, default: '' },
    avatar: { type: mediaSchema, default: () => ({}) },

    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    message: { type: String, required: true },

    isApproved: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ isApproved: 1, isFeatured: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
export default Review;

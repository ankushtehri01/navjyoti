/**
 * FAQ — a question/answer entry, grouped by category and ordered for display.
 */
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General', index: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

faqSchema.index({ category: 1, order: 1 });

export const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;

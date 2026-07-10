/**
 * Settings — a singleton document holding editable site-wide content
 * (contact info, socials, hero copy, headline stats, maintenance flag).
 * Access via Settings.getSingleton().
 */
import mongoose from 'mongoose';

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true, immutable: true },

    siteName: { type: String, default: 'Nav Jyoti' },
    tagline: { type: String, default: 'Capital that keeps your business moving' },
    supportEmail: { type: String, default: 'support@navjyoti.com' },
    supportPhone: { type: String, default: '' },
    address: { type: String, default: '' },

    socials: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },

    hero: {
      heading: { type: String, default: '' },
      subheading: { type: String, default: '' },
    },
    stats: { type: [statSchema], default: [] },

    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/** Fetch (or lazily create) the single settings document. */
settingsSchema.statics.getSingleton = async function getSingleton() {
  const existing = await this.findOne({ key: 'site' });
  if (existing) return existing;
  return this.create({ key: 'site' });
};

export const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;

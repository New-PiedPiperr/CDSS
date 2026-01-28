import mongoose from 'mongoose';

const SelfTestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    testId: {
      type: String,
      required: true,
    },
    testTitle: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

const SelfTest = mongoose.models.SelfTest || mongoose.model('SelfTest', SelfTestSchema);

export default SelfTest;

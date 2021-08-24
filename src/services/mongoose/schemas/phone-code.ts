import { Schema } from "mongoose"

// TODO: this DB should be capped.
export const PhoneCodeSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  phone: {
    // TODO we should store country as a separate string
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  sms_provider: String,
})

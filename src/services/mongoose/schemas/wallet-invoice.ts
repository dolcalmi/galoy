import { Schema } from "mongoose"

export const invoiceUserSchema = new Schema({
  _id: String, // hash of invoice
  uid: String,

  // usd equivalent. sats is attached in the invoice directly.
  // optional, as BTC wallet doesn't have to set a sat amount when creating the invoice
  usd: Number,

  timestamp: {
    type: Date,
    default: Date.now,
  },

  selfGenerated: {
    type: Boolean,
    default: true,
  },

  pubkey: {
    type: String,
    require: true,
  },

  paid: {
    type: Boolean,
    default: false,
  },
})

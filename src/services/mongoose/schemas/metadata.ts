import { Schema } from "mongoose"

export const dbMetadataSchema = new Schema({
  version: Number,
  minBuildNumber: Number,
  lastBuildNumber: Number,
  routingFeeLastEntry: Date,
})

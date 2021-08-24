import { Schema } from "mongoose"

export const priceSchema = new Schema({
  // TODO:
  // split array in days instead of one big array.
  // More background here:
  // https://www.mongodb.com/blog/post/time-series-data-and-mongodb-part-2-schema-design-best-practices
  _id: {
    type: Date, // TODO does _id would prevent having several key (ie: Date) for other exchanges?
    unique: true,
  },
  o: Number, // opening price
})

// price History
export const priceHistorySchema = new Schema({
  pair: {
    name: {
      type: String,
      enum: ["BTC/USD"],
    },
    exchange: {
      name: {
        type: String,
        // enum: ["kraken"], // others
      },
      price: [priceSchema],
    },
  },
})

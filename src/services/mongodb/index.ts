import mongoose, { connection } from "mongoose"

import { loadLedger } from "@services/ledger"

import { ConfigError } from "@config"

import { baseLogger } from "../logger"

import { User, Transaction, InvoiceUser } from "../mongoose/schema"
import { mongoose as mongooseMedici } from "medici"

// we have to import schema before ledger

export const ledger = loadLedger({
  bankOwnerWalletResolver: async () => {
    const result = await User.findOne({ role: "bankowner" }, { defaultWalletId: 1 })
    if (!result) throw new ConfigError("missing bankowner")
    return result.defaultWalletId
  },
  dealerWalletResolver: async () => {
    const result = await User.findOne({ role: "dealer" }, { defaultWalletId: 1 })
    if (!result) throw new ConfigError("missing dealer")
    return result.defaultWalletId
  },
  funderWalletResolver: async () => {
    const result = await User.findOne({ role: "funder" }, { defaultWalletId: 1 })
    if (!result) throw new ConfigError("missing funder")
    return result.defaultWalletId
  },
})

// TODO add an event listenever if we got disconnecter from MongoDb
// after a first successful connection

const user = process.env.MONGODB_USER ?? "testGaloy"
const password = process.env.MONGODB_PASSWORD
const address = process.env.MONGODB_ADDRESS ?? "mongodb"
const db = process.env.MONGODB_DATABASE ?? "galoy"

const path = `mongodb://${user}:${password}@${address}/${db}`

export const setupMongoConnection = async (syncIndexes = false) => {
  try {
    await mongoose.connect(path, {
      bufferCommands: false,
    })
    await mongooseMedici.connect(path, {
      bufferCommands: false,
    })
    mongoose.set("debug", true)
    mongooseMedici.set("debug", true)
    console.warn("create models", mongoose.connection.readyState)
    console.warn("create models", mongooseMedici.connection.readyState)
    // // await initModels()
    // // console.warn("end create models")
  } catch (err) {
    baseLogger.fatal({ err, user, address, db }, `error connecting to mongodb`)
    throw err
  }

  try {
    mongoose.set("runValidators", true)
    if (syncIndexes) {
      await User.syncIndexes()
      await Transaction.syncIndexes()
      await InvoiceUser.syncIndexes()
    }
  } catch (err) {
    baseLogger.fatal({ err, user, address, db }, `error setting the indexes`)
    throw err
  }

  return mongoose
}

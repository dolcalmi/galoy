import * as _ from "lodash"
import { getFeeRates, getTwoFAConfig, levels } from "@config/app"
import { getUsernameRegex } from "@domain/users"
import { Schema } from "mongoose"

const feeRates = getFeeRates()
const regexUsername = getUsernameRegex()
const twoFAConfig = getTwoFAConfig()

export const UserSchema = new Schema<UserType>({
  depositFeeRatio: {
    type: Number,
    default: feeRates.depositFeeVariable,
    min: 0,
    max: 1,
  },
  withdrawFee: {
    type: Number,
    default: feeRates.withdrawFeeFixed,
    min: 0,
  },
  lastConnection: Date,
  lastIPs: {
    type: [
      {
        ip: String,
        provider: String,
        country: String,
        region: String,
        city: String,
        //using Type instead of type due to its special status in mongoose
        Type: String,
        firstConnection: {
          type: Date,
          default: Date.now,
        },
        lastConnection: Date,
      },
    ],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  earn: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    // FIXME: role is a mix between 2 things here
    // there can be many users and editors
    // there can be only one dealer, bankowner and funder
    // so we may want different property to differentiate thoses
    enum: ["user", "editor", "dealer", "bankowner", "funder"],
    required: true,
    default: "user",
    // TODO : enfore the fact there can be only one dealer
  },

  onchain: {
    type: [
      {
        pubkey: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  level: {
    type: Number,
    enum: levels,
    default: 1,
  },

  // TODO: refactor, have phone and twilio metadata in the same sub-object.
  phone: {
    // TODO we should store country as a separate string
    type: String,
    required: true,
    unique: true,
  },
  twilio: {
    carrier: {
      error_code: String, // check this is the right syntax
      mobile_country_code: String,
      mobile_network_code: String,
      name: String,
      type: {
        types: String,
        enum: ["landline", "voip", "mobile"],
      },
    },
    countryCode: String,
  },

  username: {
    type: String,
    match: [regexUsername, "Username can only have alphabets, numbers and underscores"],
    minlength: 3,
    maxlength: 50,
    index: {
      unique: true,
      collation: { locale: "en", strength: 2 },
      partialFilterExpression: { username: { $type: "string" } },
    },
  },
  deviceToken: {
    type: [String],
    default: [],
  },
  currencies: {
    validate: {
      validator: function (v) {
        return _.sumBy(v, "ratio") === 1
      },
    },
    type: [
      {
        id: {
          type: String,
          enum: ["BTC", "USD"],
          required: true,
        },
        ratio: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
      },
    ],
    required: true,
    default: [{ id: "BTC", ratio: 1 }],
  },
  contacts: {
    type: [
      {
        id: {
          type: String,
          collation: { locale: "en", strength: 2 },
        },
        name: String,
        transactionsCount: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
  language: {
    type: String,
    enum: ["en", "es", ""],
    default: "",
  },

  title: String,
  coordinate: {
    type: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
  },

  excludeCashback: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ["active", "locked"],
    default: "active",
  },

  twoFA: {
    secret: {
      type: String,
    },
    threshold: {
      type: Number,
      default: twoFAConfig.threshold,
    },
  },
})

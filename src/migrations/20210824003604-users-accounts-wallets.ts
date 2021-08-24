const users = [
  "phone",
  "twilio",
  "username",
  "deviceToken",
  "lastConnection",
  "lastIPs",
  "language",
  "status",
  "role",
  "title",
  "twoFA",
]
const accounts = [
  "earn",
  "role",
  "contacts",
  "title",
  "coordinate",
  "wallets",
  "level",
  "status",
]
const wallets = ["currencies", "depositFeeRatio", "withdrawFee", "onchain"]

const removeAttributes = (collection, attrs) => {
  const unsets = attrs.reduce((obj, key) => {
    return { ...obj, [key]: 1 }
  }, {})

  return collection.updateMany(
    {},
    {
      $unset: unsets,
    },
  )
}

const addAttributes = (collection, attrs) => {
  return collection.updateMany({}, [
    {
      $set: attrs,
    },
  ])
}

module.exports = {
  async up(db, client) {
    await db
      .collection("users")
      .aggregate([{ $match: {} }, { $out: "users_bak" }])
      .toArray()

    await db
      .collection("users")
      .aggregate([{ $match: {} }, { $out: "accounts" }])
      .toArray()

    await db
      .collection("users")
      .aggregate([{ $match: {} }, { $out: "wallets" }])
      .toArray()

    await removeAttributes(db.collection("wallets"), [
      "excludeCashback",
      "currencies",
      ...users,
      ...accounts,
    ])

    await removeAttributes(db.collection("accounts"), [
      "excludeCashback",
      ...users,
      ...wallets,
    ])

    await removeAttributes(db.collection("users"), [
      "excludeCashback",
      ...wallets,
      ...accounts,
    ])

    await addAttributes(db.collection("wallets"), { currency: "BTC" })
    await addAttributes(db.collection("users"), {
      defaultAccountId: "$_id",
      accounts: ["$_id"],
    })
    await addAttributes(db.collection("accounts"), {
      wallets: ["$_id"],
    })
  },

  async down(db, client) {
    await db.collection("accounts").drop()
    await db.collection("wallets").drop()
    await db.collection("users").drop()
    await db
      .collection("users_bak")
      .aggregate([{ $match: {} }, { $out: "users" }])
      .toArray()
    await db.collection("users_bak").drop()
  },
}

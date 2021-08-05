import { DbError } from "@core/error"
import { baseLogger } from "@services/logger"
import { InvoiceUser } from "./schema"

const parseInvoiceUser = (iu): InvoiceWallet => {
  if (iu) {
    return {
      id: iu._id,
      walletId: iu.uid,
      ...iu.toObject(),
    } as InvoiceWallet
  }
  return null
}

export default {
  findById: async (id: string): Promise<InvoiceWallet> =>
    parseInvoiceUser(await InvoiceUser.findOne({ _id: id })),

  findPendingByWalletId: async (walletId: string): Promise<InvoiceWallet[]> => {
    const invoices = await InvoiceUser.find({ uid: walletId, paid: false })
    return invoices.map((i) => parseInvoiceUser(i))
  },

  create: async ({
    id,
    walletId,
    selfGenerated,
    pubkey,
  }: CreateInvoiceWallet): Promise<InvoiceWallet> => {
    try {
      const result = await new InvoiceUser({
        _id: id,
        uid: walletId,
        selfGenerated,
        pubkey,
      }).save()

      return parseInvoiceUser(result)
    } catch (err) {
      // FIXME if the mongodb connection has not been instantiated
      // this fails silently
      const error = `error storing invoice to db`
      throw new DbError(error, { logger: baseLogger, level: "error" })
    }
  },

  confirm: async (id: string): Promise<boolean> => {
    const result = await InvoiceUser.updateOne({ _id: id }, { paid: true })
    return result.nModified > 0
  },

  deleteById: async (id: string): Promise<boolean> => {
    const result = await InvoiceUser.deleteOne({ _id: id })
    return result.deletedCount > 0
  },

  deleteBefore: async (date: Date): Promise<number> => {
    const result = await InvoiceUser.deleteMany({ timestamp: { $lt: date } })
    return result.deletedCount
  }
}

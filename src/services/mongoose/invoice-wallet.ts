import { DbError } from "@core/error"
import { baseLogger } from "@services/logger"
import { InvoiceUser } from "./schema"

export default {
  create: async ({
    id,
    walletId,
    selfGenerated,
    pubkey,
  }: InvoiceWallet): Promise<InvoiceWallet> => {
    try {
      const result = await new InvoiceUser({
        _id: id,
        uid: walletId,
        selfGenerated,
        pubkey,
      }).save()

      return {
        id: result._id,
        walletId: result.uid,
        ...result.toObject(),
      } as InvoiceWallet
    } catch (err) {
      // FIXME if the mongodb connection has not been instantiated
      // this fails silently
      const error = `error storing invoice to db`
      throw new DbError(error, { logger: baseLogger, level: "error" })
    }
  },
}

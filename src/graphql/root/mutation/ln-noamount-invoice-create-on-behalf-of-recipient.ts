import { addInvoiceNoAmountForRecipient } from "@app/wallets"
import { GT } from "@graphql/index"

import LnNoAmountInvoicePayload from "@graphql/types/payload/ln-noamount-invoice"
import Memo from "@graphql/types/scalar/memo"
import WalletName from "@graphql/types/scalar/wallet-name"

const LnNoAmountInvoiceCreateOnBehalfOfRecipientInput = new GT.Input({
  name: "LnNoAmountInvoiceCreateOnBehalfOfRecipientInput",
  fields: () => ({
    recipient: { type: GT.NonNull(WalletName) },
    memo: { type: Memo },
  }),
})

const LnNoAmountInvoiceCreateOnBehalfOfRecipientMutation = GT.Field({
  type: GT.NonNull(LnNoAmountInvoicePayload),
  args: {
    input: { type: GT.NonNull(LnNoAmountInvoiceCreateOnBehalfOfRecipientInput) },
  },
  resolve: async (_, args) => {
    const { recipient, memo } = args.input

    for (const input of [recipient, memo]) {
      if (input instanceof Error) {
        return { errors: [{ message: input.message }] }
      }
    }

    const result = await addInvoiceNoAmountForRecipient({
      recipient,
      memo,
    })

    if (result instanceof Error) {
      return { errors: [{ message: result.message || result.name }] } // TODO: refine error
    }

    const { paymentRequest, paymentHash, paymentSecret } = result

    return {
      errors: [],
      invoice: {
        paymentRequest,
        paymentHash,
        paymentSecret,
      },
    }
  },
})

export default LnNoAmountInvoiceCreateOnBehalfOfRecipientMutation

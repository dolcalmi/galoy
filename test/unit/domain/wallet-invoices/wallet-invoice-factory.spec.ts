import { MakeWalletInvoiceFactory } from "@domain/wallet-invoices/wallet-invoice-factory"

let walletInvoiceFactory: IWalletInvoiceFactory

beforeAll(async () => {
  walletInvoiceFactory = MakeWalletInvoiceFactory("id" as WalletId)
})

describe("wallet invoice factory methods", () => {
  it("translates a registered invoice to wallet invoice", () => {
    const registeredInvoice: RegisteredInvoice = {
      invoice: {
        paymentHash: "paymentHash" as PaymentHash,
        paymentSecret: "paymentSecret" as PaymentSecret,
        paymentRequest: "paymentRequest" as EncodedPaymentRequest,
      },
      pubkey: "pubkey" as Pubkey,
    }
    const result = walletInvoiceFactory.create({ registeredInvoice })
    const expected = {
      paymentHash: "paymentHash",
      walletId: "id",
      selfGenerated: true,
      pubkey: "pubkey",
      paid: false,
    }
    expect(result).toEqual(expected)
  })

  it("translates a registered invoice to wallet invoice for a recipient", () => {
    const registeredInvoice = {
      invoice: {
        paymentHash: "paymentHash" as PaymentHash,
        paymentSecret: "paymentSecret" as PaymentSecret,
        paymentRequest: "paymentRequest" as EncodedPaymentRequest,
      },
      pubkey: "pubkey" as Pubkey,
    }
    const result = walletInvoiceFactory.createForRecipient({ registeredInvoice })
    const expected = {
      paymentHash: "paymentHash",
      walletId: "id",
      selfGenerated: false,
      pubkey: "pubkey",
      paid: false,
    }
    expect(result).toEqual(expected)
  })
})

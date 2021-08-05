type InvoiceWallet = CreateInvoiceWallet & {
  usd: number
  timestamp: Date
  paid: boolean
}

type CreateInvoiceWallet = {
  id: string
  walletId: string
  selfGenerated: boolean
  pubkey: string
}

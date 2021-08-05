type InvoiceWallet = {
  id: string
  walletId: string
  selfGenerated: boolean
  pubkey: string
  usd: number
  timestamp: Date
  paid: boolean
} | null

type CreateInvoiceWallet = {
  id: string
  walletId: string
  selfGenerated: boolean
  pubkey: string
}

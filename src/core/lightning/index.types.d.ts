type AuthenticatedLnd = import("lightning").AuthenticatedLnd

interface IAddInvoiceRequest {
  value: number
  memo: string | undefined
  selfGenerated?: boolean
  currency: string
}

interface IFeeRequest {
  amount?: number
  invoice?: string
  username?: string
}

interface IPaymentRequest {
  username?: string
  amount?: number
  invoice?: string
  memo?: string
  isReward?: boolean
}

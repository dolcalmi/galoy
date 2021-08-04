type Liquidity = null | {
  id: string

  /**
   * amount in satoshis
   */
  amount: number

  /**
   * Price per satoshi
   */
  price: number

  /**
   * expiration date in unix timestamp (seconds)
   */
  expiresAt: number
}

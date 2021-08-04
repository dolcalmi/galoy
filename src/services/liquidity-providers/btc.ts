import moment from "moment"

const currency = "BTC"

export default {
  currency,

  isEnabled: (): Promise<boolean> => Promise.resolve(true),

  checkLiquidity: (amount: number): Promise<Liquidity> => {
    const date = moment()
    // TODO: add delay from config
    const expiresAt = date.add(1, "days").unix()
    // TODO: add checks to verify onchain wallet and lightning channel capacity
    return Promise.resolve({
      id: `${date.unix()}`,
      amount,
      price: 1,
      expiresAt,
    })
  },
}

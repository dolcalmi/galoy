import moment from "moment"
import { IProvider } from "@core/liquidity-provider/provider"
import { getCurrentPrice } from "@services/realtime-price"

export default function (currency): IProvider {
  if (!currency) {
    throw new Error("Provider currency is required")
  }

  return {
    currency,

    // TODO: replace this with a query to dealer service
    isEnabled: (): Promise<boolean> => Promise.resolve(true),

    checkLiquidity: (amount: number): Promise<Liquidity> => {
      // TODO: replace this with a query to dealer service
      const date = moment()
      const expiresAt = date.add(2, "minutes").unix()
      // TODO: query/resolve from dealer
      return getCurrentPrice().then((price) => ({
        id: `${date.unix()}`,
        amount: Math.ceil(amount / price),
        price,
        expiresAt,
      }))
    },
  }
}

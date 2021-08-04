import { IProvider } from "./provider"

const providers = new Map<string, IProvider>()

export default {
  providers,

  addProvider: (provider: IProvider): boolean => {
    if (providers.has(provider.currency)) {
      return false
    }
    providers.set(provider.currency, provider)
    return true
  },

  checkLiquidity: async ({ currency = "BTC", amount = 0 }): Promise<Liquidity> => {
    const provider = providers.get(currency)
    if (provider && (await provider.isEnabled())) {
      return provider.checkLiquidity(amount)
    }
    return Promise.resolve(null)
  },
}

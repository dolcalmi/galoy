import liquidityProvider from "@core/liquidity-provider"
import bitcoinProvider from "./btc"
import createFiatProvider from "./fiat"

export default {
  setupLiquidityProviders: () => {
    if (liquidityProvider.providers.size > 0) {
      return
    }

    // add default btc provider
    liquidityProvider.addProvider(bitcoinProvider)

    // TODO: replace this with a query to db, config or dealer user currency
    const supportedFiatCurrencies = ["USD"]
    for (const currency of supportedFiatCurrencies) {
      liquidityProvider.addProvider(createFiatProvider(currency))
    }
  },
}

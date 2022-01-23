import { getUserWalletConfig } from "@config"

import { Prices } from "@app"

import { UserWallet } from "./user-wallet"

export const WalletFactory = async ({ user, logger }: { user; logger: Logger }) => {
  // FIXME: update price on event outside of the wallet factory
  const lastPrice = await Prices.getCurrentPrice()
  if (lastPrice instanceof Error) throw lastPrice
  UserWallet.setCurrentPrice(lastPrice)

  const userWalletConfig = getUserWalletConfig(user)

  return new UserWallet({ user, logger, config: userWalletConfig })
}

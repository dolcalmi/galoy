import { InvalidWalletName } from "@domain/errors"

export { WalletTransactionHistory } from "./tx-history"
export * from "./tx-methods"
export * from "./tx-status"

export const WalletNameRegex = /(?!^(1|3|bc1|lnbc1))^[0-9a-z_]+$/i

export const checkedToWalletName = (walletName): WalletName | ValidationError => {
  if (!walletName.match(WalletNameRegex)) {
    return new InvalidWalletName(walletName)
  }
  return walletName as WalletName
}

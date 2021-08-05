import { Repositories } from "./index.types"
import { DefaultInvoiceWalletRepository } from "./invoice-wallet"

const repositories: Repositories = {
  invoiceWalletRepo: DefaultInvoiceWalletRepository,
}

export default {
  initialize: (repos: Repositories) => {
    for (const repo in repos) {
      repositories[repo] = repos[repo]
    }
  },
  getInvoiceWalletRepo: () => {
    return repositories.invoiceWalletRepo
  },
}

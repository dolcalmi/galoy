export interface IInvoiceWalletRepository {
  /**
   * Creates a new invoice wallet
   * @method create
   * @param  invoice invoice to be saved
   * @return         saved invoice
   */
  create(invoice: CreateInvoiceWallet): Promise<InvoiceWallet>
}

export const DefaultInvoiceWalletRepository = {
  create: (): Promise<InvoiceWallet> => Promise.reject("Method not implemented."),
}

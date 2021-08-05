export interface IInvoiceWalletRepository {
  /**
   * Find an invoice by id
   * @method findById
   * @param  id       invoice id
   * @return          invoice wallet or null
   */
  findById(id: string): Promise<InvoiceWallet>

  /**
   * Find pending invoices by wallet id
   * @method findPendingByWalletId
   * @param  walletId              wallet id
   * @return                       array of invoices
   */
  findPendingByWalletId(walletId: string): Promise<InvoiceWallet[]>

  /**
   * Creates a new invoice wallet
   * @method create
   * @param  invoice invoice to be saved
   * @return         saved invoice
   */
  create(invoice: CreateInvoiceWallet): Promise<InvoiceWallet>

  /**
   * Mark an invoice as paid
   * @method confirm
   * @param  id      invoice idea
   * @return         true if the invoice was updated
   */
  confirm(id: string): Promise<boolean>

  /**
   * Delete an invoice by id
   * @method deleteById
   * @param  id         invoice id
   * @return            true if the invoice was deleted
   */
  deleteById(id: string): Promise<boolean>

  /**
   * Delete invoices created before date param
   * @method deleteBefore
   * @param  date                date
   * @return                     number of invoices deleted
   */
  deleteBefore(date: Date): Promise<number>
}

const notImplemented = () => Promise.reject("Method not implemented.")

export const DefaultInvoiceWalletRepository = {
  findById: notImplemented,
  findPendingByWalletId: notImplemented,
  create: notImplemented,
  confirm: notImplemented,
  deleteById: notImplemented,
  deleteBefore: notImplemented,
}

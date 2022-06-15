import { toLiabilitiesWalletId } from "@domain/ledger"
import { LedgerService } from "@services/ledger"
import { lndAccountingPath } from "@services/ledger/accounts"
import Book, { initModels } from "medici"

describe("test", () => {
  it("test ledger", async () => {
    await initModels()
    // const book = new Book("MyBook");
    // const entry = book.entry("desc")
    // const meta = {
    //   currency: "BTC",
    //   pending:false,
    //   type: "payment"
    // }
    // entry
    //   .credit(lndAccountingPath, 1000, meta)
    //   .debit(toLiabilitiesWalletId("a" as WalletId), 1000, meta)
    // console.warn("commit")
    // const r = await entry.commit()
    const r = await LedgerService().getWalletBalance("120003f7-a979-471c-bc3a-d7025a10db31" as WalletId)
    expect(r).toBe("")
  })
})
